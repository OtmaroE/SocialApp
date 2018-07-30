import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payment } from './interfaces/payment.interface';
import { CreatePaymentDto } from './dto/payment.dto';

@Injectable()
export class PaymentService {
    constructor(
        @InjectModel('Payment') private readonly PaymentModel: Model<Payment>,
    ) { }

    async findAll(userId): Promise<Payment> {
        return await this.PaymentModel
        .aggregate()
        .match({ userId })
        .group({ _id: '$userId', totalPaid: { $sum: '$amountPaid'}})
        .project({ _id: 0, Userid: '$_id', totalPaid: '$totalPaid'})
        .exec();
    }
    async findAllDetails(userId): Promise<Payment> {
        return await this.PaymentModel.find({ userId });
    }
    async pay(createPaymentDto: CreatePaymentDto): Promise<Payment> {
        return await this.PaymentModel.create(createPaymentDto);
    }

    async getUserTotalPaid(userId): Promise<number> {
        const TotalPaymentReport = await this.findAll(userId);
        if (!TotalPaymentReport[0]) {
            return 0;
        }
        return TotalPaymentReport[0].totalPaid || 0;
    }

}