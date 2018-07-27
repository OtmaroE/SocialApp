import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
    validateCreateUser(req, createUserDto: CreateUserDto): boolean {
        try {
            if (!createUserDto.role) return true;
            const token = req.headers.authorization.split(' ')[1];
            const user = jwt.decode(token);
            return user.roles.includes('admin');
        } catch (err) {
            return false;
        }
    }
}
