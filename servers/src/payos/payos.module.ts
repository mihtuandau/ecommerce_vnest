// src/payos/payos.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PayOSController } from './payos.controller';
import { PayOSWebhookController } from './payos-webhook.controller';
import { PayOSService } from './payos.service';
import payosConfig from './config/payos.config';

@Module({
  imports: [
    ConfigModule.forFeature(payosConfig),
  ],
  controllers: [PayOSController, PayOSWebhookController],
  providers: [PayOSService],
  exports: [PayOSService],
})
export class PayOSModule {}