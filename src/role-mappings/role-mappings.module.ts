import { Module } from '@nestjs/common';
import { RoleMappingsService } from './role-mappings.service';
import { RolesModule } from '../roles/roles.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleMappingSchema } from './schemas/role-mapping.schema';
import { RoleMappingsController } from './role-mappings.controller';

@Module({
    imports: [RolesModule, MongooseModule.forFeature([{ name: 'RoleMapping', schema: RoleMappingSchema }])],
    providers: [RoleMappingsService],
    exports: [
        RoleMappingsService,
        MongooseModule.forFeature([{ name: 'RoleMapping', schema: RoleMappingSchema }]),
    ],
    controllers: [RoleMappingsController],
})
export class RoleMappingsModule { }
