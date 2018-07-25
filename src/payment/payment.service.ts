import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payment } from './interfaces/payment.interface';
import { CreatePaymentDto } from './dto/payment.dto';

@Injectable()
export class PaymentService {
    constructor( @InjectModel('Payment') private readonly PaymentModel: Model<Payment> ) { }

    async findAll() {

    }
}