import { IsString, IsMongoId, IsNumber, IsDate, IsDateString, IsPositive } from 'class-validator';

export class CreatePurchaseDto {
    @IsString()
    readonly userId: string;
    @IsMongoId()
    readonly productId: string;
    @IsString()
    readonly productName: string;
    @IsPositive()
    readonly quantity: number;
    @IsPositive()
    readonly pricePaid: number;
    @IsDate()
    readonly created: Date;
    @IsDateString()
    readonly modified: Date;

    constructor(userId: string, productId: string, quantity: number = 1, productName: string = 'Not yet Defined', pricePaid: number = 12) {
        this.userId = userId;
        this.pricePaid = pricePaid;
        this.quantity = quantity;
        this.productId = productId;
        this.productName = productName;
        this.created = new Date();
        this.modified = new Date();
    }
}
