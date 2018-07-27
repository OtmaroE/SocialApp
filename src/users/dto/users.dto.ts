import { IsString, IsNotEmpty } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class UsersDto {
  @IsString()
  @IsNotEmpty()
  @ApiModelProperty()
  readonly username: string;

  @IsString()
  @ApiModelProperty()
  @IsNotEmpty({
    message: 'Password cant be empty',
  })
  readonly password: string;
}
