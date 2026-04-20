import { IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';

export class UpdateOrderDto {
  @ApiProperty({ 
    example: 'SHIPPED', 
    description: 'Trạng thái mới (PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED)', 
    required: false,
    enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}





