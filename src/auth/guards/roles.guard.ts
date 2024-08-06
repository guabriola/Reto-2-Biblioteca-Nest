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
    const user = req.user;
    const userId = user.userId;
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    console.dir(req.headers.authorization, { depth: null });
    if (user.roles.includes('ADMIN')) {
      return true;
    }

    if (user.id === parseInt(userId, 10)) {
      return true;
    }

    throw new ForbiddenException('A user can only be updated by user it self or by ADMIN user.');
  }
}