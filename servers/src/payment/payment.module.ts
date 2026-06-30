import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentWebhookController } from './payment-webhook.controller';
import { PaymentService } from './payment.service';
import { PaymentRepository } from './payment.repository';
import { CacheModule } from '@nestjs/cache-manager';
import { PrismaModule } from '../prisma/prisma.module';
import { VNPayModule } from '../vnpay/vnpay.module';

import { PaymentCache } from './payment.cache';

@Module({
  imports: [CacheModule.register(), PrismaModule, VNPayModule],
  controllers: [PaymentController, PaymentWebhookController],
  providers: [PaymentService, PaymentRepository, PaymentCache],
  exports: [PaymentService],
})
export class PaymentModule {}
