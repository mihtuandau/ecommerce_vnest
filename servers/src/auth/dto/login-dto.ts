import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';  

export class LoginDto {
  @ApiProperty({ 
    example: 'user@example.com', 
    description: 'Email của user (phải hợp lệ)', 
    required: true 
  })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    example: 'password123', 
    description: 'Mật khẩu (tối thiểu 6 ký tự)', 
    required: true 
  })
  @IsString()
  @MinLength(6)
  password: string;
}





