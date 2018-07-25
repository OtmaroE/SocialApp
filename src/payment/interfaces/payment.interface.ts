export interface Payment {
    readonly userId: string;
    readonly amountPayed: number;
    readonly created: Date;
    readonly modified: Date;
}