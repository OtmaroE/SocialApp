import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PurchaseController } from './purchase.controller';
import { PurchaseService } from './purchase.service';
import { PurchaseSchema } from './schemas/purchase.schema';
import { ProductsModule } from '../products/products.module';
import { UsersModule } from '../users/users.module';
import { PaymentModule } from '../payment/payment.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Purchase', schema: PurchaseSchema }]),
        forwardRef(() => ProductsModule),
        UsersModule,
        PaymentModule,
    ],
    controllers: [PurchaseController],
    providers: [PurchaseService],
    exports: [PurchaseService],
})

export class PurchaseModule { }
