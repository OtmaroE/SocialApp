import { IsString, IsNumber, IsOptional } from 'class-validator';

export class PatchProductDto {
    @IsOptional()
    @IsString()
    readonly name?: string;

    @IsOptional()
    @IsNumber()
    readonly price?: number;

    @IsOptional()
    @IsString()
    readonly brand?: string;
}
