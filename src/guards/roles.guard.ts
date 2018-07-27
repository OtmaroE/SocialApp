import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    canActivate(
        context: ExecutionContext,
    ): Promise<boolean> | boolean {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!roles)
            return true;
        const request = context.switchToHttp().getRequest();
        if (!request.headers.authorization)
            return false;
        const token = request.headers.authorization.split(' ')[1];
        try {
            const user = jwt.verify(token, process.env.SECRET);
            return roles.some(role => user.roles.includes(role));
        }
        catch (err) {
            return false;
        }
    }
}
