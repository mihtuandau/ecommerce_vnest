// src/payment/payment.service.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PaymentRepository } from './payment.repository';
import { PayOSService } from '../payos/payos.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import { QueryPaymentDto } from './dto/query-payment.dto';
import { PaymentCache } from './payment.cache';
import { PaymentWebhook } from './payment.webhook';
import { PaymentSync } from './payment.sync';
import * as PaymentHelper from './payment.helper';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private repository: PaymentRepository,
    private payosService: PayOSService,
    private cacheService: PaymentCache,
    private webhookService: PaymentWebhook,
    private syncService: PaymentSync,
  ) {}

  async create(data: CreatePaymentDto) {
    // Validate order exists
    const order = await this.repository.findOrderById(data.orderId);
    if (!order) {
      throw new BadRequestException('Order not found');
    }

    // Check if order already has payment
    const existingPayment = await this.repository.findByOrderId(data.orderId);
    if (existingPayment) {
      this.logger.log(`Order ${data.orderId} already has payment ${existingPayment.id}`);
      return PaymentHelper.serializePayment({
        ...existingPayment,
        paymentLink: existingPayment.paymentLink,
      });
    }

    // Generate transaction data for different payment methods
    let transactionId: string | null = null;
    let paymentLink: string | null = null;
    let payosOrderCode: number | null = null;

    if (data.method === 'PAYOS') {
      payosOrderCode = PaymentHelper.generatePayOSOrderCode();
      const payosData = await PaymentHelper.createPayOSPaymentLink(this.payosService, order, payosOrderCode);
      paymentLink = payosData.paymentLink;
      transactionId = payosData.transactionId;
    } else if (data.method === 'VNPAY' || data.method === 'MOMO') {
      transactionId = PaymentHelper.generateTransactionId(data.method);
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

    // Clear caches
    await this.cacheService.clearPaymentCaches();
    await this.cacheService.deletePayment(payment.id);

    return PaymentHelper.serializePayment({
      ...payment,
      paymentLink,
    });
  }

  async findOne(id: number) {
    let payment = await this.cacheService.getPayment(id);
    if (payment) {
      return PaymentHelper.serializePayment(payment);
    }

    payment = await this.repository.findById(id);

    if (payment) {
      await this.cacheService.setPayment(id, payment);
    }

    return PaymentHelper.serializePayment(payment);
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

    // Clear caches
    await this.cacheService.clearRelatedCaches(id, payment.orderId);

    return PaymentHelper.serializePayment(updatedPayment);
  }

  async findAll(query: QueryPaymentDto) {
    const { page = 1, limit = 10, status, method } = query;
    const skip = (page - 1) * limit;

    // Check cache first
    const cached = await this.cacheService.getPaymentsList(query);
    if (cached) {
      return cached;
    }

    const where = {};
    if (status) where['status'] = status;
    if (method) where['method'] = method;

    const [payments, total] = await Promise.all([
      this.repository.findAll(where, skip, limit),
      this.repository.count(where),
    ]);

    // Serialize all payments
    const serializedPayments = payments.map((p) => PaymentHelper.serializePayment(p));

    const result = {
      payments: serializedPayments,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };

    // Set cache
    await this.cacheService.setPaymentsList(query, result);

    return result;
  }

  /**
   * Get PayOS payment info
   */
  async getPayOSPaymentInfo(orderCode: number) {
    try {
      const paymentInfo = await this.payosService.getPaymentInfo(orderCode);
      return PaymentHelper.serializePayOSPaymentInfo(paymentInfo);
    } catch (error) {
      throw new NotFoundException(`Payment not found for order code: ${orderCode}`);
    }
  }

  /**
   * Cancel PayOS payment
   */
  async cancelPayOSPayment(paymentId: number, reason?: string) {
    const payment = await this.repository.findById(paymentId);
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (!payment.payosOrderCode) {
      throw new BadRequestException('This payment does not have a PayOS order code');
    }

    try {
      await this.payosService.cancelPaymentLink(Number(payment.payosOrderCode), reason);

      // Update payment status
      const updatedPayment = await this.repository.update(paymentId, {
        status: 'CANCELLED',
      });

      // Clear cache
      await this.cacheService.clearRelatedCaches(paymentId, payment.orderId);

      return PaymentHelper.serializePayment(updatedPayment);
    } catch (error) {
      throw new BadRequestException(`Failed to cancel PayOS payment: ${error.message}`);
    }
  }

  // Delegate webhook handling to WebhookService
  async handlePayOSWebhook(webhookData: any) {
    return this.webhookService.handlePayOSWebhook(webhookData);
  }

  // Delegate sync operations to SyncService
  async findByPayosOrderCode(orderCode: number) {
    return this.syncService.findByPayosOrderCodeWithSync(orderCode);
  }

  async syncPaymentWithPayOS(paymentId: number) {
    return this.syncService.syncPaymentWithPayOS(paymentId);
  }

  private async processExternalPayment(data: CreatePaymentDto, transactionId: string) {
    this.logger.log('Processing external payment for', transactionId);
  }
}