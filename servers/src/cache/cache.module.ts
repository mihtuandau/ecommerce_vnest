import { Module } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';  
import { redisStore } from 'cache-manager-redis-yet';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    NestCacheModule.registerAsync({ 
      isGlobal: true,
      useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
          socket: {
            host: configService.get<string>('REDIS_HOST', 'localhost'),
            port: parseInt(configService.get<string>('REDIS_PORT', '6379'), 10),
          },
          password: configService.get<string>('REDIS_PASSWORD'),
          ttl: parseInt(configService.get<string>('REDIS_CACHE_EXPIRATION', '3600'), 10) * 1000, // cache-manager v5+ uses milliseconds
        });
        
        return {
          store: store as unknown as string,
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [NestCacheModule],  
})
export class CacheModule {} 





