// src/payment/payment.module.ts
import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentWebhookController } from './payment-webhook.controller';
import { PaymentService } from './payment.service';
import { PaymentRepository } from './payment.repository';
import { CacheModule } from '@nestjs/cache-manager';
import { PrismaModule } from '../prisma/prisma.module';
import { PayOSModule } from '../payos/payos.module';
import { PaymentCache } from './payment.cache';
import { PaymentWebhook } from './payment.webhook';
import { PaymentSync } from './payment.sync';

@Module({
  imports: [
    CacheModule.register(),
    PrismaModule,
    PayOSModule,
  ],
  controllers: [PaymentController, PaymentWebhookController],
  providers: [
    PaymentService,
    PaymentRepository,
    PaymentCache,
    PaymentWebhook,
    PaymentSync,
  ],
  exports: [PaymentService],
})
export class PaymentModule {}