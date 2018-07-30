import { Model } from 'mongoose';
import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Purchase } from './interfaces/purchase.interface';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { ProductsService } from '../products/products.service';
import { PaymentService } from '../payment/payment.service';
import { UserService } from '../users/users.service';
import { PurchaseListDto } from './dto/list-purchase.dto';
import { privateEncrypt } from 'crypto';

@Injectable()
export class PurchaseService {
    constructor(
        @InjectModel('Purchase') private readonly PurchaseModel: Model<Purchase>,
        private readonly paymentService: PaymentService,
        private readonly userService: UserService,
        private readonly productsService: ProductsService,
    ) { }

    async create(productList: PurchaseListDto, id): Promise<Purchase | PurchaseListDto> {
        let List = Array.from(productList);
        if (List.length > 1) {
            List = List.reduce((prev, curr) => {
                const dupIndex = prev.findIndex((el) => curr.productId === el.productId);
                if (dupIndex === -1) prev.push(curr);
                else prev[dupIndex].quantity += curr.quantity;
                return prev;
            }, []);
        }
        const bulkSave = [];
        let total = 0;
        const getUserInfo = this.userService.findById(id);
        const getDebt = this.getUserTotalDebt(id);
        const getPaid = this.paymentService.getUserTotalPaid(id);
        const [userInfo, userTotalDebt, userTotalPaid] = await Promise.all([getUserInfo, getDebt, getPaid]);
        for (const purchase of List) {
            const product = await this.productsService.findOne(purchase.productId);
            if (!product) throw new BadRequestException();
            total += (product.price * purchase.quantity);
            bulkSave.push(new CreatePurchaseDto(id, product._id, purchase.quantity, product.name, purchase.quantity * product.price));
        }
        const userUsedCredit = userTotalDebt - userTotalPaid + (total);
        if (userInfo.creditLimit <=  userUsedCredit) {
            throw new ConflictException('Cant do this transaction');
        }
        return await this.PurchaseModel.insertMany(bulkSave);
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
