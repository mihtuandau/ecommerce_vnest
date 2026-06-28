import {
  IsString,
  IsNumber,
  IsPositive,
  IsOptional,
  IsInt,
  IsEnum,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiProperty({
    example: 'Áo thun nam cập nhật',
    description: 'Tên sản phẩm mới (tùy chọn)',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'Áo thun cotton thoải mái, size M-XL, chất liệu mới',
    description: 'Mô tả sản phẩm mới (tùy chọn)',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'ao-thun-nam-cap-nhat',
    description: 'Slug sản phẩm (tùy chọn)',
    required: false,
  })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({
    example: 180000,
    description: 'Giá gốc mới (VND, tùy chọn)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  basePrice?: number;

  @ApiProperty({
    example: 250000,
    description: 'Giá trước khuyến mãi (VND, tùy chọn)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  originalPrice?: number;

  @ApiProperty({
    example: 2,
    description: 'ID category mới (phải tồn tại, tùy chọn)',
    required: false,
  })
  @IsOptional()
  @IsInt()
  categoryId?: number;

  @ApiProperty({
    example: 1,
    description: 'ID brand mới (tùy chọn)',
    required: false,
  })
  @IsOptional()
  @IsInt()
  brandId?: number;

  @ApiProperty({
    example: 'active',
    description: 'Trạng thái sản phẩm (active, draft, inactive)',
    required: false,
    enum: ['active', 'draft', 'inactive'],
  })
  @IsOptional()
  @IsEnum(['active', 'draft', 'inactive'])
  status?: string;

  @ApiProperty({
    example: 'Áo thun nam - Minh Tuấn Shop',
    description: 'SEO meta title (tùy chọn)',
    required: false,
  })
  @IsOptional()
  @IsString()
  metaTitle?: string;

  @ApiProperty({
    example: 'Áo thun nam cotton, thoáng mát...',
    description: 'SEO meta description (tùy chọn)',
    required: false,
  })
  @IsOptional()
  @IsString()
  metaDesc?: string;

  @IsOptional()
  @IsArray()
  images?: any[];

  @IsOptional()
  @IsArray()
  variants?: any[];
}
