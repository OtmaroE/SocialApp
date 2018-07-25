import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { PurchaseService } from './purchase.service';
import { Purchase } from './interfaces/purchase.interface';
import { RoleGuard } from '../authentication/auth.guard';
import { Roles } from '../authentication/auth.decorator';
import { ProductsService } from '../products/products.service';

@Controller('purchase')
@UseGuards(RoleGuard)
export class PurchaseController {
    constructor(
        private readonly purchaseService: PurchaseService,
        private readonly productsService: ProductsService
    ) {}

    @Post()
    @Roles('admin')
    async create(@Body() createPurchaseDto: CreatePurchaseDto, @Req() request){
        const productId = String(createPurchaseDto.productId);
        // validate objectId
        const ProductExistance = await this.productsService.findOne(productId);
        if(ProductExistance){
            return this.purchaseService.create(createPurchaseDto, request.user.id);
        }
        return {status: 409, message: 'Not a valid Product'};
    }

    @Get()
    @Roles('admin')
    async findAll(@Req() request): Promise<Purchase[]> {
        return this.purchaseService.findAll(request.user);
    }

}