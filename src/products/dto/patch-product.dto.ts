import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class PatchProductDto {
    @IsOptional()
    @IsString()
    @ApiModelPropertyOptional()
    readonly name?: string;

    @IsOptional()
    @IsNumber()
    @ApiModelPropertyOptional()
    readonly price?: number;

    @IsOptional()
    @IsString()
    @ApiModelPropertyOptional()
    readonly brand?: string;
}
