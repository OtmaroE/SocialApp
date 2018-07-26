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
        let payment = await this.PaymentModel.create(createPaymentDto);
        return payment;
    }

    async getUserTotalPaid(userId): Promise<number> {
        const TotalPaymentReport = await this.findAll(userId);
        return TotalPaymentReport[0].amountPaid;
    }
    
}