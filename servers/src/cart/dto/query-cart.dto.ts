import { IsInt, IsPositive, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class QueryCartDto {
  @ApiProperty({ 
    example: 1, 
    description: 'ID user (tùy chọn, mặc định từ token)', 
    required: false 
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @IsPositive()
  userId?: number;
}





