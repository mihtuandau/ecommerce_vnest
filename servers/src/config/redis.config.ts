import { ConfigService } from '@nestjs/config';

export const redisConfig = (configService: ConfigService) => ({
  host: configService.get<string>('REDIS_HOST'),
  port: configService.get<number>('REDIS_PORT', 13806),
  password: configService.get<string>('REDIS_PASSWORD'),
  ttl: configService.get<number>('REDIS_CACHE_EXPIRATION', 3600),
});
