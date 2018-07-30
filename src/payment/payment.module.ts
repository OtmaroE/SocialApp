import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PaymentSchema } from './schemas/payment.schema';
import { PurchaseModule } from 'purchase/purchase.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Payment', schema: PaymentSchema}]),
        forwardRef(() => PurchaseModule),
    ],
    controllers: [PaymentController],
    providers: [PaymentService],
    exports: [PaymentService],
})

export class PaymentModule { }