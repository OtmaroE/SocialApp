import { Model } from 'mongoose';
import { Injectable, UnauthorizedException, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { UsersDto } from './dto/users.dto';
import { User } from './interface/users.interface';
import { Role } from '../roles/interfaces/role.interface';
import { RoleMapping } from '../role-mappings/interfaces/role-mapping.interface';
import { CreateRoleMappingDto } from '../role-mappings/dto/create-role-mapping.dto';
import { UserInfo } from './interface/user-info.interface';
import { InjectModel } from '@nestjs/mongoose';
import { createJWT, validateJWT, createRefreshToken } from './helpers/jwt';
import client from './helpers/redis';
import { CreateUser } from './dto/create-user.dto';
import { Validator } from 'class-validator';
const validate = new Validator();

@Injectable()
export class UserService {
    constructor(
        @InjectModel('Users') readonly userModel: Model<User>,
        @InjectModel('Role') private readonly roleModel: Model<Role>,
        @InjectModel('RoleMapping') private readonly roleMappingModel: Model<RoleMapping>,
    ) { }

    async login(auth_type: string, refresh_token: string, user: UsersDto): object | Promise<object> {
        const query: any = {};
        if (auth_type === 'refresh' && refresh_token !== '') {
            const decoded: any = validateJWT(refresh_token);
            query._id = decoded.id;
        } else {
            query.username = user.username;
        }
        console.log(query, auth_type);
        return this.userModel.findOne(query).exec().then(async (userFound) => {
            if (!userFound) throw new UnauthorizedException('Invalid credentials');
            if (auth_type === 'password' && !userFound.comparePass(user.password)) throw new UnauthorizedException('Invalid credentials');
            const userRoles = await this.roleMappingModel.find({ userId: userFound._id }).populate('roleId', '-_id name').exec();
            const parsedRoles = userRoles.map(role => {
                return role.roleId.name;
            });
            return {
                token: createJWT(userFound, parsedRoles),
                refresh_token: createRefreshToken(userFound._id),
            };
        });
    }
    async findById(userId: string): Promise<UserInfo> {
        const query: any = {};
        if (validate.isMongoId(userId)) query._id = userId;
        else query.slackId = userId;
        return await this.userModel.findOne(query).select('username creditLimit slackId').exec();
    }

    async getCreditLimit(who: string): Promise<object> {
        const match: any = {};
        (who !== 'global') ? match.slackId = who : {};
        return await this.userModel
            .aggregate()
            .match(match)
            .group({ _id: 0, creditAvg: { $avg: '$creditLimit' }})
            .exec();
    }

    signup(user: CreateUser): Promise<User> {
        return this.userModel.create({ username: user.username, password: user.password })
            .then(async userCreated => {
                const role = await this.roleModel.findOne({ name: user.role });
                if (!role) throw new NotFoundException('Role does not exist');
                const createRoleMappingDto = new CreateRoleMappingDto(userCreated._id, role._id);
                const createdRoleMapping = new this.roleMappingModel(createRoleMappingDto);
                await createdRoleMapping.save();
                const userToReturn = { id: userCreated._id, username: userCreated.username, limit: userCreated.creditLimit };
                return userToReturn;
            })
            .catch(err => {
              if (err.code === 11000) throw new ConflictException('User already exists');
              throw new InternalServerErrorException(err.message);
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
