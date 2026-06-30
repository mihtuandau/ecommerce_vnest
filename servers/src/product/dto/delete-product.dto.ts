import { IsBoolean } from 'class-validator';

export class DeleteProductDto {
  @IsBoolean()
  confirm: boolean;
}
