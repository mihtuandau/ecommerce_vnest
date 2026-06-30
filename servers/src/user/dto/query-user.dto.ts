import { IsOptional, IsInt, IsPositive, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { Role } from '@prisma/client';

export class QueryUserDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  limit?: number = 10;

  @IsOptional()
  @IsEnum(['CUSTOMER', 'ADMIN'])
  role?: Role;

  @IsOptional()
  @IsEnum(['ACTIVE', 'SUSPENDED'])
  status?: 'ACTIVE' | 'SUSPENDED';
}
