export class CreatePaymentDto {
    readonly userId: String;
    readonly amountPaid: Number;
    readonly created: Date;
    readonly modified: Date;

    constructor(userId: string, amountPaid: number) {
        this.userId = userId;
        this.amountPaid = amountPaid;
        this.created = new Date();
        this.modified = new Date();
    }
}