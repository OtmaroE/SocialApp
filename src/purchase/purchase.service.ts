import { Model } from 'mongoose';
import { Injectable, createParamDecorator } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Purchase } from './interfaces/purchase.interface';
import { CreatePurchaseDto } from './dto/create-purchase.dto';

@Injectable()
export class PurchaseService {
    constructor(@InjectModel('Purchase') private readonly PurchaseModel: Model<Purchase>) {}

    async create(createPurchaseDto: CreatePurchaseDto): Promise<Purchase> {
        const createdPurchase = new this.PurchaseModel(createPurchaseDto);
        return await createdPurchase.save();
    }

    async findAll(): Promise<Purchase[]> {
        return await this.PurchaseModel.find().exec();
    }
}