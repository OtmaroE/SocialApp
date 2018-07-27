import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoleMapping } from './interfaces/role-mapping.interface';
import { CreateRoleMappingDto } from './dto/create-role-mapping.dto';
import { FindRoleMappingDto } from './dto/find-role-mapping.dto';

@Injectable()
export class RoleMappingsService {
    constructor(@InjectModel('RoleMapping') private readonly roleMappingModel: Model<RoleMapping>) { }

    async create(createRoleMappingDto: CreateRoleMappingDto): Promise<RoleMapping> {
        const createdRoleMapping = new this.roleMappingModel(createRoleMappingDto);
        return createdRoleMapping.save();
    }

    async find(findRoleMappingDto: FindRoleMappingDto): Promise<RoleMapping[]> {
        return this.roleMappingModel.find(findRoleMappingDto);
    }
}
