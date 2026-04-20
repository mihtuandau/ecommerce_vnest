import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterAdminDto {
  @ApiProperty({ 
    example: 'admin@example.com', 
    description: 'Email của admin (phải hợp lệ)', 
    required: true 
  })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    example: 'admin123', 
    description: 'Mật khẩu (tối thiểu 6 ký tự)', 
    required: true 
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ 
    example: 'Admin User', 
    description: 'Tên admin (tùy chọn)', 
    required: false 
  })
  @IsOptional()
  @IsString()
  name?: string;
}






