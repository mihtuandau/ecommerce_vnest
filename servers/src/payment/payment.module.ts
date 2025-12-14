// src/payment/payment.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentController } from './payment.controller';
import { PaymentWebhookController } from './payment-webhook.controller';
import { PaymentService } from './payment.service';
import { PaymentRepository } from './payment.repository';
import { PayOSService } from './payos.service';
import { CacheModule } from '@nestjs/cache-manager';
import { PrismaModule } from '../prisma/prisma.module';
import payosConfig from './config/payos.config';

@Module({
  imports: [
    ConfigModule.forFeature(payosConfig),
    CacheModule.register(),
    PrismaModule,
  ],
  controllers: [PaymentController, PaymentWebhookController],
  providers: [PaymentService, PaymentRepository, PayOSService],
  exports: [PaymentService],
})
export class PaymentModule {}