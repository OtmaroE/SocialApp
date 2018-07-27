import { Test, TestingModule } from '@nestjs/testing';
import { RoleMappingsService } from './role-mappings.service';

describe('RoleMappingsService', () => {
  let service: RoleMappingsService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoleMappingsService],
    }).compile();
    service = module.get<RoleMappingsService>(RoleMappingsService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
