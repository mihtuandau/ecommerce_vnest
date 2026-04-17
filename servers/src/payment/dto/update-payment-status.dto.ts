import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus } from '@prisma/client';

export class UpdatePaymentStatusDto {
  @ApiProperty({ example: 'SUCCESS', enum: PaymentStatus, description: 'New status' })
  @IsEnum(PaymentStatus)
  status: PaymentStatus;
}





