// src/payment/payment.service.ts
import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PaymentRepository } from './payment.repository';
import { PayOSService } from './payos.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import { QueryPaymentDto } from './dto/query-payment.dto';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private repository: PaymentRepository,
    private payosService: PayOSService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // Helper function to clear payment caches
  private async clearPaymentCaches() {
    // Cache will expire naturally or be invalidated individually
    this.logger.verbose('Payment caches invalidated');
  }

  // Helper to serialize payment (convert BigInt to Number)
  private serializePayment(payment: any) {
    if (!payment) return null;
    return {
      ...payment,
      payosOrderCode: payment.payosOrderCode
        ? Number(payment.payosOrderCode)
        : null,
    };
  }

  async create(data: CreatePaymentDto) {
    const order = await this.repository.findOrderById(data.orderId);
    if (!order) {
      throw new BadRequestException('Order not found');
    }

    const existingPayment = await this.repository.findByOrderId(data.orderId);
    if (existingPayment) {
      this.logger.log(
        `Order ${data.orderId} already has payment ${existingPayment.id}`,
      );
      return this.serializePayment({
        ...existingPayment,
        paymentLink: existingPayment.paymentLink,
      });
    }

    let transactionId: string | null = null;
    let paymentLink: string | null = null;
    let payosOrderCode: number | null = null;

    if (data.method === 'PAYOS') {
      payosOrderCode = Date.now();

      const shippingInfo = order.shippingInfo as any;
      const buyerName =
        order.user?.name ||
        shippingInfo?.fullName ||
        order.address?.fullName ||
        'Customer';
      const buyerEmail = order.user?.email || order.guestEmail || '';
      const buyerPhone =
        shippingInfo?.phone || order.guestPhone || order.address?.phone || '';

      try {
        const payosResponse = await this.payosService.createPaymentLink({
          orderCode: payosOrderCode,
          amount: order.total,
          description: `#${data.orderId}`,
          buyerName,
          buyerEmail,
          buyerPhone,
          items: order.orderItems.map((item) => ({
            name: item.variant?.product?.name || 'Product',
            quantity: item.quantity,
            price: item.price,
          })),
        });

        paymentLink = payosResponse.checkoutUrl;
        transactionId = payosResponse.paymentLinkId;
      } catch (error) {
        throw new BadRequestException(
          `Failed to create PayOS payment link: ${error.message}`,
        );
      }
    } else if (data.method === 'VNPAY' || data.method === 'MOMO') {
      transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    const payment = await this.repository.create({
      order: { connect: { id: data.orderId } },
      method: data.method,
      status: 'PENDING',
      amount: order.total,
      transactionId,
      paymentLink,
      payosOrderCode,
    });

    await this.clearPaymentCaches();
    await this.cacheManager.del(`payment:${payment.id}`);

    return this.serializePayment({
      ...payment,
      paymentLink,
    });
  }

  async findOne(id: number) {
    const cacheKey = `payment:${id}`;
    let payment = await this.cacheManager.get(cacheKey);
    if (payment) {
      return this.serializePayment(payment);
    }

    payment = await this.repository.findById(id);

    if (payment) {
      await this.cacheManager.set(cacheKey, payment, 1800); // 30 phút
    }

    return this.serializePayment(payment);
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

    if (data.status === 'SUCCESS') {
      this.logger.log(`Stock deducted for order ${payment.orderId}`);
    }

    await this.cacheManager.del(`payment:${id}`);
    await this.clearPaymentCaches();
    await this.cacheManager.del(`order:${payment.orderId}`);
    await this.cacheManager.del('products:all');

    return this.serializePayment(updatedPayment);
  }

  async findAll(query: QueryPaymentDto) {
    const { page = 1, limit = 10, status, method } = query;
    const skip = (page - 1) * limit;

    const cacheKey = `payments:${JSON.stringify(query)}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      this.logger.verbose(`Cache hit for payments: ${cacheKey}`);
      return cached;
    }

    const where = {};
    if (status) where['status'] = status;
    if (method) where['method'] = method;

    const [payments, total] = await Promise.all([
      this.repository.findAll(where, skip, limit),
      this.repository.count(where),
    ]);

    const serializedPayments = payments.map((p) => this.serializePayment(p));

    const result = {
      payments: serializedPayments,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };

    await this.cacheManager.set(cacheKey, result, 3600);
    this.logger.verbose(`Cache set for payments: ${cacheKey}`);

    return result;
  }

  async getPayOSPaymentInfo(orderCode: number) {
    try {
      const paymentInfo = await this.payosService.getPaymentInfo(orderCode);

      return {
        ...paymentInfo,
        orderCode: paymentInfo.orderCode
          ? Number(paymentInfo.orderCode)
          : paymentInfo.orderCode,
        amount: paymentInfo.amount
          ? Number(paymentInfo.amount)
          : paymentInfo.amount,
        amountPaid: paymentInfo.amountPaid
          ? Number(paymentInfo.amountPaid)
          : paymentInfo.amountPaid,
        amountRemaining: paymentInfo.amountRemaining
          ? Number(paymentInfo.amountRemaining)
          : paymentInfo.amountRemaining,
      };
    } catch (error) {
      throw new NotFoundException(
        `Payment not found for order code: ${orderCode}`,
      );
    }
  }

  async cancelPayOSPayment(paymentId: number, reason?: string) {
    const payment = await this.repository.findById(paymentId);
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (!payment.payosOrderCode) {
      throw new BadRequestException(
        'This payment does not have a PayOS order code',
      );
    }

    try {
      await this.payosService.cancelPaymentLink(
        Number(payment.payosOrderCode),
        reason,
      );

      const updatedPayment = await this.repository.update(paymentId, {
        status: 'CANCELLED',
      });

      await this.cacheManager.del(`payment:${paymentId}`);
      await this.clearPaymentCaches();

      return this.serializePayment(updatedPayment);
    } catch (error) {
      throw new BadRequestException(
        `Failed to cancel PayOS payment: ${error.message}`,
      );
    }
  }

  async handlePayOSWebhook(webhookData: any) {
    try {
      this.logger.log('PayOS Webhook received');

      const verifiedData =
        await this.payosService.verifyPaymentWebhookData(webhookData);

      this.logger.log('Webhook verified successfully');

      const orderCode = verifiedData.orderCode;

      const payment = await this.repository.findByPayosOrderCode(orderCode);
      if (!payment) {
        this.logger.error(`Payment not found for orderCode: ${orderCode}`);
        throw new NotFoundException(
          `Payment not found for order code: ${orderCode}`,
        );
      }

      this.logger.log(
        `Found payment ${payment.id} for order ${payment.orderId} (current status: ${payment.status})`,
      );

      let newStatus: 'SUCCESS' | 'FAILED' | 'CANCELLED' = 'SUCCESS';

      if (verifiedData.code === '00') {
        newStatus = 'SUCCESS';
      } else if (verifiedData.code === '01') {
        newStatus = 'FAILED';
      } else if (verifiedData.code === '02') {
        newStatus = 'CANCELLED';
      }

      this.logger.log(`Webhook code ${verifiedData.code} → Updating status to ${newStatus}`);

      const updatedPayment = await this.repository.updateStatusWithTransaction(
        payment.id,
        newStatus,
        payment.orderId,
        payment.order.orderItems,
      );

      this.logger.log(`Payment ${updatedPayment.id} updated to ${updatedPayment.status}`);

      await this.cacheManager.del(`payment:${payment.id}`);
      await this.clearPaymentCaches();
      await this.cacheManager.del(`order:${payment.orderId}`);
      await this.cacheManager.del('products:all');

      this.logger.verbose('Caches cleared after webhook');

      return this.serializePayment(updatedPayment);
    } catch (error) {
      this.logger.error(
        `Error handling PayOS webhook: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to handle webhook: ${error.message}`,
      );
    }
  }

  async findByPayosOrderCode(orderCode: number) {
    const payment = await this.repository.findByPayosOrderCode(orderCode);

    if (payment && payment.status === 'PENDING') {
      try {
        this.logger.verbose(`Payment ${payment.id} is PENDING, syncing with PayOS...`);

        const payosInfo = await this.payosService.getPaymentInfo(orderCode);

        if (payosInfo.status === 'PAID') {
          this.logger.log(`PayOS confirmed payment PAID → Updating to SUCCESS`);

          const updatedPayment = await this.repository.updateStatusWithTransaction(
            payment.id,
            'SUCCESS',
            payment.orderId,
            payment.order.orderItems,
          );

          await this.cacheManager.del(`payment:${payment.id}`);
          await this.clearPaymentCaches();
          await this.cacheManager.del(`order:${payment.orderId}`);
          await this.cacheManager.del('products:all');

          this.logger.log('Payment status synced to SUCCESS');

          return this.serializePayment(updatedPayment);
        }
      } catch (error) {
        this.logger.warn(`Failed to sync payment ${payment.id} with PayOS: ${error.message}`);
      }
    }

    return this.serializePayment(payment);
  }

  async syncPaymentWithPayOS(paymentId: number) {
    const payment = await this.repository.findById(paymentId);

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (!payment.payosOrderCode) {
      throw new BadRequestException('This payment does not have a PayOS order code');
    }

    if (payment.status !== 'PENDING') {
      this.logger.log(`Payment ${paymentId} is already ${payment.status}, skipping sync`);
      return {
        message: `Payment is already ${payment.status}`,
        payment: this.serializePayment(payment),
      };
    }

    try {
      this.logger.log(`Manually syncing payment ${paymentId} with PayOS...`);

      const payosInfo = await this.payosService.getPaymentInfo(Number(payment.payosOrderCode));

      if (payosInfo.status === 'PAID') {
        this.logger.log('PayOS confirmed PAID → Updating to SUCCESS');

        const updatedPayment = await this.repository.updateStatusWithTransaction(
          payment.id,
          'SUCCESS',
          payment.orderId,
          payment.order.orderItems,
        );

        await this.cacheManager.del(`payment:${payment.id}`);
        await this.clearPaymentCaches();
        await this.cacheManager.del(`order:${payment.orderId}`);
        await this.cacheManager.del('products:all');

        return {
          message: 'Payment synced successfully - Status updated to SUCCESS',
          payment: this.serializePayment(updatedPayment),
        };
      } else if (payosInfo.status === 'CANCELLED') {
        const updatedPayment = await this.repository.update(payment.id, {
          status: 'CANCELLED',
        });

        await this.cacheManager.del(`payment:${payment.id}`);
        await this.clearPaymentCaches();

        return {
          message: 'Payment synced - Status updated to CANCELLED',
          payment: this.serializePayment(updatedPayment),
        };
      } else {
        return {
          message: `Payment is still PENDING on PayOS (status: ${payosInfo.status})`,
          payment: this.serializePayment(payment),
        };
      }
    } catch (error) {
      this.logger.error(`Failed to sync payment ${paymentId} with PayOS: ${error.message}`);
      throw new BadRequestException(`Failed to sync with PayOS: ${error.message}`);
    }
  }

  private async processExternalPayment(
    data: CreatePaymentDto,
    transactionId: string,
  ) {
    this.logger.verbose(`Processing external payment for ${transactionId}`);
  }
}