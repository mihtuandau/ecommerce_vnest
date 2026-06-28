import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  IsInt,
} from 'class-validator';

export class CreateReturnRequestDto {
  @ApiProperty({ description: 'ID của đơn hàng muốn trả' })
  @IsInt()
  @IsNotEmpty()
  orderId: number;

  @ApiProperty({ description: 'Lý do trả hàng' })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiPropertyOptional({ description: 'Chi tiết thêm về lý do' })
  @IsString()
  @IsOptional()
  details?: string;

  @ApiPropertyOptional({
    description: 'Mảng các URL hình ảnh bằng chứng',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiProperty({
    description: 'Danh sách sản phẩm muốn trả',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        orderItemId: { type: 'number' },
        quantity: { type: 'number' },
      },
    },
  })
  @IsArray()
  @IsNotEmpty()
  items: { orderItemId: number; quantity: number }[];
}
