import { PipeTransform, Injectable, ArgumentMetadata, HttpStatus, BadRequestException, NotFoundException } from '@nestjs/common';
import { User } from 'users/interface/users.interface';
import { Validator } from 'class-validator';
const validator = new Validator();

@Injectable()
export class ValidateMongoId implements PipeTransform {
  async transform(value: string, metadata: ArgumentMetadata): Promise<string> {
    if (!validator.isMongoId(value)) throw new BadRequestException('Invalid Id');
    else return value;
  }
}