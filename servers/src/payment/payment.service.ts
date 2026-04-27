import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PaymentRepository } from './payment.repository';
import { VNPayService } from '../vnpay/vnpay.service';

import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import { QueryPaymentDto } from './dto/query-payment.dto';
import { PaymentCache } from './payment.cache';
import * as PaymentHelper from './payment.helper';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private repository: PaymentRepository,
    private vnpayService: VNPayService,

    private cacheService: PaymentCache,
  ) {}

  async create(data: CreatePaymentDto, ipAddr: string = '127.0.0.1') {
    // Tự động chuyển đổi từ PAYOS sang VNPAY để tránh lỗi đồng bộ
    if (data.method === ('PAYOS' as any)) {
      data.method = 'VNPAY' as any;
    }

    const order = await this.repository.findOrderById(data.orderId);
    if (!order) {
      throw new BadRequestException('Order not found');
    }

    const existingPayment = await this.repository.findByOrderId(data.orderId);
    
    if (existingPayment && existingPayment.status === 'SUCCESS') {
      return PaymentHelper.serializePayment(existingPayment);
    }

    let transactionId: string | null = null;
    let paymentLink: string | null = null;

    console.log(`[PaymentService] Creating payment for order ${order.orderCode}, Method: ${data.method}`);

    if (data.method === 'VNPAY') {
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(2, 11);
      transactionId = `VNP${timestamp}_${randomSuffix}`;
      
      paymentLink = this.vnpayService.createPaymentUrl({
        amount: order.total,
        orderInfo: `Thanh toan don hang ${order.orderCode}`,
        vnp_TxnRef: order.orderCode as string,
        ipAddr: ipAddr,
      });

      console.log(`[PaymentService] VNPay Link Generated: ${paymentLink ? 'YES' : 'NO'}`);
      
      if (!paymentLink) {
        throw new BadRequestException('Không thể khởi tạo liên kết thanh toán VNPay. Vui lòng kiểm tra cấu hình hệ thống.');
      }
    } else {
      transactionId = PaymentHelper.generateTransactionId(data.method);
    }

    let payment;
    if (existingPayment) {
      payment = await this.repository.update(existingPayment.id, {
        method: data.method,
        status: data.status || 'PENDING',
        amount: order.total,
        transactionId,
        paymentLink,
      });
    } else {
      payment = await this.repository.create({
        order: { connect: { id: data.orderId } },
        method: data.method,
        status: data.status || 'PENDING',
        amount: order.total,
        transactionId,
        paymentLink,
      });
    }

    await this.cacheService.clearPaymentCaches();
    
    // TRẢ VỀ ĐỐI TƯỢNG PHẲNG (PLAIN OBJECT) - TRÁNH SERIALIZATION LÀM MẤT DỮ LIỆU
    const serializedPayment = PaymentHelper.serializePayment(payment);
    
    return {
      ...serializedPayment,
      paymentLink: paymentLink, // Đảm bảo luôn có ở cấp này
    };
  }

  async updateStatus(id: number, data: UpdatePaymentStatusDto) {
    const payment = await this.repository.findById(id);
    if (!payment) {
      throw new BadRequestException('Payment not found');
    }

    const updatedPayment = await this.repository.updateStatusWithTransaction(
      id,
      data.status,
      payment.orderId,
      payment.order.orderItems,
    );

    if (data.status === 'REFUNDED') {
      this.logger.log(`Payment ${id} REFUNDED - Restoring stock`);
      for (const item of payment.order.orderItems) {
        await this.repository.incrementVariantStock(item.variantId, item.quantity);
      }
      if (payment.order.status === 'DELIVERED') {
        for (const item of payment.order.orderItems) {
          await this.repository.decrementProductSoldCount(item.variant.productId, item.quantity);
        }
      }
    }

    await this.cacheService.clearRelatedCaches(id, payment.orderId);
    return PaymentHelper.serializePayment(updatedPayment);
  }

  /**
   * Initiate refund for a successful payment
   * This should be called when order is cancelled to request refund from payment gateway
   */
  async initiateRefund(paymentId: number) {
    const payment = await this.repository.findById(paymentId);
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status !== 'SUCCESS') {
      throw new BadRequestException('Can only refund successful payments');
    }

    try {
      // For VNPAY/MOMO/PAYOS - mark as REFUNDED
      // In production, this would call the actual refund API on the payment gateway
      if (['VNPAY', 'MOMO', 'PAYOS'].includes(payment.method)) {
        // TODO: Implement actual refund API calls for each gateway
        // For now, just mark payment as refunded and record the amount
        await this.repository.update(paymentId, {
          status: 'REFUNDED',
          refundAmount: payment.amount,
        });
        this.logger.log(`Refund initiated for ${payment.method} payment ${paymentId}`);
      } else if (payment.method === 'CASH' || payment.method === 'CARD') {
        // For cash/card, just mark as refunded since no online refund needed
        await this.repository.update(paymentId, {
          status: 'REFUNDED',
          refundAmount: payment.amount,
        });
        this.logger.log(`Refund marked for ${payment.method} payment ${paymentId}`);
      }

      await this.cacheService.clearPaymentCaches();
    } catch (error) {
      this.logger.error(`Error initiating refund for payment ${paymentId}:`, error);
      throw new BadRequestException('Failed to initiate refund. Please try again later.');
    }
  }

  async handleVNPayReturn(vnp_Params: any) {
    const result = this.vnpayService.verifyReturnUrl(vnp_Params);
    if (!result.isValid) {
      this.logger.error(`VNPay Checksum Mismatch! Request rejected. Params: ${JSON.stringify(vnp_Params)}`);
      throw new BadRequestException('Invalid VNPay checksum signature');
    }

    const orderCode = vnp_Params['vnp_TxnRef'];
    const responseCode = vnp_Params['vnp_ResponseCode'];
    
    const payment = await this.repository.findByOrderCode(orderCode);
    if (!payment) throw new NotFoundException('Payment not found');

    const status = responseCode === '00' ? 'SUCCESS' : 'FAILED';
    
    let updatedPayment = payment;
    if (payment.status === 'PENDING') {
      updatedPayment = await this.updateStatus(payment.id, { status });
    }
    
    return {
      success: status === 'SUCCESS',
      isValid: result.isValid,
      payment: PaymentHelper.serializePayment(updatedPayment),
      order: {
        ...updatedPayment.order,
        totalAmount: updatedPayment.amount, // Khớp với frontend mong đợi
      },
    };
  }

  async handleVNPayIPN(vnp_Params: any) {
    try {
      const result = this.vnpayService.verifyReturnUrl(vnp_Params);
      if (!result.isValid) {
        return { RspCode: '97', Message: 'Checksum failed' };
      }

      const orderCode = vnp_Params['vnp_TxnRef'];
      const vnp_Amount = parseInt(vnp_Params['vnp_Amount']);
      const responseCode = vnp_Params['vnp_ResponseCode'];

      const payment = await this.repository.findByOrderCode(orderCode);
      if (!payment) {
        return { RspCode: '01', Message: 'Order not found' };
      }

      // vnp_Amount is multiplied by 100
      if (Math.round(payment.amount * 100) !== vnp_Amount) {
        return { RspCode: '04', Message: 'Invalid amount' };
      }

      if (payment.status !== 'PENDING') {
        return { RspCode: '02', Message: 'Order already confirmed' };
      }

      const status = responseCode === '00' ? 'SUCCESS' : 'FAILED';
      await this.updateStatus(payment.id, { status });

      return { RspCode: '00', Message: 'Confirm Success' };
    } catch (error) {
      this.logger.error(`VNPay IPN Error: ${error.message}`);
      return { RspCode: '99', Message: 'Unknown error' };
    }
  }



  async findOne(id: number) {
    let payment = await this.cacheService.getPayment(id);
    if (payment) return PaymentHelper.serializePayment(payment);

    payment = await this.repository.findById(id);
    if (payment) await this.cacheService.setPayment(id, payment);

    return PaymentHelper.serializePayment(payment);
  }

  async findAll(query: QueryPaymentDto) {
    const { page = 1, limit = 50, status, method } = query;
    const skip = (page - 1) * limit;

    const where = {};
    if (status) where['status'] = status;
    if (method) where['method'] = method;

    const [payments, total] = await Promise.all([
      this.repository.findAll(where, skip, limit),
      this.repository.count(where),
    ]);

    return {
      payments: payments.map((p) => PaymentHelper.serializePayment(p)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
