import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions && !requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    if (!user) return false;

    const passesPermissions =
      !requiredPermissions ||
      requiredPermissions.every((perm) => user.permissions?.includes(perm));

    const passesRoles =
      !requiredRoles || requiredRoles.some((role) => user.role === role);

    return passesPermissions && passesRoles;
  }
}
