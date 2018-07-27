import { IsString, IsNotEmpty, IsMongoId, IsOptional } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class UsersDto {
    @IsOptional()
    @IsMongoId()
    readonly _id: string;

    @IsString()
    @IsNotEmpty()
    @ApiModelProperty()
    readonly username: string;

    @IsString()
    @IsNotEmpty({
        message: 'Password cant be empty',
    })
    @ApiModelProperty()
    readonly password: string;

    @IsOptional()
    @IsString()
    @ApiModelProperty()
    readonly role?: string;
}
