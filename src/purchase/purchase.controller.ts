import { Controller, Get, Post, Body, BadRequestException, UseGuards, Req, ConflictException } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { PurchaseService } from './purchase.service';
import { Purchase } from './interfaces/purchase.interface';
import { RoleGuard } from '../authentication/auth.guard';
import { Roles } from '../authentication/auth.decorator';
import { ProductsService } from '../products/products.service';
import { UserService} from '../users/users.service';
import { PaymentService } from 'payment/payment.service';
import { ValidateMongoId } from '../pipes/validate-mongoId.pipe';
import { ValidateToken } from '../authentication/validatetoken.decorator';
import { TokenGuard } from '../authentication/validtoken.guard';

@Controller('purchases')
@UseGuards(RoleGuard, TokenGuard)
export class PurchaseController {
    constructor(
        private readonly purchaseService: PurchaseService,
        private readonly productsService: ProductsService,
        private readonly userService: UserService,
        private readonly paymentService: PaymentService,
    ) {}

    @Post()
    @ValidateToken()
    @Roles('admin')
    async create(@Body('productId', new ValidateMongoId()) productId: string, @Req() request) {
        const { user: { id }} = request;
        const findProduct = this.productsService.findOne(productId);
        const getUserInfo = this.userService.findById(id);
        const getDebt = this.purchaseService.getUserTotalDebt(id);
        const getPaid = this.paymentService.getUserTotalPaid(id);
        const [product, userInfo, userTotalDebt, userTotalPaid] = await Promise.all([findProduct, getUserInfo, getDebt, getPaid]);
        if (!product) throw new BadRequestException();
        const userUsedCredit = userTotalDebt - userTotalPaid + product.price;
        if (userInfo.creditLimit <=  userUsedCredit) {
           throw new ConflictException('Credit limit reached');
        }
        const newPurchase = new CreatePurchaseDto(request.user.id, productId);
        return this.purchaseService.create(newPurchase);
    }

    @Get()
    @ValidateToken()
    @Roles('admin')
    async findAllDetails(@Req() request): Promise<Purchase[]> {
        return this.purchaseService.findAllDetails(request.user.id);
    }

    @Get('debt')
    @ValidateToken()
    @Roles('admin')
    async getUserTotalDebt(@Req() request): Promise<object> {
        const userTotalDebt = await this.purchaseService.getUserTotalDebt(request.user.id);
        const userTotalPayed = await this.paymentService.getUserTotalPaid(request.user.id);
        const userUsedCredit = userTotalDebt - userTotalPayed;
        return  {
            userId: request.user.id,
            debt: userUsedCredit,
        };
    }
}
