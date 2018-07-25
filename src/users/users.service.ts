import { Model } from 'mongoose';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersDto } from './dto/users.dto';
import { User } from './interface/users.interface';
import { InjectModel } from '../../node_modules/@nestjs/mongoose';
import { createJWT } from './helpers/jwt';

@Injectable()
export class UserService {
  constructor(@InjectModel('Users') private readonly userModel: Model<User>) {}
  login(user: UsersDto): Promise<User> {
    return this.userModel.findOne({ username: user.username }).exec().then((userFound) => {
      if (!userFound || !userFound.comparePass(user.password)) throw new UnauthorizedException('Invalid credentials');
      return { token: createJWT(userFound) };
    });
  }
  async signup(user: UsersDto): Promise<User> {
    return await this.userModel.create({ username: user.username, password: this.userModel.hashPassword(user.password)});
  }
}