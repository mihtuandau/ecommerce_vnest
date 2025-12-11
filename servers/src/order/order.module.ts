import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderRepository } from './order.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { CartModule } from '../cart/cart.module'; 
import { MailModule } from '../mail/mail.module';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [PrismaModule, CartModule, MailModule, PaymentModule],  
  controllers: [OrderController],
  providers: [OrderService, OrderRepository],
  exports: [OrderService],  
})
export class OrderModule {}