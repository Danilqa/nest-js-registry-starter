import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../../user/user.enums';
import { Token } from '../entities/token';

@Injectable()
export class RolesGuard implements CanActivate {

    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()]
        );
        if (!requiredRoles) {
            return true;
        }

        const { authorization } = context.switchToHttp().getRequest().headers;
        const { user } = Token.createFromHeader(authorization);
        return requiredRoles.includes(user.role);
    }
}
