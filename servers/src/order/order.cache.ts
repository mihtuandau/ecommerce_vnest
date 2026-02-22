// src/order/order.cache.ts
import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { buildCacheKey } from '../common/utils/cache-key.util';

@Injectable()
export class OrderCache {
  private readonly logger = new Logger(OrderCache.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  /**
   * Get order from cache
   */
  async getOrder(id: number) {
    const cacheKey = `order:${id}`;
    return this.cacheManager.get(cacheKey);
  }

  /**
   * Set order cache
   */
  async setOrder(id: number, order: any, ttl = 1800) {
    const cacheKey = `order:${id}`;
    await this.cacheManager.set(cacheKey, order, ttl);
  }

  /**
   * Delete order cache
   */
  async deleteOrder(id: number) {
    const cacheKey = `order:${id}`;
    await this.cacheManager.del(cacheKey);
  }

  /**
   * Get orders list from cache
   */
  async getOrdersList(query: any) {
    const cacheKey = buildCacheKey('orders', query);
    return this.cacheManager.get(cacheKey);
  }

  /**
   * Set orders list cache
   */
  async setOrdersList(query: any, data: any, ttl = 3600) {
    const cacheKey = buildCacheKey('orders', query);
    await this.cacheManager.set(cacheKey, data, ttl);
  }

  /**
   * Delete user's order caches
   */
  async deleteUserOrderCaches(userId: number) {
    await this.cacheManager.del(`orders:${userId}:all`);
    this.logger.log(`Deleted user ${userId} order caches`);
  }

  /**
   * Clear all related caches after order update
   */
  async clearRelatedCaches(orderId: number, userId?: number) {
    await this.deleteOrder(orderId);
    if (userId) {
      await this.deleteUserOrderCaches(userId);
    }
    this.logger.log('Related order caches cleared');
  }
}