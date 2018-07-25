import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Purchase } from './interfaces/purchase.interface';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { Product } from 'products/interfaces/product.interface';

@Injectable()
export class PurchaseService {
    constructor( @InjectModel('Purchase') private readonly PurchaseModel: Model<Purchase> ) {}

    async create(createPurchaseDto: CreatePurchaseDto, userId, product: Product): Promise<Purchase> {
        const purchaseObject = new CreatePurchaseDto(userId, String(createPurchaseDto.productId), product.name, product.price);
        const createdPurchase = new this.PurchaseModel(purchaseObject);
        return await createdPurchase.save();
    }

    async findAllDetails(user): Promise<Purchase[]> {
        return await this.PurchaseModel
        .aggregate()
        .match({ userId: user.id })
        .group({ _id: '$productName', pricePaid: { $sum: 1 }, total: { $sum: '$pricePaid' }, created: { $max: '$created' } })
        .project({ _id: 0, Product: '$_id', lasPurchase: '$created', items: '$pricePaid', total: '$total' })
        .exec();
    }

    async findAll(user): Promise<Purchase[]> {
        return await this.PurchaseModel
        .aggregate()
        .match({ userId: user.id })
        .group({ _id: '$userId', totalOwed: { $sum: '$pricePaid' } })
        .exec();
    }
}