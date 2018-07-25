import { Model } from 'mongoose';
import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { UsersDto } from './dto/users.dto';
import { User } from './interface/users.interface';
import { UserInfo } from './interface/user-info.interface';
import { InjectModel } from '@nestjs/mongoose';
import { createJWT } from './helpers/jwt';

@Injectable()
export class UserService {
  constructor(@InjectModel('Users') readonly userModel: Model<User>) {}
  login(user: UsersDto): Promise<object> {
    return this.userModel.findOne({ username: user.username }).exec().then((userFound) => {
      if (!userFound || !userFound.comparePass(user.password)) throw new UnauthorizedException('Invalid credentials');
      return { token: createJWT(userFound) };
    });
  }
  async findById(_id: string): Promise<UserInfo> {
    return await this.userModel.findOne({ _id }).select('username creditLimit').exec();
  }

  signup(user: UsersDto): Promise<User> {
    return this.userModel.create({ username: user.username, password: this.userModel.hashPassword(user.password)})
      .then(userCreated => {
        const userToReturn = { id: userCreated._id, username: userCreated.username, limit: userCreated.creditLimit };
        return userToReturn;
      });
  }
  async updateCreditLimit(creditLimit: number): Promise<object> {
    const result = await this.userModel.update({}, { $set: { creditLimit }}, {multi: true}).exec();
    if (result.ok === 1) return { message: `Updated ${result.n} users`};
    else return null;
  }
  async updateOneUserCreditLimit(_id: string, creditLimit: number): Promise<object> {
    if (!await this.userModel.findOne({ _id }).exec()) throw new NotFoundException('UserId not found');
    const result = await this.userModel.update({ _id }, { $set: { creditLimit }}, { new: true }).exec();
    if (result.ok === 1) return { message: `Updated credit limit for this user`};
    else return null;
  }
}