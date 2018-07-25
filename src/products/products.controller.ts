import { Controller, Get, Post, Patch, Delete, Param, Req, HttpCode, Body, ValidationPipe, UsePipes, BadRequestException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { PurchaseService } from '../purchase/purchase.service';
import { CreateProductDto } from './dto/create-product.dto';
import { CreatePurchaseDto } from '../purchase/dto/create-purchase.dto';
import { PatchProductDto } from './dto/patch-product.dto';
import { Product } from './interfaces/product.interface';
import { Purchase } from '../purchase/interfaces/purchase.interface';
import { Validator } from 'class-validator';
const validator = new Validator();

@Controller('products')
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
        private readonly purchaseService: PurchaseService,
    ) { }

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

    @Post(':id/purchase')
    createPurchase(@Param('id') id: string, @Req() req): Promise<Purchase> {
        const createPurchaseDto = new CreatePurchaseDto(req.user.id, id);
        return this.purchaseService.create(createPurchaseDto);
    }

    @Patch(':id')
    @UsePipes(new ValidationPipe({ transform: true }))
    updateAttribute(@Body() patchProductDto: PatchProductDto, @Param('id') id: string): Promise<Product> {
        if (!validator.isMongoId(id)) throw new BadRequestException();
        return this.productsService.updateAttribute(patchProductDto, id);
    }

    @Delete(':id')
    @HttpCode(204)
    deleteById(@Param('id') id: string) {
        if (!validator.isMongoId(id)) throw new BadRequestException();
        this.productsService.deleteById(id);
    }
}
