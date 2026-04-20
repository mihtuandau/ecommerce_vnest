import { Module } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';  
import * as redisStore from 'cache-manager-redis-store';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    NestCacheModule.registerAsync({ 
      isGlobal: true,
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT', 13806),
        password: configService.get('REDIS_PASSWORD'),
        ttl: configService.get('REDIS_CACHE_EXPIRATION', 3600),
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [NestCacheModule],  
})
export class CacheModule {} 





