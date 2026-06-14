import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { BusinessMemberRole } from "@aura/shared";
import { ROLES_KEY } from "../decorators/roles.decorator";
import {
  BUSINESS_CONTEXT_KEY,
  BusinessContext,
} from "../decorators/current-business.decorator";

/**
 * Enforces business role requirements. Must run AFTER BusinessAccessGuard
 * (which populates the membership context).
 *
 * - If no @Roles metadata is present, this guard passes (membership alone
 *   is sufficient).
 * - Fails closed: if the membership context is missing, deny.
 * - Returns 403 if the member's role is not in the allowed set (the caller IS
 *   a member, just under-privileged — so revealing this is acceptable).
 */
@Injectable()
export class BusinessRolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<
      BusinessMemberRole[] | undefined
    >(ROLES_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // no role restriction declared
    }

    const request = context.switchToHttp().getRequest();
    const businessContext = request[BUSINESS_CONTEXT_KEY] as
      | BusinessContext
      | undefined;

    // Fail closed: role checks require the access guard to have run.
    if (!businessContext) {
      throw new ForbiddenException("Insufficient permissions");
    }

    if (!requiredRoles.includes(businessContext.role)) {
      throw new ForbiddenException("Insufficient permissions");
    }

    return true;
  }
}
