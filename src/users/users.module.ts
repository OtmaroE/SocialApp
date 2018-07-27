import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UserService } from './users.service';
import { UserSchema } from './schemas/users.schema';
import { RoleMappingsModule } from 'role-mappings/role-mappings.module';
import { RolesModule } from 'roles/roles.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Users', schema: UserSchema }]),
        RoleMappingsModule,
        RolesModule,
    ],
    controllers: [UsersController],
    providers: [UserService],
    exports: [UserService],
})

export class UsersModule { }
