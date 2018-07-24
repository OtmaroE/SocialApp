export class CreatePurchaseDto {
    readonly userId: String;
    readonly productId: String;
    readonly created: Date;
    readonly modified: Date;

    constructor(userId: string, productId: string) {
        this.userId = userId;
        this.productId = productId;
        this.created = new Date();
        this.modified = new Date();
    }
}