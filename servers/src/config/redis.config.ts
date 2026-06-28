import { ConfigService } from '@nestjs/config';

export const redisConfig = (configService: ConfigService) => ({
  host: configService.get<string>('REDIS_HOST', 'localhost'),
  port: parseInt(configService.get<string>('REDIS_PORT', '6379'), 10),
  password: configService.get<string>('REDIS_PASSWORD'),
  ttl:
    parseInt(configService.get<string>('REDIS_CACHE_EXPIRATION', '3600'), 10) *
    1000,
});
