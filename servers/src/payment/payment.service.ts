// src/payment/payment.service.ts
import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PaymentRepository } from './payment.repository';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import { QueryPaymentDto } from './dto/query-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    private repository: PaymentRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // Helper function to clear payment caches
  // Note: cache-manager doesn't support wildcard deletion
  private async clearPaymentCaches() {
    // Just log for now - cache will expire naturally
    console.log('Payment caches will be invalidated');
  }

  async create(data: CreatePaymentDto) {
    // Validate order exists
    const order = await this.repository.findOrderById(data.orderId);
    if (!order) {
      throw new BadRequestException('Order not found');
    }

    // Generate transactionId nếu method là VNPAY/MOMO
    let transactionId: string | null = null;
    if (data.method === 'VNPAY' || data.method === 'MOMO') {
      transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      // await this.processExternalPayment(data, transactionId);
    }

    const payment = await this.repository.create({
      order: { connect: { id: data.orderId } },
      method: data.method,
      status: data.status || 'PENDING',
      amount: order.total,
      transactionId,
    });

    // Invalidate all payment caches
    await this.clearPaymentCaches();
    await this.cacheManager.del(`payment:${payment.id}`);

    return payment;
  }

  async findOne(id: number) {
    const cacheKey = `payment:${id}`;
    let payment = await this.cacheManager.get(cacheKey);
    if (payment) {
      return payment;
    }

    payment = await this.repository.findById(id);

    if (payment) {
      await this.cacheManager.set(cacheKey, payment, 1800); // 30 phút
    }

    return payment;
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

    return updatedPayment;
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

    const result = {
      payments,
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

  // Stub method cho external payment (expand sau)
  private async processExternalPayment(
    data: CreatePaymentDto,
    transactionId: string,
  ) {
    // Ví dụ VNPAY: Gọi API VNPAY để tạo transaction
    // await this.vnpayService.createTransaction(data.orderId, transactionId, data.amount);
    console.log('Processing external payment for', transactionId);
  }
}
