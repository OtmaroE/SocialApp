import { Controller, Get, Post, Body, BadRequestException, UseGuards, Req } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { PurchaseService } from './purchase.service';
import { Purchase } from './interfaces/purchase.interface';
import { RoleGuard } from '../authentication/auth.guard';
import { Roles } from '../authentication/auth.decorator';
import { ProductsService } from '../products/products.service';
import { UserService} from '../users/users.service';

@Controller('purchase')
@UseGuards(RoleGuard)
export class PurchaseController {
    constructor(
        private readonly purchaseService: PurchaseService,
        private readonly productsService: ProductsService,
        private readonly userService: UserService
    ) {}

    @Post()
    @Roles('admin')
    async create(@Body() createPurchaseDto: CreatePurchaseDto, @Req() request){
        const productId = String(createPurchaseDto.productId);
        // validate objectId
        const productExistance = await this.productsService.findOne(productId);
        if(!productExistance){
             throw new BadRequestException();
        }
        const newPurchase = new CreatePurchaseDto(request.user.id, productId);
        return this.purchaseService.create(newPurchase);
    }

    @Get('/details')
    @Roles('admin')
    async findAllDetails(@Req() request): Promise<Purchase[]> {
        return this.purchaseService.findAllDetails(request.user);
    }

    @Get()
    @Roles('admin')
    async findAll(@Req() request): Promise<Purchase[]> {
        return this.purchaseService.findAll(request.user);
    }
}
