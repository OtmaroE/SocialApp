import { PipeTransform, Injectable, ArgumentMetadata, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class HashPasswordPipe implements PipeTransform<CreateUserDto, Promise<CreateUserDto>> {
    async transform(user: CreateUserDto, metadata: ArgumentMetadata): Promise<CreateUserDto> {
        const hashedPassword = await bcrypt.hash(user.password, 12);
        return new CreateUserDto(
            user.username,
            hashedPassword,
            user.email,
            user.role,
        );
    }
}
