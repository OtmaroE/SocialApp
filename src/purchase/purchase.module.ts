import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PurchaseController } from './purchase.controller';
import { PurchaseService } from './purchase.service';
import { PurchaseSchema } from './schemas/purchase.schema';
import { ProductsModule } from '../products/products.module';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Purchase', schema: PurchaseSchema }]), ProductsModule],
    controllers: [PurchaseController],
    providers: [PurchaseService],
    exports: [PurchaseService],
})

export class PurchaseModule { }
