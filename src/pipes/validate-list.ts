import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { PurchaseListDto } from '../purchase/dto/list-purchase.dto';

@Injectable()
export class ValidatePurchaseList implements PipeTransform {
  async transform(list: PurchaseListDto, metadata: ArgumentMetadata): Promise<PurchaseListDto> {
    for (const item of list) {
      if (item.quantity <= 0) throw new BadRequestException('Invalid quantity');
    }
    return list;
  }
}