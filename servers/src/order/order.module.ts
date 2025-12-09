import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CartModule } from '../cart/cart.module'; 
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [CartModule, MailModule],  
  controllers: [OrderController],
  providers: [OrderService, PrismaService],
  exports: [OrderService],  
})
export class OrderModule {}