import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './interfaces/product.interface';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
    constructor(@InjectModel('Product') private readonly productModel: Model<Product>) { }

    async findAll(): Promise<Product[]> {
        return await this.productModel.find().exec();
    }

    async create(createProductDto: CreateProductDto): Promise<Product> {
        const createdProduct = new this.productModel(createProductDto);
        return await createdProduct.save();
    }

    async findOne(id: string): Promise<Product> {
        return await this.productModel.findById(id);
    }

    async deleteById(id: string) {
        await this.productModel.findByIdAndRemove(id);
    }
}
