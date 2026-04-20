import { IsInt, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AddCartItemDto {
  @ApiProperty({ 
    example: 1, 
    description: 'ID variant sản phẩm (phải tồn tại)', 
    required: true 
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  variantId: number;

  @ApiProperty({ 
    example: 2, 
    description: 'Số lượng (mặc định 1)', 
    required: false 
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  quantity: number = 1;
}





