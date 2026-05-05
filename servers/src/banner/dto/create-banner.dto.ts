import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsInt, IsUrl } from 'class-validator';

export class CreateBannerDto {
  @ApiProperty({ example: 'Summer Sale 2024', description: 'Banner title' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Giảm giá lên đến 50%', description: 'Banner subtitle' })
  @IsString()
  @IsOptional()
  subtitle?: string;

  @ApiProperty({ example: 'https://example.com/banner.jpg', description: 'Banner image URL' })
  @IsString()
  @IsUrl()
  image: string;

  @ApiPropertyOptional({ example: 'https://example.com/video.mp4', description: 'Banner video URL' })
  @IsString()
  @IsUrl()
  @IsOptional()
  video?: string;

  @ApiPropertyOptional({ example: '/products/sale', description: 'Link to navigate when clicked' })
  @IsString()
  @IsOptional()
  link?: string;

  @ApiPropertyOptional({ example: 'Mua ngay', description: 'CTA button text', default: 'Mua ngay' })
  @IsString()
  @IsOptional()
  buttonText?: string;

  @ApiPropertyOptional({ example: true, description: 'Is banner active', default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 1, description: 'Display order', default: 0 })
  @IsInt()
  @IsOptional()
  displayOrder?: number;
}






