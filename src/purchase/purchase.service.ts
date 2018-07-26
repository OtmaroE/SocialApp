import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Purchase } from './interfaces/purchase.interface';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class PurchaseService {
    constructor( 
        @InjectModel('Purchase') private readonly PurchaseModel: Model<Purchase>,
        private readonly productsService: ProductsService,
    ) {}

    async create(createPurchaseDto: CreatePurchaseDto): Promise<Purchase> {
        const productId = String(createPurchaseDto.productId)
        const productInfo = await this.productsService.findOne(productId);
        const userId = String(createPurchaseDto.userId);
        const newPurchaseDto = new CreatePurchaseDto(userId, productId, productInfo.name, productInfo.price);
        const createdPurchase = new this.PurchaseModel(newPurchaseDto);
        return await createdPurchase.save();
    }

    async findAllDetails(userId: string): Promise<Purchase[]> {
        return await this.PurchaseModel
        .aggregate()
        .match({ userId })
        .group({ _id: '$productName', pricePaid: { $sum: 1 }, total: { $sum: '$pricePaid' }, created: { $max: '$created' } })
        .project({ _id: 0, Product: '$_id', lasPurchase: '$created', items: '$pricePaid', total: '$total' })
        .exec();
    }

    async findAll(userId: string): Promise<Purchase[]> {
        return await this.PurchaseModel
        .aggregate()
        .match({ userId })
        .group({ _id: '$userId', totalOwed: { $sum: '$pricePaid' } })
        .exec();
    }

    async getUserTotalDebt(userId: string): Promise<number> {
        const totalOwedReport = await this.PurchaseModel
        .aggregate()
        .match({ userId })
        .group({ _id: '$userId', totalOwed: { $sum: '$pricePaid'}})
        .exec();
        if(!totalOwedReport[0]){
            return 0
        }
        return totalOwedReport[0].totalOwed | 0;
    }
}