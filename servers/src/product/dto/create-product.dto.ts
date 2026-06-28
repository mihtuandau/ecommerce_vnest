import {
  IsString,
  IsNumber,
  IsPositive,
  IsOptional,
  IsInt,
  IsArray,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    example: 'Áo thun nam',
    description: 'Tên sản phẩm',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Áo thun cotton thoải mái, size M-XL',
    description: 'Mô tả sản phẩm (tùy chọn)',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 200000,
    description: 'Giá gốc (VND)',
    required: true,
  })
  @IsNumber()
  @IsPositive()
  basePrice: number;

  @ApiProperty({
    example: 250000,
    description: 'Giá niêm yết (VND)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  originalPrice?: number;

  @ApiProperty({
    example: 1,
    description: 'ID category (phải tồn tại)',
    required: true,
  })
  @IsInt()
  categoryId: number;

  @ApiProperty({
    example: 1,
    description: 'ID brand (tùy chọn)',
    required: false,
  })
  @IsOptional()
  @IsInt()
  brandId?: number;

  @ApiProperty({
    example: 'ao-thun-nam',
    description: 'Slug sản phẩm (tùy chọn)',
    required: false,
  })
  @IsOptional()
  @IsString()
  slug?: string;

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
