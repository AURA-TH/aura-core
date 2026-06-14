import { ConflictException, Injectable } from "@nestjs/common";
import {
  ActorType,
  BusinessMemberRole,
  DEFAULT_CURRENCY,
  DEFAULT_LANGUAGE,
  DEFAULT_LOCALE,
  DEFAULT_TIMEZONE,
  Language,
  UserStatus,
} from "@aura/shared";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "@aura/database";
import { AuditService } from "../audit/audit.service";
import { CreateBusinessDto } from "./dto/create-business.dto";
import { UpdateBusinessDto } from "./dto/update-business.dto";
import {
  BusinessMemberResponseDto,
  BusinessResponseDto,
} from "./dto/business-response.dto";
import { BusinessContext } from "./decorators/current-business.decorator";

/** Detects Prisma's unique-constraint violation (P2002) without importing the runtime error class. */
function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "P2002"
  );
}

type BusinessRecord = {
  id: string;
  name: string;
  slug: string | null;
  businessType: string | null;
  description: string | null;
  toneOfVoice: string | null;
  shippingPolicy: string | null;
  paymentPolicy: string | null;
  locale: string;
  timezone: string;
  currency: string;
  language: Language;
  openingHours: unknown;
  metadata: unknown;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class BusinessService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  /**
   * Creates a Business and its OWNER membership atomically. If either write
   * fails, both roll back.
   */
  async create(
    userId: string,
    dto: CreateBusinessDto,
  ): Promise<BusinessResponseDto> {
    let result: BusinessRecord;
    try {
      result = await this.prisma.$transaction(
        async (tx: Prisma.TransactionClient) => {
          const business = await tx.business.create({
            data: {
              name: dto.name,
              slug: dto.slug ?? null,
              businessType: dto.businessType ?? null,
              description: dto.description ?? null,
              // Thai-first defaults unless explicitly overridden.
              locale: dto.locale ?? DEFAULT_LOCALE,
              timezone: dto.timezone ?? DEFAULT_TIMEZONE,
              currency: dto.currency ?? DEFAULT_CURRENCY,
              language: dto.language ?? DEFAULT_LANGUAGE,
              openingHours: (dto.openingHours ?? undefined) as
                | object
                | undefined,
              metadata: (dto.metadata ?? undefined) as object | undefined,
            },
          });

          await tx.businessMember.create({
            data: {
              businessId: business.id,
              userId,
              role: BusinessMemberRole.OWNER,
            },
          });

          return business as BusinessRecord;
        },
      );
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new ConflictException("Business slug is already taken");
      }
      throw error;
    }

    // Best-effort audit (never fails the action).
    await this.audit.writeLog({
      businessId: result.id,
      actorType: ActorType.USER,
      actorId: userId,
      action: "business.created",
      entityType: "Business",
      entityId: result.id,
    });
    await this.audit.writeLog({
      businessId: result.id,
      actorType: ActorType.USER,
      actorId: userId,
      action: "business.member.owner_created",
      entityType: "BusinessMember",
      metadata: { role: BusinessMemberRole.OWNER },
    });

    return this.toBusinessResponse(result, BusinessMemberRole.OWNER);
  }

  /**
   * Lists businesses where the user is a non-deleted member and the business
   * is not deleted. Each item includes the user's role.
   */
  async listMine(userId: string): Promise<BusinessResponseDto[]> {
    const memberships = await this.prisma.businessMember.findMany({
      where: {
        userId,
        deletedAt: null,
        business: { deletedAt: null },
      },
      select: { role: true, business: true },
      orderBy: { createdAt: "asc" },
    });

    return memberships.map(
      (m: { role: string; business: BusinessRecord }) =>
        this.toBusinessResponse(
          m.business,
          m.role as BusinessMemberRole,
        ),
    );
  }

  /**
   * Returns a single business. Access + existence already enforced by
   * BusinessAccessGuard; we use the resolved context for businessId + role.
   */
  async getOne(ctx: BusinessContext): Promise<BusinessResponseDto> {
    const business = await this.prisma.business.findFirst({
      where: { id: ctx.businessId, deletedAt: null },
    });
    // Guard already guarantees existence + membership; defensive null check.
    if (!business) {
      throw new ConflictException("Business state changed");
    }
    return this.toBusinessResponse(business as BusinessRecord, ctx.role);
  }

  /**
   * Updates business profile fields. Role enforcement (OWNER/ADMIN) is done by
   * the guard layer; this method trusts the resolved context.
   */
  async update(
    ctx: BusinessContext,
    dto: UpdateBusinessDto,
  ): Promise<BusinessResponseDto> {
    const business = await this.prisma.business
      .update({
        where: { id: ctx.businessId },
        data: {
          ...(dto.name !== undefined ? { name: dto.name } : {}),
          ...(dto.slug !== undefined ? { slug: dto.slug } : {}),
          ...(dto.businessType !== undefined
            ? { businessType: dto.businessType }
            : {}),
          ...(dto.description !== undefined
            ? { description: dto.description }
            : {}),
          ...(dto.toneOfVoice !== undefined
            ? { toneOfVoice: dto.toneOfVoice }
            : {}),
          ...(dto.shippingPolicy !== undefined
            ? { shippingPolicy: dto.shippingPolicy }
            : {}),
          ...(dto.paymentPolicy !== undefined
            ? { paymentPolicy: dto.paymentPolicy }
            : {}),
          ...(dto.locale !== undefined ? { locale: dto.locale } : {}),
          ...(dto.timezone !== undefined ? { timezone: dto.timezone } : {}),
          ...(dto.currency !== undefined ? { currency: dto.currency } : {}),
          ...(dto.language !== undefined ? { language: dto.language } : {}),
          ...(dto.openingHours !== undefined
            ? { openingHours: dto.openingHours as object }
            : {}),
          ...(dto.metadata !== undefined
            ? { metadata: dto.metadata as object }
            : {}),
        },
      })
      .catch((error: unknown) => {
        if (isUniqueConstraintError(error)) {
          throw new ConflictException("Business slug is already taken");
        }
        throw error;
      });

    await this.audit.writeLog({
      businessId: ctx.businessId,
      actorType: ActorType.USER,
      actorId: ctx.userId,
      action: "business.updated",
      entityType: "Business",
      entityId: ctx.businessId,
      metadata: { fields: Object.keys(dto) },
    });

    return this.toBusinessResponse(business as BusinessRecord, ctx.role);
  }

  /**
   * Lists non-deleted members of the business. Visible to fellow members only
   * (enforced by BusinessAccessGuard on the route).
   */
  async listMembers(
    businessId: string,
  ): Promise<BusinessMemberResponseDto[]> {
    const members = await this.prisma.businessMember.findMany({
      where: { businessId, deletedAt: null },
      select: {
        userId: true,
        role: true,
        createdAt: true,
        user: {
          select: { displayName: true, email: true, status: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return members.map(
      (m: {
        userId: string;
        role: string;
        createdAt: Date;
        user: {
          displayName: string | null;
          email: string;
          status: UserStatus;
        };
      }) => ({
        userId: m.userId,
        displayName: m.user.displayName,
        email: m.user.email,
        userStatus: m.user.status,
        role: m.role as BusinessMemberRole,
        joinedAt: m.createdAt.toISOString(),
      }),
    );
  }

  private toBusinessResponse(
    b: BusinessRecord,
    role: BusinessMemberRole,
  ): BusinessResponseDto {
    return {
      id: b.id,
      name: b.name,
      slug: b.slug,
      businessType: b.businessType,
      description: b.description,
      toneOfVoice: b.toneOfVoice,
      shippingPolicy: b.shippingPolicy,
      paymentPolicy: b.paymentPolicy,
      locale: b.locale,
      timezone: b.timezone,
      currency: b.currency,
      language: b.language,
      openingHours: b.openingHours ?? null,
      metadata: b.metadata ?? null,
      createdAt: b.createdAt.toISOString(),
      updatedAt: b.updatedAt.toISOString(),
      role,
    };
  }
}
