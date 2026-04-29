
import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { buildCacheKey } from '../common/utils/cache-key.util';

@Injectable()
export class OrderCache {
  private readonly logger = new Logger(OrderCache.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  
  async getOrder(id: number) {
    const cacheKey = `order:${id}`;
    return this.cacheManager.get(cacheKey);
  }

  
  async setOrder(id: number, order: any, ttl = 10) {
    const cacheKey = `order:${id}`;
    // ⚠️ Order Detail is volatile, keep TTL very short (10s) just to prevent instant frontend re-render DDoS
    await this.cacheManager.set(cacheKey, order, ttl * 1000);
  }

  
  async deleteOrder(id: number) {
    const cacheKey = `order:${id}`;
    await this.cacheManager.del(cacheKey);
  }

  
  async getOrdersList(query: any) {
    const cacheKey = buildCacheKey('orders', query);
    return this.cacheManager.get(cacheKey);
  }

  
  async setOrdersList(query: any, data: any, ttl = 60) {
    const cacheKey = buildCacheKey('orders', query);
    // ⚠️ Order List can change often, keep TTL short (1 minute)
    await this.cacheManager.set(cacheKey, data, ttl * 1000);
  }

  
  async deleteUserOrderCaches(userId: number) {
    await this.cacheManager.del(`orders:${userId}:all`);

  }

  
  async clearRelatedCaches(orderId: number, userId?: number) {
    await this.deleteOrder(orderId);
    if (userId) {
      await this.deleteUserOrderCaches(userId);
    }

  }
}





