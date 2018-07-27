import { Controller, Get, Post, Body, BadRequestException, UseGuards, Req, ConflictException, HttpStatus } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { PurchaseService } from './purchase.service';
import { Purchase } from './interfaces/purchase.interface';
import { RoleGuard } from '../authentication/auth.guard';
import { Roles } from '../authentication/auth.decorator';
import { ProductsService } from '../products/products.service';
import { UserService} from '../users/users.service';
import { PaymentService } from 'payment/payment.service';
import { ApiUseTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ValidateMongoId } from '../pipes/validate-mongoId.pipe';
import { ValidateToken } from '../authentication/validatetoken.decorator';
import { TokenGuard } from '../authentication/validtoken.guard';
import { user } from 'decorators/user.param.decorator';
import { ValidateNumber } from '../pipes/validate-number.pipe';

@Controller('purchases')
@UseGuards(RoleGuard, TokenGuard)
@ApiUseTags('Purchases')
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
    @ApiBearerAuth()
    @ApiResponse( { status: 201, description: 'Purchase was placed.' } )
    @ApiResponse( { status: HttpStatus.BAD_REQUEST, description: 'Bad product id.' } )
    @ApiResponse( { status: HttpStatus.BAD_REQUEST, description: 'Bad request.' } )
    @ApiResponse( { status: HttpStatus.FORBIDDEN, description: 'Forbidden resource.' } )
    async create(
        @Body('productId', new ValidateMongoId()) productId: string,
        @Body('quantity', new ValidateNumber())
        @Req() request,
        @user('id') id) {
            const findProduct = this.productsService.findOne(productId);
            const getUserInfo = this.userService.findById(id);
            const getDebt = this.purchaseService.getUserTotalDebt(id);
            const getPaid = this.paymentService.getUserTotalPaid(id);
            const [product, userInfo, userTotalDebt, userTotalPaid] = await Promise.all([findProduct, getUserInfo, getDebt, getPaid]);
            if (!product) throw new BadRequestException();
            const userUsedCredit = userTotalDebt - userTotalPaid + (product.price);
            if (userInfo.creditLimit <=  userUsedCredit) {
            throw new ConflictException('Credit limit reached');
            }
            const newPurchase = new CreatePurchaseDto(request.user.id, productId);
            return this.purchaseService.create(newPurchase);
    }

    @Get()
    @ValidateToken()
    @Roles('admin')
    @ApiBearerAuth()
    @ApiResponse( { status: 200, description: 'List of purchase was generated.' } )
    @ApiResponse( { status: HttpStatus.FORBIDDEN, description: 'Forbidden resource.' } )
    async findAllDetails(@Req() request): Promise<Purchase[]> {
        return this.purchaseService.findAllDetails(request.user.id);
    }

    @Get('debt')
    @ValidateToken()
    @Roles('admin')
    @ApiBearerAuth()
    @ApiResponse( { status: 200, description: 'Total user debt was calculated.' } )
    @ApiResponse( { status: HttpStatus.FORBIDDEN, description: 'Forbidden resource.' } )
    async getUserTotalDebt(@Req() request): Promise<object> {
        const userTotalDebt = await this.purchaseService.getUserTotalDebt(request.user.id);
        const userTotalPayed = await this.paymentService.getUserTotalPaid(request.user.id);
        const userUsedCredit = userTotalDebt - userTotalPayed;
        return {
            userId: request.user.id,
            debt: userUsedCredit,
        };
    }
}
