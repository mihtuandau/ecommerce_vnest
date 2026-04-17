import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; 

export class RegisterDto {
  @ApiProperty({ 
    example: 'user@example.com', 
    description: 'Email của user (phải hợp lệ)', 
    required: true 
  })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    example: 'password123', 
    description: 'Mật khẩu (tối thiểu 8 ký tự)', 
    required: true 
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ 
    example: 'John Doe', 
    description: 'Tên user (tùy chọn)', 
    required: false 
  })
  @IsOptional()
  @IsString()
  name?: string;
}





