import { IsString, IsOptional, IsNumber, IsDateString, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDiscountDto {
  @ApiProperty({ example: 'SUMMER2024', description: 'Mã giảm giá' })
  @IsString()
  code: string;

  @ApiProperty({ example: 'Giảm giá mùa hè', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'https://res.cloudinary.com/...', description: 'URL ảnh banner', required: false })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ example: 10, description: 'Phần trăm giảm giá (0-100)', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  percentage?: number;

  @ApiProperty({ example: 50000, description: 'Số tiền giảm cố định', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  fixedAmount?: number;

  @ApiProperty({ example: '2024-06-01T00:00:00Z', description: 'Ngày bắt đầu' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2024-06-30T23:59:59Z', description: 'Ngày kết thúc', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
