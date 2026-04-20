import { IsInt, IsString, IsOptional, IsNumber, IsPositive, Min, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';  

export class CreateVariantDto {
  @ApiProperty({ 
    example: 1, 
    description: 'ID sản phẩm (phải tồn tại)', 
    required: false 
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  productId?: number;

  @ApiProperty({ 
    example: 'M', 
    description: 'Size (S, M, L, XL)', 
    required: false 
  })
  @IsOptional()
  @IsString()
  size?: string;

  @ApiProperty({ 
    example: 'Red', 
    description: 'Màu sắc', 
    required: false 
  })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({ 
    example: 50, 
    description: 'Số lượng tồn kho', 
    required: false 
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsNumber()
  stock: number;

  @ApiProperty({ 
    example: 200000, 
    description: 'Giá variant (có thể override basePrice)', 
    required: false 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ 
    example: 'ATN001-M-Red', 
    description: 'Mã SKU unique (tùy chọn)', 
    required: false 
  })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({
    example: 5,
    description: 'Ngưỡng cảnh báo hết hàng (tùy chọn, mặc định 5)',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  lowStockThreshold?: number;

  @ApiProperty({
    example: true,
    description: 'Variant còn bán không (tùy chọn, mặc định true)',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}





