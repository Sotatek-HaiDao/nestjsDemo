import { ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { constants } from '../constants/constant';

@Injectable()
export class UserGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  handleRequest(err, user, info: Error, context: ExecutionContext) {
    const metaDataLoginType = this.reflector.getAllAndOverride<string>('login_type_allow_access', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (metaDataLoginType == constants.ALLOW_ACCESS_ANY || user.loginType == metaDataLoginType) {
      return user;
    }

    throw new ForbiddenException();
  }
}