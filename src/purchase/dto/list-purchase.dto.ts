import { CreatePurchaseDto } from './create-purchase.dto';

export class PurchaseListDto implements Iterable<CreatePurchaseDto>{
  readonly Purchase: CreatePurchaseDto[];
  [Symbol.iterator]() {
    let pointer = 0;
    const List = this.Purchase;

    return {
      next(): IteratorResult<CreatePurchaseDto> {
        if (pointer < List.length) {
          return {
            done: false,
            value: List[pointer++],
          };
        } else {
          return {
            done: true,
            value: null,
          };
        }
      },
    };
  }
}