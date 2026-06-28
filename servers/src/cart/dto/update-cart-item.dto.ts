import { IsInt, IsPositive, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartItemDto {
  @ApiProperty({
    example: 3,
    description: 'Số lượng mới (tùy chọn)',
    required: false,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @IsPositive()
  quantity?: number;
}
