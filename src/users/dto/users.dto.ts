import { IsString } from 'class-validator';

export class UsersDto {
  @IsString()
  readonly username: string;

  @IsString()
  readonly password: string;
}
