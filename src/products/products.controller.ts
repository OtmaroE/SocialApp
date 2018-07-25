import { Controller, Get, Post, Delete, Param, HttpCode, Body, ValidationPipe, UsePipes, BadRequestException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './interfaces/product.interface';
import { Validator } from 'class-validator';
const validator = new Validator();

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Get()
    findAll(): Promise<Product[]> {
        return this.productsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        if (!validator.isMongoId(id)) throw new BadRequestException();
        return this.productsService.findOne(id);
    }

    @Post()
    @UsePipes(new ValidationPipe({ transform: true }))
    create(@Body() createProductDto: CreateProductDto): Promise<Product> {
        return this.productsService.create(createProductDto);
    }

    @Delete(':id')
    @HttpCode(204)
    deleteById(@Param('id') id: string) {
        if (!validator.isMongoId(id)) throw new BadRequestException();
        this.productsService.deleteById(id);
    }
}
