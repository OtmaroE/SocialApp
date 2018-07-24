import { Controller, Get, Post, Delete, Param } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Get()
    findAll() {
        this.productsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {

    }

    @Post()
    create(createProductDto: CreateProductDto) {
        this.productsService.create(createProductDto);
    }

    @Delete(':id')
    deleteById(@Param('id') id: string) {

    }
}
