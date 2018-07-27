import { Controller, Get, Post, Body, UseGuards, Req, HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { CreatePaymentDto } from './dto/payment.dto';
import { PaymentService } from './payment.service';
import { RoleGuard } from '../authentication/auth.guard';
import { Roles } from '../authentication/auth.decorator';
import { ApiUseTags, ApiBearerAuth, ApiResponse, ApiImplicitBody, ApiConsumes, ApiImplicitParam } from '@nestjs/swagger';
import { ValidateNumber } from 'pipes/validate-number.pipe';

@Controller('payments')
@UseGuards(RoleGuard)
@ApiUseTags('Payments')
export class PaymentController {
    constructor(
        private readonly paymentService: PaymentService
    ) {}

    @Get('total')
    @Roles('admin')
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Payment list generated.' })
    findAll(@Req() request){
       return this.paymentService.findAll(request.user.id);
    }

    @Get()
    @Roles('admin')
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Payment list generatd.' })
    async findAllDetails(@Req() request) {
        return this.paymentService.findAllDetails(request.user.id);
    }
    
    @Post()
    @Roles('admin')
    @ApiBearerAuth()
    @ApiImplicitBody({ name: 'pay', description: 'Amount to be paid ', type: Number })
    @ApiResponse( { status: 201, description: 'Payment was received.' } )
    async create(@Body('pay', new ValidateNumber()) pay: number, @Req() request){
        const userId = request.user.id;
        if(!pay){
            throw new HttpException('Bad pay value', HttpStatus.BAD_REQUEST);
        }
        const createPaymentDto = new CreatePaymentDto(userId, pay);
        return await this.paymentService.pay(createPaymentDto);
    }
}