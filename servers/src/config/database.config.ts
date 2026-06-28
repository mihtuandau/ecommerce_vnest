import { ConfigService } from '@nestjs/config';

export const databaseConfig = (configService: ConfigService) => ({
  url: configService.get('DATABASE_URL'),
});
