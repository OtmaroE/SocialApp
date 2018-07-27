export interface Purchase {
    readonly userId: string;
    readonly productId: string;
    readonly productName: string;
    readonly pricePaid: number;
    readonly created: Date;
    readonly modified: Date;
}
