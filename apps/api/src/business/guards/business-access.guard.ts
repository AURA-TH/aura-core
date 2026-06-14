import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { isUUID } from "class-validator";
import { BusinessMemberRole } from "@aura/shared";
import { PrismaService } from "../../prisma/prisma.service";
import { AuthenticatedUser } from "../../auth/strategies/jwt.strategy";
import {
  BUSINESS_CONTEXT_KEY,
  BusinessContext,
} from "../decorators/current-business.decorator";

/**
 * Enforces tenant access. Must run AFTER JwtAuthGuard.
 *
 * - Reads businessId from route params.
 * - Confirms the authenticated user is a non-deleted member of a non-deleted
 *   business.
 * - On success, attaches BusinessContext to the request for downstream use.
 * - On any failure (no membership / deleted / missing business), responds 404
 *   so non-members cannot distinguish "not a member" from "does not exist"
 *   (anti-enumeration).
 */
@Injectable()
export class BusinessAccessGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthenticatedUser | undefined;

    if (!user?.id) {
      // JwtAuthGuard should have run first; fail closed if not.
      throw new UnauthorizedException("Invalid credentials");
    }

    const businessId = request.params?.businessId as string | undefined;
    // Validate format before touching the DB so malformed values return a
    // clean 404 rather than triggering a Prisma/database error or 500.
    if (!businessId || !isUUID(businessId)) {
      throw new NotFoundException("Business not found");
    }

    const membership = await this.prisma.businessMember.findFirst({
      where: {
        businessId,
        userId: user.id,
        deletedAt: null,
        business: { deletedAt: null },
      },
      select: { businessId: true, userId: true, role: true },
    });

    if (!membership) {
      // Could be: business doesn't exist, is deleted, or user isn't a member.
      // All collapse to 404 to avoid revealing business existence.
      throw new NotFoundException("Business not found");
    }

    const businessContext: BusinessContext = {
      businessId: membership.businessId,
      userId: membership.userId,
      role: membership.role as BusinessMemberRole,
    };
    request[BUSINESS_CONTEXT_KEY] = businessContext;

    return true;
  }
}
