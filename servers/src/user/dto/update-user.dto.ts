import { IsString, IsOptional, MinLength, IsEmail, IsEnum } from 'class-validator';
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
    example: 'ADMIN',
    description: 'Vai trò mới (ADMIN, KHO, BAN_HANG, CUSTOMER)',
    required: false,
    enum: Role,
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}






