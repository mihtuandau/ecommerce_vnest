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
import * as OrderHelper from '../order/order.helper';
import { Payment, Order, PaymentStatus } from '@prisma/client';

type PaymentWithOrder = Payment & { order: Order };

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private repository: PaymentRepository,
    private vnpayService: VNPayService,

    private cacheService: PaymentCache,
  ) {}

  async create(
    data: CreatePaymentDto & { status?: PaymentStatus },
    ipAddr: string = '127.0.0.1',
    requester?: { userId: number; role: string },
  ) {
    // Tự động chuyển đổi từ PAYOS sang VNPAY để tránh lỗi đồng bộ
    if (data.method === ('PAYOS' as any)) {
      data.method = 'VNPAY' as any;
    }

    const order = await this.repository.findOrderById(data.orderId);
    if (!order) {
      throw new BadRequestException('Order not found');
    }

    if (requester) {
      const isAdmin = requester.role === 'ADMIN';
      const isOwner = order.userId === requester.userId;
      if (!isAdmin && !isOwner) {
        throw new BadRequestException(
          'You do not have permission to create payment for this order',
        );
      }
    }

    const existingPayment = await this.repository.findByOrderId(data.orderId);

    if (existingPayment && existingPayment.status === 'SUCCESS') {
      return PaymentHelper.serializePayment(existingPayment);
    }

    let transactionId: string | null = null;
    let paymentLink: string | null = null;

    this.logger.debug(
      `[PaymentService] Creating payment for order ${order.orderCode}, Method: ${data.method}`,
    );

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

      this.logger.debug(
        `[PaymentService] VNPay Link Generated: ${paymentLink ? 'YES' : 'NO'}`,
      );

      if (!paymentLink) {
        throw new BadRequestException(
          'Không thể khởi tạo liên kết thanh toán VNPay. Vui lòng kiểm tra cấu hình hệ thống.',
        );
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

    await this.cacheService.clearRelatedCaches(id, payment.orderId);
    return PaymentHelper.serializePayment(updatedPayment);
  }

  /**
   * Initiate refund for a successful payment
   * This should be called when order is cancelled to request refund from payment gateway
   */
  async initiateRefund(paymentId: number, amount?: number) {
    const payment = await this.repository.findById(paymentId);
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status !== 'SUCCESS' && payment.status !== 'REFUNDED') {
      throw new BadRequestException(
        'Can only refund successful or partially refunded payments',
      );
    }

    const refundValue = amount || payment.amount;

    try {
      if (['VNPAY', 'MOMO', 'PAYOS'].includes(payment.method)) {
        await this.repository.update(paymentId, {
          status: 'REFUNDED',
          refundAmount: (payment.refundAmount || 0) + refundValue,
        });
        this.logger.warn(
          `⚠️ [MANUAL REFUND REQUIRED] Payment #${paymentId} (${payment.method}) marked as REFUNDED in DB. ` +
            `Amount: ${refundValue.toLocaleString('vi-VN')}đ. ` +
            `Admin PHẢI hoàn tiền thủ công qua cổng ${payment.method} cho khách hàng.`,
        );
      } else if (payment.method === 'CASH' || payment.method === 'CARD') {
        await this.repository.update(paymentId, {
          status: 'REFUNDED',
          refundAmount: (payment.refundAmount || 0) + refundValue,
        });
        this.logger.log(
          `Refund of ${refundValue} marked for ${payment.method} payment ${paymentId}`,
        );
      }

      await this.cacheService.clearPaymentCaches();
    } catch (error) {
      this.logger.error(
        `Error initiating refund for payment ${paymentId}:`,
        error,
      );
      throw new BadRequestException(
        'Failed to initiate refund. Please try again later.',
      );
    }
  }

  async handleVNPayReturn(vnp_Params: any) {
    const result = this.vnpayService.verifyReturnUrl(vnp_Params);
    if (!result.isValid) {
      this.logger.error(
        `VNPay Checksum Mismatch! Request rejected. Params: ${JSON.stringify(vnp_Params)}`,
      );
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

      // Guard: order bị admin cancel trong khi IPN đang xử lý (race condition)
      if (payment.order?.status === 'CANCELLED') {
        return { RspCode: '02', Message: 'Order already cancelled' };
      }

      const status = responseCode === '00' ? 'SUCCESS' : 'FAILED';
      await this.updateStatus(payment.id, { status });

      return { RspCode: '00', Message: 'Confirm Success' };
    } catch (error) {
      this.logger.error(`VNPay IPN Error: ${error.message}`);
      return { RspCode: '99', Message: 'Unknown error' };
    }
  }

  async findOne(id: number, requester?: { userId: number; role: string }) {
    // ❌ [SECURITY UPDATE] Bypass hoàn toàn Cache cho Payment Detail vì tính chất Real-time (Tránh lỗi Stale State gây tranh cãi tài chính)
    const payment = await this.repository.findById(id);

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Security Check: Only Admin or Owner can view
    const isAdmin = requester?.role === 'ADMIN';
    const pWithOrder = payment as unknown as PaymentWithOrder;
    const isOwner = requester?.userId === pWithOrder.order?.userId;

    if (requester && !isAdmin && !isOwner) {
      this.logger.warn(
        `User ${requester.userId} attempted to view payment ${id} belonging to user ${pWithOrder.order?.userId}`,
      );
      throw new BadRequestException(
        'You do not have permission to view this payment',
      );
    }

    return PaymentHelper.serializePayment(payment);
  }

  async cancelPayment(id: number, requester: { userId: number; role: string }) {
    const payment = await this.repository.findById(id);
    if (!payment) throw new NotFoundException('Payment not found');

    const isAdmin = requester.role === 'ADMIN';
    const pWithOrder = payment as unknown as PaymentWithOrder;
    const isOwner = requester.userId === pWithOrder.order?.userId;

    if (!isAdmin && !isOwner) {
      throw new BadRequestException(
        'You do not have permission to cancel this payment',
      );
    }

    if (payment.status !== 'PENDING') {
      throw new BadRequestException('Only pending payments can be cancelled');
    }

    const updated = await this.updateStatus(id, { status: 'CANCELLED' });
    return updated;
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
