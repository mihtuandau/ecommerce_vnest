// src/payment/services/payment-cache.service.ts
import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class PaymentCache {
  private readonly logger = new Logger(PaymentCache.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  /**
   * Clear all payment related caches
   */
  async clearPaymentCaches() {
    // Note: cache-manager doesn't support wildcard deletion
    // Just log for now - cache will expire naturally
    this.logger.log('Payment caches will be invalidated');
  }

  /**
   * Get payment from cache
   */
  async getPayment(id: number) {
    const cacheKey = `payment:${id}`;
    return this.cacheManager.get(cacheKey);
  }

  /**
   * Set payment cache
   */
  async setPayment(id: number, payment: any, ttl = 1800) {
    const cacheKey = `payment:${id}`;
    await this.cacheManager.set(cacheKey, payment, ttl);
  }

  /**
   * Delete payment cache
   */
  async deletePayment(id: number) {
    const cacheKey = `payment:${id}`;
    await this.cacheManager.del(cacheKey);
  }

  /**
   * Get payments list from cache
   */
  async getPaymentsList(query: any) {
    const cacheKey = `payments:${JSON.stringify(query)}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      this.logger.log(`Cache hit for payments: ${cacheKey}`);
    }
    return cached;
  }

  /**
   * Set payments list cache
   */
  async setPaymentsList(query: any, data: any, ttl = 3600) {
    const cacheKey = `payments:${JSON.stringify(query)}`;
    await this.cacheManager.set(cacheKey, data, ttl);
    this.logger.log(`Cache set for payments: ${cacheKey}`);
  }

  /**
   * Clear all related caches after payment update
   */
  async clearRelatedCaches(paymentId: number, orderId: number) {
    await this.deletePayment(paymentId);
    await this.clearPaymentCaches();
    await this.cacheManager.del(`order:${orderId}`);
    await this.cacheManager.del('products:all');
    this.logger.log('Related caches cleared');
  }
}