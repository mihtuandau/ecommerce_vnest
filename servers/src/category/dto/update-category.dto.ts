import { IsString, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiProperty({ 
    example: 'Áo sơ mi cập nhật', 
    description: 'Tên danh mục mới (tùy chọn)', 
    required: false 
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ 
    example: 'https://example.com/category.jpg', 
    description: 'URL ảnh danh mục mới' 
  })
  @IsString()
  @IsUrl()
  @IsOptional()
  image?: string;
}





