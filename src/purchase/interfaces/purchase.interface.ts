export interface Purchase {
    readonly userId: String;
    readonly productId: String;
    readonly productName: String;
    readonly pricePaid: Number;
    readonly created: Date;
    readonly modified: Date;
}