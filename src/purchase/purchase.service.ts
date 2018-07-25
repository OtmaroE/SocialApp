import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Purchase } from './interfaces/purchase.interface';
import { CreatePurchaseDto } from './dto/create-purchase.dto';

@Injectable()
export class PurchaseService {
    constructor(@InjectModel('Purchase') private readonly PurchaseModel: Model<Purchase>) {}

    async create(createPurchaseDto: CreatePurchaseDto, request): Promise<Purchase> {
        const purchaseObject = {
            userId: request.user.id, 
            productId: createPurchaseDto.productId
        }
        const createdPurchase = new this.PurchaseModel();
        return await createdPurchase.save(purchaseObject);
    }

    async findAll(user): Promise<Purchase[]> {
        console.log("Need id: ", user.id);
        return await this.PurchaseModel.find({userId: user.id}).exec();
    }
}