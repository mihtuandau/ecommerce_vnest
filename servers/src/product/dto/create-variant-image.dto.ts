import { IsInt, IsString, IsOptional, IsBoolean, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVariantImageDto {
  @ApiProperty({ 
    example: 1, 
    description: 'ID variant (phải tồn tại)', 
    required: true 
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  variantId: number;

  @ApiProperty({ 
    example: 'https://cloudinary.com/image-variant.jpg', 
    description: 'URL ảnh từ Cloudinary', 
    required: true 
  })
  @IsString()
  url: string;

  @ApiProperty({ 
    example: 'Áo thun đỏ size M', 
    description: 'Alt text cho accessibility', 
    required: false 
  })
  @IsOptional()
  @IsString()
  altText?: string;

  @ApiProperty({ 
    example: true, 
    description: 'Ảnh chính của variant?', 
    required: false 
  })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @ApiProperty({ 
    example: 0, 
    description: 'Thứ tự hiển thị', 
    required: false 
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  displayOrder?: number;
}






