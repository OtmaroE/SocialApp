import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from './interfaces/role.interface';

@Injectable()
export class RolesService {
    constructor(@InjectModel('Role') private readonly roleModel: Model<Role>) { }

    async create(createRoleDto: CreateRoleDto): Promise<Role> {
        const createdRole = new this.roleModel(createRoleDto);
        return await createdRole.save();
    }

    async findAll(): Promise<Role[]> {
        return await this.roleModel.find().exec();
    }

    async findByName(name: string): Promise<Role> {
        return await this.roleModel.findOne({ name }).exec();
    }
}
