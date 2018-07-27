import { IsString, IsNotEmpty, IsMongoId, IsOptional } from 'class-validator';

export class UsersDto {
    @IsOptional()
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

    @IsOptional()
    @IsString()
    readonly role?: string;
}
