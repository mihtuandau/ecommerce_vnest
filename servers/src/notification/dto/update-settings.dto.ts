import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateNotificationSettingsDto {
  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  orderStatus?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  promotions?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  newsletter?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  security?: boolean;
}
