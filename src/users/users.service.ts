import { Model } from 'mongoose';
import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { UsersDto } from './dto/users.dto';
import { User } from './interface/users.interface';
import { Role } from '../roles/interfaces/role.interface';
import { RoleMapping } from '../role-mappings/interfaces/role-mapping.interface';
import { CreateRoleMappingDto } from '../role-mappings/dto/create-role-mapping.dto';
import { UserInfo } from './interface/user-info.interface';
import { InjectModel } from '@nestjs/mongoose';
import { createJWT } from './helpers/jwt';
import client from './helpers/redis';

@Injectable()
export class UserService {
    constructor(
        @InjectModel('Users') readonly userModel: Model<User>,
        @InjectModel('Role') private readonly roleModel: Model<Role>,
        @InjectModel('RoleMapping') private readonly roleMappingModel: Model<RoleMapping>,
    ) { }

    login(user: UsersDto): Promise<object> {
        return this.userModel.findOne({ username: user.username }).exec().then(async (userFound) => {
            if (!userFound || !userFound.comparePass(user.password)) throw new UnauthorizedException('Invalid credentials');
            const userRoles = await this.roleMappingModel.find({ userId: user._id }).populate('roleId', '-_id name').exec();
            const parsedRoles = userRoles.map(role => {
                return role.roleId.name;
            });
            return { token: createJWT(userFound, parsedRoles) };
        });
    }
    async findById(_id: string): Promise<UserInfo> {
        return await this.userModel.findOne({ _id }).select('username creditLimit').exec();
    }

    signup(user: UsersDto): Promise<User> {
        return this.userModel.create({ username: user.username, password: this.userModel.hashPassword(user.password) })
            .then(async userCreated => {
                const role = await this.roleModel.findOne({ name: user.role || 'user' });
                if (!role) throw new NotFoundException('Role does not exist');
                const createRoleMappingDto = new CreateRoleMappingDto(user._id, role._id);
                const createdRoleMapping = new this.roleMappingModel(createRoleMappingDto);
                const roleMapping = await createdRoleMapping.save();
                const userToReturn = { id: userCreated._id, username: userCreated.username, limit: userCreated.creditLimit };
                return userToReturn;
            });
    }
    async updateCreditLimit(creditLimit: number): Promise<object> {
        const result = await this.userModel.update({}, { $set: { creditLimit } }, { multi: true }).exec();
        if (result.ok === 1) return { message: `Updated ${result.n} users` };
        else return null;
    }
    async updateOneUserCreditLimit(_id: string, creditLimit: number): Promise<object> {
        if (!await this.userModel.findOne({ _id }).exec()) throw new NotFoundException('UserId not found');
        const result = await this.userModel.update({ _id }, { $set: { creditLimit } }, { new: true }).exec();
        if (result.ok === 1) return { message: `Updated credit limit for this user` };
        else return null;
    }
    async logout(uuid: string): Promise<boolean> {
        return client.del(uuid, (err, response) => {
            return response === 1;
        });
    }
}
