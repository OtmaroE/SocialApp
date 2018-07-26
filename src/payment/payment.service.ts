import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payment } from './interfaces/payment.interface';
import { CreatePaymentDto } from './dto/payment.dto';
import { PurchaseService } from 'purchase/purchase.service';

@Injectable()
export class PaymentService {
    constructor( 
        @InjectModel('Payment') private readonly PaymentModel: Model<Payment>,
        private readonly purchaseService: PurchaseService,
    ) { }

    async findAll(userId): Promise<Payment> {
        return await this.PaymentModel
        .aggregate()
        .match({ userId })
        .group({ _id: '$userId', totalPaid: { $sum: '$amountPayed'}})
        .project({ _id: 0, Userid: '$_id', totalPaid: '$totalPaid'})
        .exec()
    }
    async findAllDetails(userId): Promise<Payment> {
        return await this.PaymentModel.find({ userId });
    }
    async pay(createPaymentDto: CreatePaymentDto): Promise<Payment> {
        console.log('Userid: ', createPaymentDto.userId);
        // add payment to the payment table
        let payment = await this.PaymentModel.create(createPaymentDto);
        // Query all the money they have paid
        // Quey al the money the owe
        // Return a successfull payment + amount left to pay
        return payment;
    }
    
}