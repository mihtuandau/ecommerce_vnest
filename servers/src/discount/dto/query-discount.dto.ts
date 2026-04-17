import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryDiscountDto {
  @ApiPropertyOptional({ description: 'Tìm kiếm theo mã hoặc mô tả' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Lọc theo trạng thái: active, expired, upcoming' })
  @IsOptional()
  @IsString()
  status?: string;
}






