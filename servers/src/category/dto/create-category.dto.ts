import { IsString, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ 
    example: 'Áo sơ mi', 
    description: 'Tên danh mục (unique)', 
    required: true 
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({ 
    example: 'https://example.com/category.jpg', 
    description: 'URL ảnh danh mục' 
  })
  @IsString()
  @IsUrl()
  @IsOptional()
  image?: string;
}





