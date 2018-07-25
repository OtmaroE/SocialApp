export class CreatePaymentDto {
    readonly userId: String;
    readonly amountPayed: Number;
    readonly created: Date;
    readonly modified: Date;

    constructor(userId: string, amountPayed: number) {
        this.userId = userId;
        this.amountPayed = amountPayed;
        this.created = new Date();
        this.modified = new Date();
    }
}