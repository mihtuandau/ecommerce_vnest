import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CartRepository } from './cart.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { DiscountModule } from '../discount/discount.module';

@Module({
  imports: [PrismaModule, DiscountModule],
  controllers: [CartController],
  providers: [CartService, CartRepository],
  exports: [CartService],
})
export class CartModule {}
