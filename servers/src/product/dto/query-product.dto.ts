import { IsOptional, IsInt, IsPositive, IsString, IsBoolean } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class QueryProductDto {
  @ApiProperty({ 
    example: 1, 
    description: 'Trang hiện tại (tùy chọn, mặc định 1)', 
    required: false 
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  page?: number = 1;

  @ApiProperty({ 
    example: 10, 
    description: 'Số sản phẩm mỗi trang (tùy chọn, mặc định 10)', 
    required: false 
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  limit?: number = 10;

  @ApiProperty({ 
    example: 'áo thun', 
    description: 'Tìm kiếm theo tên sản phẩm (insensitive, tùy chọn)', 
    required: false 
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ 
    example: 1, 
    description: 'ID category để filter (tùy chọn)', 
    required: false 
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  categoryId?: number;

  @ApiProperty({ 
    example: 1, 
    description: 'ID brand để filter (tùy chọn)', 
    required: false 
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  brandId?: number;

  @ApiProperty({ 
    example: 100000, 
    description: 'Giá tối thiểu (tùy chọn)', 
    required: false 
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  minPrice?: number;

  @ApiProperty({ 
    example: 500000, 
    description: 'Giá tối đa (tùy chọn)', 
    required: false 
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  maxPrice?: number;

  @ApiProperty({ 
    example: 4, 
    description: 'Rating tối thiểu (1-5, tùy chọn)', 
    required: false 
  })
  @IsOptional()
  @Type(() => Number)
  minRating?: number;

  @ApiProperty({ 
    example: 'newest', 
    description: 'Sắp xếp: newest, oldest, price-asc, price-desc, name-asc, name-desc, sold, rating', 
    required: false 
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty({
    example: 'active',
    description: 'Filter trạng thái: active | inactive | draft (draft map về isActive=false)',
    required: false,
    enum: ['active', 'inactive', 'draft'],
  })
  @IsOptional()
  @IsEnum(['active', 'inactive', 'draft'])
  status?: string;

  @ApiProperty({ 
    example: true, 
    description: 'Chỉ hiển thị sản phẩm còn hàng (tùy chọn)', 
    required: false 
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  inStock?: boolean;

  @ApiProperty({ 
    example: true, 
    description: 'Chỉ hiển thị sản phẩm hết hàng (tùy chọn)', 
    required: false 
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  outOfStock?: boolean;
}





