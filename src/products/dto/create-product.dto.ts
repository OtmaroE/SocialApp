import { IsString, IsNumber } from 'class-validator';

export class CreateProductDto {
    @IsString()
    readonly name: string;

    @IsNumber()
    readonly price: number;

    @IsString()
    readonly brand: string;
}
