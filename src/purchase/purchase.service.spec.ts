import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseService } from './purchase.service';
import { Purchase } from './interfaces/purchase.interface';

describe('PurchaseService', () => {
    let service: PurchaseService;
    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PurchaseService],
        }).compile();
        service = module.get<PurchaseService>(PurchaseService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
})