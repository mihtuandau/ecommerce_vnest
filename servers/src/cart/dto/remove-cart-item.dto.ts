import { IsInt, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class RemoveCartItemDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  variantId: number;
}





