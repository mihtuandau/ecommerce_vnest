import {
  IsInt,
  IsString,
  IsOptional,
  IsBoolean,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateImageDto {
  @ApiProperty({
    example: 1,
    description: 'ID sản phẩm (phải tồn tại)',
    required: true,
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  productId: number;

  @ApiProperty({
    example: 'https://cloudinary.com/image1.jpg',
    description: 'URL ảnh từ Cloudinary',
    required: true,
  })
  @IsString()
  url: string;

  @ApiProperty({
    example: 'Áo thun màu đỏ',
    description: 'Alt text cho accessibility',
    required: false,
  })
  @IsOptional()
  @IsString()
  altText?: string;

  @ApiProperty({
    example: true,
    description: 'Ảnh thumbnail chính?',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isThumbnail?: boolean;

  @ApiProperty({
    example: 0,
    description: 'Thứ tự hiển thị',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  displayOrder?: number;
}
