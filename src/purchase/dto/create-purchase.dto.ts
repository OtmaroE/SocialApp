import { IsString, IsMongoId, IsNumber, IsDate, IsDateString, IsPositive } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class CreatePurchaseDto {
    @IsString()
    readonly userId: string;
    @IsMongoId()
    readonly productId: string;
    @IsString()
    readonly productName: string;
    @IsPositive()
    readonly pricePaid: number;
    @IsDate()
    readonly created: Date;
    @IsDateString()
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
