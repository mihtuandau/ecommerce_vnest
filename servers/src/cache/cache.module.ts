import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';

function buildRedisUrl(configService: ConfigService) {
  const host = configService.get<string>('REDIS_HOST', 'localhost');
  const port = configService.get<string>('REDIS_PORT', '6379');
  const username = configService.get<string>('REDIS_USERNAME');
  const password = configService.get<string>('REDIS_PASSWORD');

  if (!password) return `redis://${host}:${port}`;

  const auth = username
    ? `${encodeURIComponent(username)}:${encodeURIComponent(password)}`
    : `:${encodeURIComponent(password)}`;

  return `redis://${auth}@${host}:${port}`;
}

@Module({
  imports: [
    NestCacheModule.registerAsync({
      isGlobal: true,
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger('CacheModule');
        const ttl =
          parseInt(configService.get<string>('REDIS_CACHE_EXPIRATION', '3600'), 10) *
          1000;
        const useRedis = configService.get<string>('USE_REDIS_CACHE', 'false') === 'true';

        if (!useRedis) {
          logger.warn('Redis cache is disabled. Using in-memory cache.');
          return { ttl };
        }

        try {
          const store = await redisStore({
            url: buildRedisUrl(configService),
            ttl,
            socket: {
              connectTimeout: 3000,
              reconnectStrategy: false,
            },
          });

          logger.log('Redis cache connected.');
          return {
            store: store as unknown as string,
          };
        } catch (error) {
          logger.warn(
            `Redis cache unavailable. Falling back to in-memory cache: ${
              error instanceof Error ? error.message : String(error)
            }`,
          );
          return { ttl };
        }
      },
      inject: [ConfigService],
    }),
  ],
  exports: [NestCacheModule],
})
export class CacheModule {}
