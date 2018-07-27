import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Req,
    HttpCode,
    Body,
    ValidationPipe,
    UsePipes,
    BadRequestException,
    ForbiddenException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { PurchaseService } from '../purchase/purchase.service';
import { CreateProductDto } from './dto/create-product.dto';
import { CreatePurchaseDto } from '../purchase/dto/create-purchase.dto';
import { PatchProductDto } from './dto/patch-product.dto';
import { Product } from './interfaces/product.interface';
import { Purchase } from '../purchase/interfaces/purchase.interface';
import { Validator } from 'class-validator';
import { Roles } from '../decorators/roles.decorator';
import * as jwt from 'jsonwebtoken';
import { ApiUseTags, ApiBearerAuth, ApiResponse, ApiConsumes } from '@nestjs/swagger';
const validator = new Validator();

@Controller('products')
@ApiUseTags('Products')
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
        private readonly purchaseService: PurchaseService,
    ) { }

    @Get()
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'List of products was generated.' })
    findAll(): Promise<Product[]> {
        return this.productsService.findAll();
    }

    @Get(':id')
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Product was found.' })
    @ApiResponse({ status: 404, description: 'Product was NOT found.' })
    findOne(@Param('id') id: string) {
        if (!validator.isMongoId(id)) throw new BadRequestException();
        return this.productsService.findOne(id);
    }

    @Post()
    @ApiBearerAuth()
    @ApiResponse({ status: 201, description: 'Product was created.' })
    @UsePipes(new ValidationPipe({ transform: true }))
    create(@Body() createProductDto: CreateProductDto): Promise<Product> {
        return this.productsService.create(createProductDto);
    }

    @Post(':id/purchases')
    @ApiBearerAuth()
    @ApiResponse({ status: 201, description: 'Purchase was registered.' })
    @Roles('user', 'admin')
    createPurchase(@Param('id') id: string, @Req() req): Promise<Purchase> {
        const token = req.headers ? req.headers.authorization : null;
        if (!token) throw new ForbiddenException();
        const user = jwt.decode(token);
        const createPurchaseDto = new CreatePurchaseDto(user.id, id);
        return this.purchaseService.create(createPurchaseDto);
    }

    @Patch(':id')
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Product was updated.' })
    @UsePipes(new ValidationPipe({ transform: true }))
    updateAttribute(@Body() patchProductDto: PatchProductDto, @Param('id') id: string): Promise<Product> {
        if (!validator.isMongoId(id)) throw new BadRequestException();
        return this.productsService.updateAttribute(patchProductDto, id);
    }

    @Delete(':id')
    @ApiBearerAuth()
    @ApiResponse({ status: 204, description: 'Product was deleted.' })
    @HttpCode(204)
    deleteById(@Param('id') id: string) {
        if (!validator.isMongoId(id)) throw new BadRequestException();
        this.productsService.deleteById(id);
    }
}
