import { Injectable, Logger } from "@nestjs/common";
import { ActorType } from "@aura/shared";
import { PrismaService } from "../prisma/prisma.service";

/**
 * Skeleton for writing AuditLog entries.
 *
 * INTENTIONALLY DEFERRED (DEV-003): no audit logs are written for auth yet.
 * The AuditLog model requires `businessId`, but auth is user-identity scoped
 * and has no business context. Audit logging will be wired up once
 * business-scoped actions exist (e.g. when BusinessMember scoping lands).
 *
 * The method signature is defined now so later sprints have a stable seam.
 */
export interface WriteAuditLogInput {
  businessId: string;
  actorType: ActorType;
  actorId?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Persist an audit log entry. Requires a businessId, so this is not called
   * from auth flows yet. Implementation will be completed in a later sprint.
   */
  async writeLog(input: WriteAuditLogInput): Promise<void> {
    // Deferred: see class doc. Left as a no-op seam to avoid premature,
    // business-less audit writes. When enabled:
    //   await this.prisma.auditLog.create({ data: { ...input } });
    this.logger.debug(
      `writeLog deferred (action=${input.action}, business=${input.businessId})`,
    );
  }
}
