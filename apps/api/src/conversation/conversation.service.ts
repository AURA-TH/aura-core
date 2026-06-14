import { Injectable, NotFoundException } from "@nestjs/common";
import { isUUID } from "class-validator";
import {
  ActorType,
  ConversationChannel,
  ConversationStatus,
  SalesStage,
} from "@aura/shared";
import { Prisma } from "@aura/database";
import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { CreateConversationDto } from "./dto/create-conversation.dto";
import { UpdateConversationDto } from "./dto/update-conversation.dto";
import { ListConversationsQueryDto } from "./dto/list-conversations-query.dto";
import {
  ConversationResponseDto,
  PaginatedConversationsDto,
} from "./dto/conversation-response.dto";

type ConversationRecord = {
  id: string;
  businessId: string;
  customerId: string | null;
  channel: ConversationChannel;
  status: ConversationStatus;
  salesStage: SalesStage;
  subject: string | null;
  summary: string | null;
  externalThreadId: string | null;
  lastMessageAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class ConversationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async create(
    businessId: string,
    userId: string,
    dto: CreateConversationDto,
  ): Promise<ConversationResponseDto> {
    if (dto.customerId !== undefined) {
      await this.assertCustomerInBusiness(businessId, dto.customerId);
    }

    const data: Prisma.ConversationUncheckedCreateInput = {
      businessId,
      customerId: dto.customerId ?? null,
      channel: dto.channel ?? ConversationChannel.MANUAL_TEST,
      status: dto.status ?? ConversationStatus.OPEN,
      salesStage: dto.salesStage ?? SalesStage.NEW_LEAD,
      subject: dto.subject ?? null,
      summary: dto.summary ?? null,
      externalThreadId: dto.externalThreadId ?? null,
    };

    const conversation = (await this.prisma.conversation.create({
      data,
    })) as ConversationRecord;

    await this.audit.writeLog({
      businessId,
      actorType: ActorType.USER,
      actorId: userId,
      action: "conversation.created",
      entityType: "Conversation",
      entityId: conversation.id,
    });

    return this.toResponse(conversation);
  }

  async list(
    businessId: string,
    query: ListConversationsQueryDto,
  ): Promise<PaginatedConversationsDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.ConversationWhereInput = {
      businessId,
      deletedAt: null,
    };
    if (query.status) where.status = query.status;
    if (query.salesStage) where.salesStage = query.salesStage;
    if (query.channel) where.channel = query.channel;
    if (query.customerId) where.customerId = query.customerId;

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.conversation.findMany({
        where,
        orderBy: [{ lastMessageAt: "desc" }, { createdAt: "desc" }],
        skip,
        take: limit,
      }),
      this.prisma.conversation.count({ where }),
    ]);

    return {
      data: (rows as ConversationRecord[]).map((c) => this.toResponse(c)),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getOne(
    businessId: string,
    conversationId: string,
  ): Promise<ConversationResponseDto> {
    const conversation = await this.findScoped(businessId, conversationId);
    return this.toResponse(conversation);
  }

  async update(
    businessId: string,
    userId: string,
    conversationId: string,
    dto: UpdateConversationDto,
  ): Promise<ConversationResponseDto> {
    await this.findScoped(businessId, conversationId);

    if (dto.customerId !== undefined) {
      await this.assertCustomerInBusiness(businessId, dto.customerId);
    }

    const data: Prisma.ConversationUpdateInput = {};
    if (dto.customerId !== undefined)
      data.customer = { connect: { id: dto.customerId } };
    if (dto.channel !== undefined) data.channel = dto.channel;
    if (dto.status !== undefined) data.status = dto.status;
    if (dto.salesStage !== undefined) data.salesStage = dto.salesStage;
    if (dto.subject !== undefined) data.subject = dto.subject;
    if (dto.summary !== undefined) data.summary = dto.summary;
    if (dto.externalThreadId !== undefined)
      data.externalThreadId = dto.externalThreadId;

    const conversation = (await this.prisma.conversation.update({
      where: { id: conversationId },
      data,
    })) as ConversationRecord;

    await this.audit.writeLog({
      businessId,
      actorType: ActorType.USER,
      actorId: userId,
      action: "conversation.updated",
      entityType: "Conversation",
      entityId: conversationId,
      metadata: { fields: Object.keys(dto) },
    });

    return this.toResponse(conversation);
  }

  async archive(
    businessId: string,
    userId: string,
    conversationId: string,
  ): Promise<ConversationResponseDto> {
    await this.findScoped(businessId, conversationId);

    const conversation = (await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { deletedAt: new Date(), status: ConversationStatus.ARCHIVED },
    })) as ConversationRecord;

    await this.audit.writeLog({
      businessId,
      actorType: ActorType.USER,
      actorId: userId,
      action: "conversation.archived",
      entityType: "Conversation",
      entityId: conversationId,
    });

    return this.toResponse(conversation);
  }

  /** Resolve a conversation within a business, excluding soft-deleted. 404 on miss/invalid UUID. */
  private async findScoped(
    businessId: string,
    conversationId: string,
  ): Promise<ConversationRecord> {
    if (!isUUID(conversationId)) {
      throw new NotFoundException("Conversation not found");
    }
    const conversation = await this.prisma.conversation.findFirst({
      where: { id: conversationId, businessId, deletedAt: null },
    });
    if (!conversation) {
      throw new NotFoundException("Conversation not found");
    }
    return conversation as ConversationRecord;
  }

  /**
   * A conversation may only reference a customer in the same business.
   * Foreign/invalid/soft-deleted customerId -> 404 (anti-enumeration).
   */
  private async assertCustomerInBusiness(
    businessId: string,
    customerId: string,
  ): Promise<void> {
    if (!isUUID(customerId)) {
      throw new NotFoundException("Customer not found");
    }
    const customer = await this.prisma.customer.findFirst({
      where: { id: customerId, businessId, deletedAt: null },
      select: { id: true },
    });
    if (!customer) {
      throw new NotFoundException("Customer not found");
    }
  }

  private toResponse(c: ConversationRecord): ConversationResponseDto {
    return {
      id: c.id,
      businessId: c.businessId,
      customerId: c.customerId,
      channel: c.channel,
      status: c.status,
      salesStage: c.salesStage,
      subject: c.subject,
      summary: c.summary,
      externalThreadId: c.externalThreadId,
      lastMessageAt: c.lastMessageAt ? c.lastMessageAt.toISOString() : null,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    };
  }
}
