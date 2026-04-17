import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Kiểm tra quyền ưu tiên: Permissions (Quyền hạn cụ thể)
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 2. Kiểm tra quyền cũ: Roles (Vai trò)
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Nếu không yêu cầu bất kỳ quyền/vai trò nào, cho phép truy cập
    if (!requiredPermissions && !requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    if (!user) return false;

    // Ưu tiên kiểm tra Permission nếu có yêu cầu
    if (requiredPermissions) {
      const hasPermission = requiredPermissions.every((perm) =>
        user.permissions?.includes(perm),
      );
      if (hasPermission) return true;
    }

    // Sau đó kiểm tra Role nếu có yêu cầu hoặc nếu Permission check thất bại
    if (requiredRoles) {
      return requiredRoles.some((role) => user.role === role);
    }

    return false;
  }
}