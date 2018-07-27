import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import client from '../users/helpers/redis';

const get = (key): Promise<boolean> => new Promise((r, rej) => client.get(key, (err, reply) => { if (err) rej(err); r(reply); }));

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const token = this.reflector.get<string>('token', context.getHandler());
    if (token !== '') return true;
    const request = context.switchToHttp().getRequest();
    const { user } = request;
    return await get(user.uuid);
  }
}