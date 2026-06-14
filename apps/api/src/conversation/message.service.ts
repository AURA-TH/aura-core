import { Injectable, NotFoundException } from "@nestjs/common";
import { isUUID } from "class-validator";
import { ActorType, MessageSender, MessageType } from "@aura/shared";
import { Prisma } from "@aura/database";
import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { ListMessagesQueryDto } from "./dto/list-messages-query.dto";
import {
  MessageResponseDto,
  PaginatedMessagesDto,
} from "./dto/message-response.dto";

type MessageRecord = {
  id: string;
  businessId: string;
  conversationId: string;
  sender: MessageSender;
  type: MessageType;
  content: string;
  metadata: unknown;
  createdAt: Date;
};

type ConversationRef = {
  id: string;
  customerId: string | null;
};

@Injectable()
export class MessageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  /**
   * Append a message. In one transaction:
   *  1. create Message
   *  2. bump Conversation.lastMessageAt
   *  3. if the conversation has a customer, bump Customer.lastContactAt
   * Messages are append-only — no edit/delete/archive.
   */
  async create(
    businessId: string,
    userId: string,
    conversationId: string,
    dto: CreateMessageDto,
  ): Promise<MessageResponseDto> {
    const conversation = await this.findConversation(businessId, conversationId);
    const now = new Date();

    const message = await this.prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const created = await tx.message.create({
          data: {
            businessId,
            conversationId,
            sender: dto.sender,
            type: dto.type ?? MessageType.TEXT,
            content: dto.content,
            metadata: (dto.metadata ?? undefined) as
              | Prisma.InputJsonValue
              | undefined,
          },
        });

        await tx.conversation.update({
          where: { id: conversationId },
          data: { lastMessageAt: now },
        });

        if (conversation.customerId) {
          await tx.customer.update({
            where: { id: conversation.customerId },
            data: { lastContactAt: now },
          });
        }

        return created as MessageRecord;
      },
    );

    await this.audit.writeLog({
      businessId,
      actorType: ActorType.USER,
      actorId: userId,
      action: "message.created",
      entityType: "Message",
      entityId: message.id,
      metadata: { conversationId },
    });

    return this.toResponse(message);
  }

  async list(
    businessId: string,
    conversationId: string,
    query: ListMessagesQueryDto,
  ): Promise<PaginatedMessagesDto> {
    await this.findConversation(businessId, conversationId);

    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const skip = (page - 1) * limit;

    const where: Prisma.MessageWhereInput = { businessId, conversationId };

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.message.findMany({
        where,
        orderBy: { createdAt: "asc" },
        skip,
        take: limit,
      }),
      this.prisma.message.count({ where }),
    ]);

    return {
      data: (rows as MessageRecord[]).map((m) => this.toResponse(m)),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  /**
   * Resolve a conversation within a business, excluding soft-deleted.
   * 404 on miss/invalid UUID. Messages are always scoped by business AND
   * conversation.
   */
  private async findConversation(
    businessId: string,
    conversationId: string,
  ): Promise<ConversationRef> {
    if (!isUUID(conversationId)) {
      throw new NotFoundException("Conversation not found");
    }
    const conversation = await this.prisma.conversation.findFirst({
      where: { id: conversationId, businessId, deletedAt: null },
      select: { id: true, customerId: true },
    });
    if (!conversation) {
      throw new NotFoundException("Conversation not found");
    }
    return conversation as ConversationRef;
  }

  private toResponse(m: MessageRecord): MessageResponseDto {
    return {
      id: m.id,
      businessId: m.businessId,
      conversationId: m.conversationId,
      sender: m.sender,
      type: m.type,
      content: m.content,
      metadata: m.metadata ?? null,
      createdAt: m.createdAt.toISOString(),
    };
  }
}
