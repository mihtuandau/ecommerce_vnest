import { ConfigService } from '@nestjs/config';

export const redisConfig = (configService: ConfigService) => ({
  host: configService.get('REDIS_HOST'),
  port: 13806,  
  password: configService.get('REDIS_PASSWORD'),
  ttl: configService.get('REDIS_CACHE_EXPIRATION', 3600),
});