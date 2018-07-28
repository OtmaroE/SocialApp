import { Model } from 'mongoose';
import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Purchase } from './interfaces/purchase.interface';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { ProductsService } from '../products/products.service';
import { PaymentService } from '../payment/payment.service';
import { UserService } from '../users/users.service';

@Injectable()
export class PurchaseService {
    constructor(
        @InjectModel('Purchase') private readonly PurchaseModel: Model<Purchase>,
        private readonly paymentService: PaymentService,
        private readonly userService: UserService,
        private readonly productsService: ProductsService,
    ) { }

    async create({productId, userId, quantity = 1}: CreatePurchaseDto): Promise<Purchase> {
        const findProduct = this.productsService.findOne(productId);
        const getUserInfo = this.userService.findById(userId);
        const getDebt = this.getUserTotalDebt(userId);
        const getPaid = this.paymentService.getUserTotalPaid(userId);
        const [product, userInfo, userTotalDebt, userTotalPaid] = await Promise.all([findProduct, getUserInfo, getDebt, getPaid]);
        if (!product) throw new BadRequestException();
        const userUsedCredit = userTotalDebt - userTotalPaid + (product.price * quantity);
        if (userInfo.creditLimit <=  userUsedCredit) {
            throw new ConflictException('Credit limit reached');
        }
        const newPurchase = new CreatePurchaseDto(userId, productId, quantity, product.name, quantity * product.price);
        const createdPurchase = new this.PurchaseModel(newPurchase);
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
            .group({ _id: '$userId', totalOwed: { $sum: '$pricePaid' } })
            .exec();
        if (!totalOwedReport[0]) {
            return 0;
        }
        return totalOwedReport[0].totalOwed || 0;
    }
}
