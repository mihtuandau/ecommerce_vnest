// src/payos/dto/create-payos-payment.dto.ts
import { IsNumber, IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class PayOSItemDto {
  @ApiProperty({ description: 'Tên sản phẩm' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Số lượng' })
  @IsNumber()
  quantity: number;

  @ApiProperty({ description: 'Giá' })
  @IsNumber()
  price: number;
}

export class CreatePayOSPaymentDto {
  @ApiProperty({ description: 'Mã đơn hàng', example: 123456 })
  @IsNumber()
  orderCode: number;

  @ApiProperty({ description: 'Số tiền', example: 50000 })
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Mô tả thanh toán', example: 'Thanh toán đơn hàng #123456' })
  @IsString()
  description: string;

  @ApiPropertyOptional({ description: 'Tên người mua' })
  @IsOptional()
  @IsString()
  buyerName?: string;

  @ApiPropertyOptional({ description: 'Email người mua' })
  @IsOptional()
  @IsString()
  buyerEmail?: string;

  @ApiPropertyOptional({ description: 'Số điện thoại người mua' })
  @IsOptional()
  @IsString()
  buyerPhone?: string;

  @ApiPropertyOptional({ description: 'Địa chỉ người mua' })
  @IsOptional()
  @IsString()
  buyerAddress?: string;

  @ApiPropertyOptional({ description: 'Danh sách sản phẩm', type: [PayOSItemDto] })
  @IsOptional()
  @IsArray()
  items?: PayOSItemDto[];

  @ApiPropertyOptional({ description: 'URL trở về khi thành công' })
  @IsOptional()
  @IsString()
  returnUrl?: string;

  @ApiPropertyOptional({ description: 'URL trở về khi hủy' })
  @IsOptional()
  @IsString()
  cancelUrl?: string;
}