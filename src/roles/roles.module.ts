import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleSchema } from './schemas/role.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Role', schema: RoleSchema }])],
    controllers: [RolesController],
    providers: [RolesService],
    exports: [
        RolesService,
        MongooseModule.forFeature([{ name: 'Role', schema: RoleSchema }]),
    ],
})
export class RolesModule { }
