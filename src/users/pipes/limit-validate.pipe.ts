import { PipeTransform, Injectable, ArgumentMetadata, HttpStatus, BadRequestException } from '@nestjs/common';

@Injectable()
export class ValidateLimit implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);
    if (!val || Number.isNaN(val) || val <= 0) {
      throw new BadRequestException('Invalid limit');
    }
    return val;
  }
}