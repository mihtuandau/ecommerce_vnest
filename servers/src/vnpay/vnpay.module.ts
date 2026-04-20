import { Module } from '@nestjs/common';
import { VNPayService } from './vnpay.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [VNPayService],
  exports: [VNPayService],
})
export class VNPayModule {}
