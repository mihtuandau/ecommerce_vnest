import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ApplyDiscountDto {
  @ApiProperty({
    example: 'SAVE10',
    description: 'Mã giảm giá',
    required: true,
  })
  @IsString()
  code: string;
}
