import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { BusinessMemberRole } from "@aura/shared";

/**
 * Resolved membership context attached to the request by BusinessAccessGuard.
 */
export interface BusinessContext {
  businessId: string;
  userId: string;
  role: BusinessMemberRole;
}

/** Property name used to stash the context on the request object. */
export const BUSINESS_CONTEXT_KEY = "businessContext";

/**
 * Extracts the membership context set by BusinessAccessGuard.
 * Only valid on routes protected by BusinessAccessGuard.
 */
export const CurrentBusiness = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): BusinessContext => {
    const request = ctx.switchToHttp().getRequest();
    return request[BUSINESS_CONTEXT_KEY] as BusinessContext;
  },
);
