import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { validateJWT } from '../users/helpers/jwt';

@Injectable()
export class AttachUser implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    req.user = {};
    if (!req.headers.authorization || req.headers.authorization === null) return true;
    const valid: any = validateJWT(req.headers.authorization);
    if (valid.id) req.user = valid;
    return true;
  }
}