import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();

    return requiredRoles.some((role) => user.roles.includes(role));

  }
}

@Injectable()
export class SelfOrAdminGuard implements CanActivate {
  //Guard Checks if is the user or Admin to authorize the oporation.
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    //Data of authenticated user
    const authUser = req.user;
    //UserId provided by the user as URL param. Eg. http://localhost:3000/api-lib/v1/users/3
    const paramsUserId = req.params.userId;

    if (authUser.roles.includes('ADMIN')) {
      return true;
    }

    if (authUser.userId === parseInt(paramsUserId, 10)) {
      return true;
    }

    throw new ForbiddenException('FORBIDDEN - Only user it self or ADMIN are authorized.');
  }
}