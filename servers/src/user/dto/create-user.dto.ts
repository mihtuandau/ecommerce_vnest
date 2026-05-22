import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email của user (phải hợp lệ)',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Mật khẩu (tối thiểu 6 ký tự)',
    required: true,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Tên user (tùy chọn)',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'ADMIN',
    description:
      'Vai trò user (ADMIN, WAREHOUSE, SALES, CUSTOMER)',
    required: false,
    enum: Role,
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}






