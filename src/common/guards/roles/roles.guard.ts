import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { users } from '../../../database/entities/user.entity';
import { userRoles } from '../../../database/entities/user_roles.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const request = context.switchToHttp().getRequest();
    const user: typeof users.$inferSelect & {
      userRoles: (typeof userRoles.$inferSelect)[];
    } = request.user;

    if (!user) {
      throw new UnauthorizedException('Missing authentication token');
    }

    if (!roles || roles.length === 0) {
      return true;
    }

    const hasRole = roles.some((role) =>
      user.userRoles?.some((userRoles) => userRoles.roleName === role),
    );
    if (!hasRole) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
