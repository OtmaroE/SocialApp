import { PipeTransform, Injectable, ArgumentMetadata, HttpStatus, BadRequestException, NotFoundException } from '@nestjs/common';
import { Validator } from 'class-validator';
const validator = new Validator();

@Injectable()
export class ValidateNumber implements PipeTransform {
  async transform(value: number, metadata: ArgumentMetadata): Promise<number> {
    if (!validator.isNumber(value) || value <= 0) throw new BadRequestException('Value is not a number');
    else return value;
  }
}