import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ReturnStatus } from '@prisma/client';

export class UpdateReturnRequestDto {
  @ApiProperty({ description: 'Trạng thái mới của yêu cầu trả hàng', enum: ReturnStatus })
  @IsEnum(ReturnStatus)
  @IsOptional()
  status?: ReturnStatus;

  @ApiPropertyOptional({ description: 'Ghi chú của admin' })
  @IsString()
  @IsOptional()
  adminNote?: string;
}
