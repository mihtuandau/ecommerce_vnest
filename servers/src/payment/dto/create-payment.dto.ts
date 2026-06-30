import {
  IsInt,
  IsEnum,
  IsPositive,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '@prisma/client';

export class CreatePaymentDto {
  @ApiProperty({ example: 1, description: 'Order ID' })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  orderId!: number;

  @ApiProperty({
    example: 'CASH',
    enum: PaymentMethod,
    description: 'Payment method',
  })
  @IsEnum(PaymentMethod)
  method!: PaymentMethod;

  @ApiProperty({
    example: 'TXN_123456',
    description: 'Transaction ID (auto for external)',
    required: false,
  })
  @IsOptional()
  @IsString()
  transactionId?: string;
}
