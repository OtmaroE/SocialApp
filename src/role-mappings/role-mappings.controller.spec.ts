import { Test, TestingModule } from '@nestjs/testing';
import { RoleMappingsController } from './role-mappings.controller';

describe('RoleMappings Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [RoleMappingsController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: RoleMappingsController = module.get<RoleMappingsController>(RoleMappingsController);
    expect(controller).toBeDefined();
  });
});
