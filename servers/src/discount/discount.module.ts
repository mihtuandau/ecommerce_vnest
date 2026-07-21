import { Module } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { DiscountController } from './discount.controller';
import { DiscountRepository } from './discount.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DiscountController],
  providers: [DiscountService, DiscountRepository],
  exports: [DiscountService, DiscountRepository],
})
export class DiscountModule {}
