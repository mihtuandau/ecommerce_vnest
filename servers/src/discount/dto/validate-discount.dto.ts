import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ValidateDiscountDto {
  @ApiProperty({
    example: 'SUMMER2024',
    description: 'Mã giảm giá cần validate',
  })
  @IsString()
  code: string;
}
