import { ApiModelProperty } from '@nestjs/swagger';

export class CreatePurchaseDto {
    readonly userId: String;
    @ApiModelProperty()
    readonly productId: String;
    readonly productName: String;
    readonly pricePaid: Number;
    readonly created: Date;
    readonly modified: Date;

    constructor(userId: string, productId: string, productName: string = 'Not yet Defined', pricePaid: number = 12) {
        this.userId = userId;
        this.pricePaid = pricePaid;
        this.productId = productId;
        this.productName = productName;
        this.created = new Date();
        this.modified = new Date();
    }
}
