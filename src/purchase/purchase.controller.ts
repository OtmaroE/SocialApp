import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { PurchaseService } from './purchase.service';
import { Purchase } from './interfaces/purchase.interface';
import { RoleGuard } from '../authentication/auth.guard';
import { Roles } from '../authentication/auth.decorator';
import { request } from 'https';

@Controller('purchase')
@UseGuards(RoleGuard)
export class PurchaseController {
    constructor(private readonly purchaseService: PurchaseService) {}

    @Post()
    @Roles('admin')
    create(@Body() createPurchaseDto: CreatePurchaseDto, @Req() request){
        return this.purchaseService.create(createPurchaseDto, request);
    }

    @Get()
    @Roles('admin')
    async findAll(@Req() request): Promise<Purchase[]> {
        return this.purchaseService.findAll(request.user);
    }

}