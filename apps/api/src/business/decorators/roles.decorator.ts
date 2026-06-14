import { SetMetadata } from "@nestjs/common";
import { BusinessMemberRole } from "@aura/shared";

export const ROLES_KEY = "businessRoles";

/**
 * Marks a handler with the set of business roles allowed to invoke it.
 * Enforced by BusinessRolesGuard (which must run after BusinessAccessGuard).
 *
 * Example: @Roles(BusinessMemberRole.OWNER, BusinessMemberRole.ADMIN)
 */
export const Roles = (...roles: BusinessMemberRole[]) =>
  SetMetadata(ROLES_KEY, roles);
