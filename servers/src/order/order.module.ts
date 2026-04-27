import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderRepository } from './order.repository';
import { OrderCache } from './order.cache';
import { OrderCreation } from './order.creation';
import { OrderManagement } from './order.management';
import { PrismaModule } from '../prisma/prisma.module';
import { CacheModule } from '@nestjs/cache-manager';
import { CartModule } from '../cart/cart.module'; 
import { MailModule } from '../mail/mail.module';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [
    PrismaModule, 
    CacheModule.register(),
    CartModule, 
    MailModule, 
    PaymentModule
  ],  
  controllers: [OrderController],
  providers: [
    OrderService, 
    OrderRepository,
    OrderCache,
    OrderCreation,
    OrderManagement,
  ],
  exports: [OrderService, OrderRepository],  
})
export class OrderModule {}





