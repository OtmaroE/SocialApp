export interface Purchase {
    readonly userId: string;
    readonly productId: string;
    readonly created: Date;
    readonly modified: Date;
}
