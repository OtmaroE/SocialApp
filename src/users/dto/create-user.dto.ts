import { IsString, IsNotEmpty, IsMongoId, IsOptional, IsIn } from 'class-validator';

export class CreateUser {
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

    constructor(username, password, role) {
      this.username = username;
      this.password = password;
      this.role = role;
    }
}