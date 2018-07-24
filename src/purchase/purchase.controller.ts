import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { PurchaseService } from './purchase.service';
import { Purchase } from './interfaces/purchase.interface';

@Controller('purchase')
export class PurchaseController {
    constructor(private readonly purchaseService: PurchaseService) {}

    @Post()
    async create(@Body() createPurchaseDto: CreatePurchaseDto){
        this.purchaseService.create(createPurchaseDto);
    }

    @Get()
    async findAll(): Promise<Purchase[]> {
        return this.purchaseService.findAll();
    }
}