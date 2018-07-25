import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { CreatePaymentDto } from './dto/payment.dto';
import { PaymentService } from './payment.service';
import { Payment } from './interfaces/payment.interface';
import { RoleGuard } from '../authentication/auth.guard';
import { Roles } from '../authentication/auth.decorator';
import { create } from 'domain';

@Controller('payment')
@UseGuards(RoleGuard)
export class PaymentController {
    constructor(
        private readonly paymentService: PaymentService
    ) {}

    @Get()
    findAll(){
        return 'Shows all the money you have paid';
    }

    @Post()
    create(){
        return 'Add a payment to the pull and reduces your debt';
    }
}