import {
  IsString,
  IsPhoneNumber,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiProperty({
    example: 'Nguyễn Văn A',
    description: 'Họ và tên đầy đủ',
    required: true,
  })
  @IsString()
  fullName: string;

  @ApiProperty({
    example: '0123456789',
    description: 'Số điện thoại',
    required: true,
  })
  @IsString()
  phone: string;

  @ApiProperty({
    example: '123 Đường ABC',
    description: 'Địa chỉ chi tiết',
    required: true,
  })
  @IsString()
  street: string;

  @ApiProperty({
    example: 'Hồ Chí Minh',
    description: 'Thành phố',
    required: true,
  })
  @IsString()
  city: string;

  @ApiProperty({
    example: 'Quận 1',
    description: 'Quận/Huyện (tùy chọn)',
    required: false,
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({
    example: 'Phường Bến Nghé',
    description: 'Phường/Xã (tùy chọn)',
    required: false,
  })
  @IsOptional()
  @IsString()
  ward?: string;

  @ApiProperty({
    example: '70000',
    description: 'Mã bưu điện (tùy chọn)',
    required: false,
  })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiProperty({
    example: 'Vietnam',
    description: 'Quốc gia (tùy chọn, mặc định Vietnam)',
    required: false,
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({
    example: 'home',
    description: 'Loại địa chỉ: home, office, other (tùy chọn)',
    required: false,
  })
  @IsOptional()
  @IsString()
  addressType?: string;

  @ApiProperty({
    example: true,
    description: 'Địa chỉ mặc định? (tùy chọn)',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}






