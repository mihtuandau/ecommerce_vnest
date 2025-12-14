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
  // Note: cache-manager doesn't support wildcard deletion
  private async clearPaymentCaches() {
    // Just log for now - cache will expire naturally
    console.log('Payment caches will be invalidated');
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
    // Validate order exists
    const order = await this.repository.findOrderById(data.orderId);
    if (!order) {
      throw new BadRequestException('Order not found');
    }

    // Kiểm tra xem order đã có payment chưa
    const existingPayment = await this.repository.findByOrderId(data.orderId);
    if (existingPayment) {
      this.logger.log(
        `Order ${data.orderId} already has payment ${existingPayment.id}`,
      );
      // Nếu đã có payment, trả về payment đó thay vì tạo mới
      return this.serializePayment({
        ...existingPayment,
        paymentLink: existingPayment.paymentLink,
      });
    }

    // Generate transactionId và payment link cho các phương thức online
    let transactionId: string | null = null;
    let paymentLink: string | null = null;
    let payosOrderCode: number | null = null;

    if (data.method === 'PAYOS') {
      // Tạo unique order code cho PayOS (sử dụng timestamp)
      payosOrderCode = Date.now();

      // Lấy thông tin customer từ order
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
        // Tạo payment link từ PayOS
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

    // Invalidate all payment caches
    await this.clearPaymentCaches();
    await this.cacheManager.del(`payment:${payment.id}`);

    // Convert BigInt to Number for JSON serialization
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
      console.log(`Stock deducted for order ${payment.orderId}`);
    }

    // Cache invalidate
    await this.cacheManager.del(`payment:${id}`);
    await this.clearPaymentCaches();
    await this.cacheManager.del(`order:${payment.orderId}`);
    await this.cacheManager.del('products:all');

    return this.serializePayment(updatedPayment);
  }
  async findAll(query: QueryPaymentDto) {
    const { page = 1, limit = 10, status, method } = query;
    const skip = (page - 1) * limit;

    // Check cache first
    const cacheKey = `payments:${JSON.stringify(query)}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      console.log(`Cache hit for payments: ${cacheKey}`);
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
    const serializedPayments = payments.map((p) => this.serializePayment(p));

    const result = {
      payments: serializedPayments,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };

    // Set cache after query
    await this.cacheManager.set(cacheKey, result, 3600);
    console.log(`Cache set for payments: ${cacheKey}`);

    return result;
  }

  /**
   * Lấy thông tin payment từ PayOS
   */
  async getPayOSPaymentInfo(orderCode: number) {
    try {
      const paymentInfo = await this.payosService.getPaymentInfo(orderCode);

      // Serialize BigInt fields before returning
      return {
        ...paymentInfo,
        // Convert any BigInt fields to Number
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

  /**
   * Hủy payment link PayOS
   */
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

      // Update payment status
      const updatedPayment = await this.repository.update(paymentId, {
        status: 'CANCELLED',
      });

      // Clear cache
      await this.cacheManager.del(`payment:${paymentId}`);
      await this.clearPaymentCaches();

      return this.serializePayment(updatedPayment);
    } catch (error) {
      throw new BadRequestException(
        `Failed to cancel PayOS payment: ${error.message}`,
      );
    }
  }

  /**
   * Xử lý webhook từ PayOS
   */
  async handlePayOSWebhook(webhookData: any) {
    try {
      console.log('🔔 PayOS Webhook received:', JSON.stringify(webhookData, null, 2));
      
      // Verify webhook signature và lấy data đã verify
      const verifiedData =
        await this.payosService.verifyPaymentWebhookData(webhookData);

      console.log('✅ Webhook verified:', JSON.stringify(verifiedData, null, 2));

      const orderCode = verifiedData.orderCode;
      console.log('🔍 Looking for payment with PayOS orderCode:', orderCode);

      // Tìm payment theo payosOrderCode
      const payment = await this.repository.findByPayosOrderCode(orderCode);
      if (!payment) {
        console.error('❌ Payment not found for orderCode:', orderCode);
        throw new NotFoundException(
          `Payment not found for order code: ${orderCode}`,
        );
      }

      console.log('💳 Found payment:', { paymentId: payment.id, orderId: payment.orderId, currentStatus: payment.status });

      // Xác định trạng thái mới dựa trên response từ PayOS
      let newStatus: 'SUCCESS' | 'FAILED' | 'CANCELLED' = 'SUCCESS';

      if (verifiedData.code === '00') {
        newStatus = 'SUCCESS';
      } else if (verifiedData.code === '01') {
        newStatus = 'FAILED';
      } else if (verifiedData.code === '02') {
        newStatus = 'CANCELLED';
      }

      console.log('📊 Webhook code:', verifiedData.code, '-> New status:', newStatus);

      // Update payment status với transaction
      console.log('⏳ Updating payment status...');
      const updatedPayment = await this.repository.updateStatusWithTransaction(
        payment.id,
        newStatus,
        payment.orderId,
        payment.order.orderItems,
      );

      console.log('✅ Payment updated successfully:', { id: updatedPayment.id, status: updatedPayment.status, orderId: updatedPayment.orderId });

      // Clear cache
      await this.cacheManager.del(`payment:${payment.id}`);
      await this.clearPaymentCaches();
      await this.cacheManager.del(`order:${payment.orderId}`);
      await this.cacheManager.del('products:all');

      console.log('🗑️ Caches cleared');

      return this.serializePayment(updatedPayment);
    } catch (error) {
      console.error('❌ Error handling PayOS webhook:', error);
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
    return this.serializePayment(payment);
  }

  private async processExternalPayment(
    data: CreatePaymentDto,
    transactionId: string,
  ) {
    console.log('Processing external payment for', transactionId);
  }
}
