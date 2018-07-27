import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';

export class UsersDto {
    @IsMongoId()
    readonly _id: string;

    @IsString()
    @IsNotEmpty()
    readonly username: string;

    @IsString()
    @IsNotEmpty({
        message: 'Password cant be empty',
    })
    readonly password: string;
}
