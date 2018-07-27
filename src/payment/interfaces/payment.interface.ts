export interface Payment {
    readonly userId: string;
    readonly amountPaid: number;
    readonly created: Date;
    readonly modified: Date;
}