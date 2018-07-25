import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Purchase } from './interfaces/purchase.interface';
import { CreatePurchaseDto } from './dto/create-purchase.dto';

@Injectable()
export class PurchaseService {
    constructor( @InjectModel('Purchase') private readonly PurchaseModel: Model<Purchase> ) {}

    async create(createPurchaseDto: CreatePurchaseDto, userId): Promise<Purchase> {
        const purchaseObject = new CreatePurchaseDto(userId, String(createPurchaseDto.productId));
        // console.log(purchaseObject);
        console.log(createPurchaseDto);
        const createdPurchase = new this.PurchaseModel(purchaseObject);
        return await createdPurchase.save();
    }

    async findAll(user): Promise<Purchase[]> {
        console.log("Need id: ", user.id);
        return await this.PurchaseModel.find({userId: user.id}).exec();
    }
}