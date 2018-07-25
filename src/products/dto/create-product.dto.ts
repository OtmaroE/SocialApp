export class CreateProductDto {
    readonly name: string;
    readonly price: number;
    readonly brand: string;
    readonly created: Date;
    readonly modified: Date;

    constructor(name: string, price: number, brand: string) {
        this.name = name;
        this.price = price;
        this.brand = brand;
        this.created = new Date();
        this.modified = new Date();
    }
}
