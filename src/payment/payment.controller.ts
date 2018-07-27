import { Controller, Get, Post, Body, UseGuards, Req, HttpException, HttpStatus } from '@nestjs/common';
import { CreatePaymentDto } from './dto/payment.dto';
import { PaymentService } from './payment.service';
import { Payment } from './interfaces/payment.interface';
import { RoleGuard } from '../authentication/auth.guard';
import { Roles } from '../authentication/auth.decorator';
import { create } from 'domain';

@Controller('payments')
@UseGuards(RoleGuard)
export class PaymentController {
    constructor(
        private readonly paymentService: PaymentService
    ) {}

    @Get('total')
    @Roles('admin')
    findAll(@Req() request){
       return this.paymentService.findAll(request.user.id);
    }

    @Get()
    @Roles('admin')
    async findAllDetails(@Req() request) {
        return this.paymentService.findAllDetails(request.user.id);
    }
    
    @Post()
    @Roles('admin')
    async create(@Body() jsonBody, @Req() request){
        const userId = request.user.id;
        const amountPaid = jsonBody.pay;
        if(!amountPaid){
            throw new HttpException('Bad pay value', HttpStatus.BAD_REQUEST);
        }
        const createPaymentDto = new CreatePaymentDto(userId, amountPaid);
        return await this.paymentService.pay(createPaymentDto);
    }
}