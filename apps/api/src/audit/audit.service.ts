import { Injectable, Logger } from "@nestjs/common";
import { ActorType } from "@aura/shared";
import { PrismaService } from "../prisma/prisma.service";

/**
 * Writes AuditLog entries for business-scoped actions.
 *
 * Best-effort (DEV-004 decision): a failure to write an audit entry MUST NOT
 * fail the main user action. Errors are logged server-side and swallowed.
 * AuditLog is immutable — writeLog only ever creates, never updates/deletes.
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
   * Persist an audit log entry. Best-effort: never throws to the caller.
   * Returns true if written, false if the write failed (already logged).
   */
  async writeLog(input: WriteAuditLogInput): Promise<boolean> {
    try {
      await this.prisma.auditLog.create({
        data: {
          businessId: input.businessId,
          actorType: input.actorType,
          actorId: input.actorId ?? null,
          action: input.action,
          entityType: input.entityType ?? null,
          entityId: input.entityId ?? null,
          metadata: (input.metadata ?? undefined) as object | undefined,
        },
      });
      return true;
    } catch (error) {
      // Swallow: audit failure must not break the user action.
      this.logger.error(
        `Audit write failed (action=${input.action}, business=${input.businessId})`,
        error instanceof Error ? error.stack : String(error),
      );
      return false;
    }
  }
}
