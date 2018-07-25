import { Model } from 'mongoose';
import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { UsersDto } from './dto/users.dto';
import { User } from './interface/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { createJWT } from './helpers/jwt';

@Injectable()
export class UserService {
  constructor(@InjectModel('Users') readonly userModel: Model<User>) {}
  login(user: UsersDto): Promise<User> {
    return this.userModel.findOne({ username: user.username }).exec().then((userFound) => {
      if (!userFound || !userFound.comparePass(user.password)) throw new UnauthorizedException('Invalid credentials');
      return { token: createJWT(userFound) };
    });
  }
  async signup(user: UsersDto): Promise<User> {
    return await this.userModel.create({ username: user.username, password: this.userModel.hashPassword(user.password)});
  }
  async updateCreditLimit(creditLimit: number) {
    const result = await this.userModel.update({}, { $set: { creditLimit }}, {multi: true}).exec();
    if (result.ok === 1) return { message: `Updated ${result.n} users`};
    else return null;
  }
  async updateOneUserCreditLimit(_id: string, creditLimit: number) {
    if (!await this.userModel.findOne({ _id }).exec()) throw new NotFoundException('UserId not found');
    const result = await this.userModel.update({ _id }, { $set: { creditLimit }}, { new: true }).exec();
    if (result.ok === 1) return { message: `Updated credit limit for this user`};
    else return null;
  }
}