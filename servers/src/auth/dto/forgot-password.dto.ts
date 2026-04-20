
import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({ 
    example: 'user@example.com', 
    description: 'Email để gửi link reset', 
    required: true 
  })
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({ 
    example: 'user@example.com', 
    description: 'Email của user', 
    required: true 
  })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    example: 'abc123def456...', 
    description: 'Token reset password từ email', 
    required: true 
  })
  @IsString()
  token: string;

  @ApiProperty({ 
    example: 'newpassword123', 
    description: 'Mật khẩu mới (tối thiểu 6 ký tự)', 
    required: true 
  })
  @IsString()
  @MinLength(6)
  password: string;
}





