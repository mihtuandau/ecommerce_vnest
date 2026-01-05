import { IsOptional, IsDateString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ReportQueryDto {
  @ApiPropertyOptional({ description: 'Start date (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Year for monthly/yearly reports' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  year?: number;

  @ApiPropertyOptional({ description: 'Start year for yearly comparison' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  startYear?: number;

  @ApiPropertyOptional({ description: 'End year for yearly comparison' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  endYear?: number;

  @ApiPropertyOptional({ description: 'Limit for top products/categories', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}
