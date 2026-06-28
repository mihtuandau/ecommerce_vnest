import {
  IsInt,
  IsPositive,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';

class OrderItemDto {
  @ApiProperty({ example: 1, description: 'ID variant', required: true })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  variantId: number;

  @ApiProperty({ example: 2, description: 'Số lượng', required: true })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  quantity: number;

  @ApiProperty({
    example: 100000,
    description: 'Giá tại thời điểm chọn',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  price?: number;
}

export class CreateOrderDto {
  @ApiProperty({
    example: 1,
    description: 'ID địa chỉ giao hàng (tùy chọn)',
    required: false,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @IsPositive()
  addressId?: number;

  @ApiProperty({
    example: '123 Nguyen Hue, Ward 1, District 1, Ho Chi Minh City',
    description: 'Địa chỉ giao hàng dạng chuỗi (tùy chọn)',
    required: false,
  })
  @IsOptional()
  @IsString()
  shippingAddress?: string;

  @ApiProperty({
    example: {
      fullName: 'Nguyen Van A',
      phone: '0901234567',
      note: 'Gọi trước khi giao',
    },
    description: 'Thông tin người nhận (tùy chọn)',
    required: false,
  })
  @IsOptional()
  shippingInfo?: any;

  @ApiProperty({
    example: 'CASH',
    description: 'Phương thức thanh toán',
    required: false,
  })
  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @ApiProperty({
    example: 1,
    description: 'ID phương thức vận chuyển (tùy chọn)',
    required: false,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @IsPositive()
  shippingMethodId?: number;

  @ApiProperty({
    example: 30000,
    description: 'Phí vận chuyển',
    required: false,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  shippingFee?: number;

  @ApiProperty({
    example: 'guest@example.com',
    description: 'Email khách (cho guest checkout)',
    required: false,
  })
  @IsOptional()
  @IsString()
  guestEmail?: string;

  @ApiProperty({
    example: '0901234567',
    description: 'Số điện thoại khách (cho guest checkout)',
    required: false,
  })
  @IsOptional()
  @IsString()
  guestPhone?: string;

  @ApiProperty({
    example: 'SAVE10',
    description: 'Mã giảm giá (tùy chọn)',
    required: false,
  })
  @IsOptional()
  @IsString()
  discountCode?: string;

  @ApiProperty({
    type: [OrderItemDto],
    description: 'Danh sách items (OPTIONAL - nếu không có sẽ lấy từ cart)',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items?: OrderItemDto[];

  @ApiProperty({
    example: 1,
    description: 'ID người dùng (chỉ dành cho Admin)',
    required: false,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @IsPositive()
  userId?: number;
}

export class AdminCreateOrderDto extends CreateOrderDto {
  @ApiProperty({
    example: 'PENDING',
    description: 'Trạng thái đơn hàng (chỉ dành cho Admin)',
    required: false,
    enum: OrderStatus,
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
