import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';  
import { ConfigService } from '@nestjs/config';
import { redisConfig } from '../config/redis.config';

@Injectable()
export class CacheService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,  
    private configService: ConfigService,
  ) {}

  async get<T>(key: string): Promise<T | undefined> {
    return this.cacheManager.get<T>(key);
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl || redisConfig(this.configService).ttl);
  }

  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }
}





