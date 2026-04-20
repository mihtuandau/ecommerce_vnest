import {
  IsString,
  IsPhoneNumber,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAddressDto {
  @ApiProperty({
    example: 'Nguyễn Văn A',
    description: 'Họ và tên đầy đủ',
    required: false,
  })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({
    example: '0123456789',
    description: 'Số điện thoại',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    example: '123 Đường ABC',
    description: 'Địa chỉ chi tiết',
    required: false,
  })
  @IsOptional()
  @IsString()
  street?: string;

  @ApiProperty({
    example: 'Hồ Chí Minh',
    description: 'Thành phố',
    required: false,
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({
    example: 'Quận 1',
    description: 'Quận/Huyện',
    required: false,
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({
    example: 'Phường Bến Nghé',
    description: 'Phường/Xã',
    required: false,
  })
  @IsOptional()
  @IsString()
  ward?: string;

  @ApiProperty({
    example: '70000',
    description: 'Mã bưu điện',
    required: false,
  })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiProperty({
    example: 'Vietnam',
    description: 'Quốc gia',
    required: false,
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({
    example: 'home',
    description: 'Loại địa chỉ: home, office, other',
    required: false,
  })
  @IsOptional()
  @IsString()
  addressType?: string;

  @ApiProperty({
    example: true,
    description: 'Đặt làm địa chỉ mặc định?',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}






