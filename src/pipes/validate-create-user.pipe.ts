import { PipeTransform, Injectable, ArgumentMetadata, HttpStatus, Request } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class ValidateCreateUserPipe implements PipeTransform<any> {
    constructor(private readonly request) { }

    async transform(request: CreateUserDto, metadata: ArgumentMetadata) {
        console.log(this.request);
        return user;
    }
}
