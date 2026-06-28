import { IsBoolean } from 'class-validator';

export class DeleteUserDto {
  @IsBoolean()
  confirm: boolean;
}
