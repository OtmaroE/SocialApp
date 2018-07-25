export class CreatePurchaseDto {
    readonly userId: String;
    readonly productId: String;
    readonly productName: String;
    readonly pricePaid: Number;
    readonly created: Date;
    readonly modified: Date;

    constructor(userId: string, productId: string) {
        this.userId = userId;
        this.pricePaid = 12;
        this.productId = productId;
        this.created = new Date();
        this.modified = new Date();
    }
}
