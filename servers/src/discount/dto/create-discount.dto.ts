import { IsString, IsOptional, IsNumber, IsArray, IsDateString, IsBoolean, Min, Max } from 'class-validator';
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

  @ApiProperty({ example: false, description: 'Đây có phải Flash Sale không', required: false })
  @IsOptional()
  @IsBoolean()
  isFlashSale?: boolean;

  @ApiProperty({ example: true, description: 'Mã giảm giá có đang bật hay không', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: [1, 2, 3], description: 'Danh sách ID sản phẩm gán vào Flash Sale', required: false })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  applicableToProducts?: number[];

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

  @ApiProperty({ example: 100000, description: 'Đơn hàng tối thiểu để áp dụng', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minOrderAmount?: number;

  @ApiProperty({ example: 200000, description: 'Số tiền giảm tối đa', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxDiscountAmount?: number;

  @ApiProperty({ example: 100, description: 'Giới hạn số lần sử dụng', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  usageLimit?: number;

  @ApiProperty({ example: '2024-06-01T00:00:00Z', description: 'Ngày bắt đầu' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2024-06-30T23:59:59Z', description: 'Ngày kết thúc', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}






