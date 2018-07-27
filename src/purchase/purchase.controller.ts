import { Controller, Get, Post, Body, BadRequestException, UseGuards, HttpCode ,Req, HttpException, HttpStatus } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { PurchaseService } from './purchase.service';
import { Purchase } from './interfaces/purchase.interface';
import { RoleGuard } from '../authentication/auth.guard';
import { Roles } from '../authentication/auth.decorator';
import { ProductsService } from '../products/products.service';
import { UserService} from '../users/users.service';
import { PaymentService } from 'payment/payment.service';
import { ApiUseTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@Controller('purchases')
@ApiUseTags('Purchases')
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
    @ApiBearerAuth()
    @ApiResponse( { status: 201, description: 'Purchase was placed.' } )
    @ApiResponse( { status: HttpStatus.BAD_REQUEST, description: 'Bad product id.' } )
    @ApiResponse( { status: HttpStatus.BAD_REQUEST, description: 'Bad request.' } )
    @ApiResponse( { status: HttpStatus.FORBIDDEN, description: 'Forbidden resource.' } )
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
    @ApiBearerAuth()
    @ApiResponse( { status: 200, description: 'List of purchase was generated.' } )
    @ApiResponse( { status: HttpStatus.FORBIDDEN, description: 'Forbidden resource.' } )
    async findAllDetails(@Req() request): Promise<Purchase[]> {
        return this.purchaseService.findAllDetails(request.user.id);
    }

    @Get('debt')
    @Roles('admin')
    @ApiBearerAuth()
    @ApiResponse( { status: 200, description: 'Total user debt was calculated.'} )
    @ApiResponse( { status: HttpStatus.FORBIDDEN, description: 'Forbidden resource.' } )
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
