import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PurchaseController } from './purchase.controller';
import { PurchaseService } from './purchase.service';
import { PurchaseSchema } from './Schemas/purchase.schema';

@Module({
    imports: [MongooseModule.forFeature([{name: 'purchase', schema: PurchaseSchema}])],
    controllers: [PurchaseController],
    providers: [PurchaseService],
})

export class PurchaseModule {}