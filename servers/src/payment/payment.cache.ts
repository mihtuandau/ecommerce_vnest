
import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { buildCacheKey } from '../common/utils/cache-key.util';

@Injectable()
export class PaymentCache {
  private readonly logger = new Logger(PaymentCache.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async clearPaymentCaches() {

  }

  async getPayment(id: number) {
    const cacheKey = `payment:${id}`;
    return this.cacheManager.get(cacheKey);
  }

  async setPayment(id: number, payment: any, ttl = 1800) {
    const cacheKey = `payment:${id}`;
    await this.cacheManager.set(cacheKey, payment, ttl * 1000);
  }

  async deletePayment(id: number) {
    const cacheKey = `payment:${id}`;
    await this.cacheManager.del(cacheKey);
  }

  async getPaymentsList(query: any) {
    const cacheKey = buildCacheKey('payments', query);
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {

    }
    return cached;
  }

  async setPaymentsList(query: any, data: any, ttl = 3600) {
    const cacheKey = buildCacheKey('payments', query);
    await this.cacheManager.set(cacheKey, data, ttl * 1000);

  }

  async clearRelatedCaches(paymentId: number, orderId: number) {
    await this.deletePayment(paymentId);
    await this.clearPaymentCaches();
    await this.cacheManager.del(`order:${orderId}`);
    await this.cacheManager.del('products:all');

  }
}





