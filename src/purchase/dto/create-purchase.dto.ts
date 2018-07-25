export class CreatePurchaseDto {
    readonly userId: string;
    readonly productId: string;
    readonly created: Date;
    readonly modified: Date;

    constructor(userId: string, productId: string) {
        this.userId = userId;
        this.productId = productId;
        this.created = new Date();
        this.modified = new Date();
    }
}
