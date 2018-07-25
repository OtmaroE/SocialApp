export class CreatePurchaseDto {
    readonly userId: String;
    readonly productId: String;
    readonly productName: String;
    readonly pricePaid: Number;
    readonly created: Date;
    readonly modified: Date;

    constructor(userId: string, productId: string, productName: string, pricePaid: number) {
        console.log("User: ", userId, " Product: ", productId);
        this.userId = userId;
        this.productId = productId;
        this.productName = productName;
        this.pricePaid = pricePaid;
        this.created = new Date();
        this.modified = new Date();
    }
}