import { IsString, IsNumber } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class CreateProductDto {
    @ApiModelProperty()
    @IsString()
    readonly name: string;

    @ApiModelProperty()
    @IsNumber()
    readonly price: number;

    @ApiModelProperty()
    @IsString()
    readonly brand: string;
}
