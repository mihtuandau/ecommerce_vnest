import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  MaxLength,
} from 'class-validator';

export class CreateAddressDto {
  @IsString()
  @IsNotEmpty({ message: 'Họ tên không được để trống' })
  @MaxLength(100, { message: 'Họ tên không được quá 100 ký tự' })
  fullName: string;

  @IsString()
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  @MaxLength(20, { message: 'Số điện thoại không được quá 20 ký tự' })
  phoneNumber: string;

  @IsString()
  @IsNotEmpty({ message: 'Tỉnh/Thành phố không được để trống' })
  province: string;

  @IsString()
  @IsNotEmpty({ message: 'Mã tỉnh/thành phố không được để trống' })
  provinceCode: string;

  @IsString()
  @IsNotEmpty({ message: 'Quận/Huyện không được để trống' })
  district: string;

  @IsString()
  @IsNotEmpty({ message: 'Mã quận/huyện không được để trống' })
  districtCode: string;

  @IsString()
  @IsNotEmpty({ message: 'Phường/Xã không được để trống' })
  ward: string;

  @IsString()
  @IsNotEmpty({ message: 'Mã phường/xã không được để trống' })
  wardCode: string;

  @IsString()
  @IsNotEmpty({ message: 'Địa chỉ cụ thể không được để trống' })
  @MaxLength(200, { message: 'Địa chỉ cụ thể không được quá 200 ký tự' })
  specificAddress: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Loại địa chỉ không được quá 100 ký tự' })
  addressType?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
