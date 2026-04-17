import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiProperty({ description: 'Họ tên người nhận' })
  @IsString()
  @IsNotEmpty({ message: 'Họ tên không được để trống' })
  @MaxLength(100, { message: 'Họ tên không được quá 100 ký tự' })
  fullName: string;

  @ApiProperty({ description: 'Số điện thoại' })
  @IsString()
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  @MaxLength(20, { message: 'Số điện thoại không được quá 20 ký tự' })
  phone: string;

  @ApiProperty({ description: 'Địa chỉ cụ thể' })
  @IsString()
  @IsNotEmpty({ message: 'Địa chỉ cụ thể không được để trống' })
  @MaxLength(200, { message: 'Địa chỉ cụ thể không được quá 200 ký tự' })
  street: string;

  @ApiProperty({ description: 'Phường/Xã' })
  @IsString()
  @IsNotEmpty({ message: 'Phường/Xã không được để trống' })
  ward: string;

  @ApiProperty({ description: 'Tỉnh/Thành phố' })
  @IsString()
  @IsNotEmpty({ message: 'Tỉnh/Thành phố không được để trống' })
  city: string;

  @ApiProperty({ description: 'Quận/Huyện' })
  @IsString()
  @IsNotEmpty({ message: 'Quận/Huyện không được để trống' })
  state: string;

  @ApiPropertyOptional({ description: 'Mã bưu điện' })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiPropertyOptional({ description: 'Quốc gia', default: 'Vietnam' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ description: 'Loại địa chỉ (HOME, OFFICE, OTHER)', default: 'HOME' })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Loại địa chỉ không được quá 100 ký tự' })
  addressType?: string;

  @ApiPropertyOptional({ description: 'Đặt làm địa chỉ mặc định', default: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}






