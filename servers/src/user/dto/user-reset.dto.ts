// @IsDateString() cho string date
import { IsString, IsOptional, IsDateString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserResetDto {
  @ApiProperty({
    description: 'Token reset password (tùy chọn)',
    required: false,
  })
  @IsOptional()
  @IsString()
  resetPasswordToken?: string | null; // Fix: Union string | null để cho phép null

  @ApiProperty({ description: 'Expire time (tùy chọn)', required: false })
  @IsOptional()
  @IsDateString() // Fix: @IsDateString() cho string ISO date
  resetPasswordExpires?: string | null; // Fix: string | null (không Date)

  @ApiProperty({ description: 'Mật khẩu mới (cho reset)', required: false })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}
