import { IsString, IsNotEmpty } from 'class-validator';

export class UsersDto {
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsString()
  @IsNotEmpty({
    message: 'Password cant be empty',
  })
  readonly password: string;
}
