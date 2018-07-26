import { Controller, Get, Post, Body, BadRequestException, UseGuards, HttpCode ,Req, HttpException, HttpStatus } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { PurchaseService } from './purchase.service';
import { Purchase } from './interfaces/purchase.interface';
import { RoleGuard } from '../authentication/auth.guard';
import { Roles } from '../authentication/auth.decorator';
import { ProductsService } from '../products/products.service';
import { UserService} from '../users/users.service';
import { PaymentService } from 'payment/payment.service';

@Controller('purchases')
@UseGuards(RoleGuard)
export class PurchaseController {
    constructor(
        private readonly purchaseService: PurchaseService,
        private readonly productsService: ProductsService,
        private readonly userService: UserService,
        private readonly paymentService: PaymentService
    ) {}

    @Post()
    @Roles('admin')
    async create(@Body() createPurchaseDto: CreatePurchaseDto, @Req() request){
        const productId = String(createPurchaseDto.productId);
        if(productId.length !== 24){
            throw new HttpException('Bad Prodict Id', HttpStatus.BAD_REQUEST);
        }
        const productExistance = await this.productsService.findOne(productId);
        if(!productExistance){
             throw new BadRequestException();
        }
        const userInfo = await this.userService.findById(request.user.id);
        const userTotalDebt = await this.purchaseService.getUserTotalDebt(request.user.id);
        const userTotalPayed = await this.paymentService.getUserTotalPaid(request.user.id);
        const userUsedCredit = userTotalDebt - userTotalPayed;
        if(userInfo.creditLimit <=  userUsedCredit){
           throw new HttpException('Already reach purchase Limit', HttpStatus.CONFLICT);
        }
        const newPurchase = new CreatePurchaseDto(request.user.id, productId);
        return this.purchaseService.create(newPurchase);
    }

    @Get()
    @Roles('admin')
    async findAllDetails(@Req() request): Promise<Purchase[]> {
        return this.purchaseService.findAllDetails(request.user.id);
    }

    @Get('debt')
    @Roles('admin')
    async getUserTotalDebt(@Req() request): Promise<Object> {
        const userTotalDebt = await this.purchaseService.getUserTotalDebt(request.user.id);
        const userTotalPayed = await this.paymentService.getUserTotalPaid(request.user.id);
        const userUsedCredit = userTotalDebt - userTotalPayed;
        return  {
            userId: request.user.id,
            debt: userUsedCredit
        }
    }
}
