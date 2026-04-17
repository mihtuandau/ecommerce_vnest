import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteOrderDto {
  @ApiProperty({ 
    example: true, 
    description: 'Xác nhận xóa (bắt buộc true)', 
    required: true 
  })
  @IsBoolean()
  confirm: boolean;
}





