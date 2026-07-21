import {
  IsString,
  IsOptional,
  MinLength,
  IsEmail,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UpdateUserDto {
  @ApiProperty({
    example: 'John Doe Updated',
    description: 'Tên user mới (tùy chọn)',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'newemail@example.com',
    description: 'Email mới (tùy chọn)',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: 'newpassword456',
    description: 'Mật khẩu mới (tùy chọn, tối thiểu 6 ký tự)',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiProperty({
    example: 'oldpassword123',
    description:
      'Mật khẩu hiện tại (bắt buộc khi tự đổi mật khẩu qua PUT /users/profile)',
    required: false,
  })
  @IsOptional()
  @IsString()
  currentPassword?: string;

  @ApiProperty({
    example: 'ADMIN',
    description: 'Vai trò mới (ADMIN, WAREHOUSE, SALES, CUSTOMER)',
    required: false,
    enum: Role,
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiProperty({ example: '0912345678', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', required: false })
  @IsOptional()
  @IsString()
  avatar?: string;
}
