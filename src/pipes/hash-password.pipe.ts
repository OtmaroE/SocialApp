import { PipeTransform, Injectable, ArgumentMetadata, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUser } from '../users/dto/create-user.dto';

@Injectable()
export class HashPasswordPipe implements PipeTransform<CreateUser, Promise<CreateUser>> {
    async transform(user: CreateUser, metadata: ArgumentMetadata): Promise<CreateUser> {
        const hashedPassword = await bcrypt.hash(user.password, 12);
        return new CreateUser(
            user.username,
            hashedPassword,
            user.role,
        );
    }
}
