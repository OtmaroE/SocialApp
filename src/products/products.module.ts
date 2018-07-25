import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PurchaseModule } from '../purchase/purchase.module';
import { ProductSchema } from './schemas/product.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]), PurchaseModule],
    controllers: [ProductsController],
    providers: [ProductsService],
})
export class ProductsModule { }
