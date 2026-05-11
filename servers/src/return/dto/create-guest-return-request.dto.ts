import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateReturnRequestDto } from './create-return-request.dto';

export class CreateGuestReturnRequestDto extends CreateReturnRequestDto {
  @ApiProperty({ description: 'Mã đơn hàng' })
  @IsString()
  @IsNotEmpty()
  orderCode: string;

  @ApiProperty({ description: 'Email hoặc Số điện thoại liên hệ' })
  @IsString()
  @IsNotEmpty()
  contact: string;
}
