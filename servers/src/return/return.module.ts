import { Module } from '@nestjs/common';
import { ReturnService } from './return.service';
import { ReturnRepository } from './return.repository';
import { ReturnController } from './return.controller';
import { PaymentModule } from '../payment/payment.module';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [PaymentModule, OrderModule],
  controllers: [ReturnController],
  providers: [ReturnService, ReturnRepository],
  exports: [ReturnService],
})
export class ReturnModule {}
