import { Injectable, NotFoundException } from "@nestjs/common";
import { isUUID } from "class-validator";
import { ActorType, ConversationChannel, Language } from "@aura/shared";
import { Prisma } from "@aura/database";
import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";
import { ListCustomersQueryDto } from "./dto/list-customers-query.dto";
import {
  CustomerResponseDto,
  PaginatedCustomersDto,
} from "./dto/customer-response.dto";

type CustomerRecord = {
  id: string;
  businessId: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  sourceChannel: ConversationChannel | null;
  externalId: string | null;
  province: string | null;
  tags: unknown;
  notes: string | null;
  customerScore: number | null;
  lastContactAt: Date | null;
  lastPurchaseAt: Date | null;
  nextFollowUpAt: Date | null;
  language: Language;
  metadata: unknown;
  createdAt: Date;
  updatedAt: Date;
};

/** Convert an optional ISO string to Date (validated upstream by @IsISO8601). */
function toDate(value: string | undefined): Date | undefined {
  return value === undefined ? undefined : new Date(value);
}

@Injectable()
export class CustomerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async create(
    businessId: string,
    userId: string,
    dto: CreateCustomerDto,
  ): Promise<CustomerResponseDto> {
    const data: Prisma.CustomerUncheckedCreateInput = {
      businessId,
      name: dto.name ?? null,
      email: dto.email ?? null,
      phone: dto.phone ?? null,
      sourceChannel: dto.sourceChannel ?? null,
      externalId: dto.externalId ?? null,
      province: dto.province ?? null,
      tags: (dto.tags ?? undefined) as Prisma.InputJsonValue | undefined,
      notes: dto.notes ?? null,
      customerScore: dto.customerScore ?? null,
      lastContactAt: toDate(dto.lastContactAt) ?? null,
      lastPurchaseAt: toDate(dto.lastPurchaseAt) ?? null,
      nextFollowUpAt: toDate(dto.nextFollowUpAt) ?? null,
      language: dto.language ?? Language.TH,
      metadata: (dto.metadata ?? undefined) as
        | Prisma.InputJsonValue
        | undefined,
    };

    const customer = (await this.prisma.customer.create({
      data,
    })) as CustomerRecord;

    await this.audit.writeLog({
      businessId,
      actorType: ActorType.USER,
      actorId: userId,
      action: "customer.created",
      entityType: "Customer",
      entityId: customer.id,
    });

    return this.toResponse(customer);
  }

  async list(
    businessId: string,
    query: ListCustomersQueryDto,
  ): Promise<PaginatedCustomersDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.CustomerWhereInput = {
      businessId,
      deletedAt: null,
    };
    if (query.sourceChannel) {
      where.sourceChannel = query.sourceChannel;
    }
    if (query.province) {
      where.province = query.province;
    }
    if (query.nextFollowUpBefore) {
      where.nextFollowUpAt = { lte: new Date(query.nextFollowUpBefore) };
    }
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: "insensitive" } },
        { email: { contains: query.search, mode: "insensitive" } },
        { phone: { contains: query.search, mode: "insensitive" } },
      ];
    }

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.customer.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      this.prisma.customer.count({ where }),
    ]);

    return {
      data: (rows as CustomerRecord[]).map((c) => this.toResponse(c)),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getOne(
    businessId: string,
    customerId: string,
  ): Promise<CustomerResponseDto> {
    const customer = await this.findScoped(businessId, customerId);
    return this.toResponse(customer);
  }

  async update(
    businessId: string,
    userId: string,
    customerId: string,
    dto: UpdateCustomerDto,
  ): Promise<CustomerResponseDto> {
    await this.findScoped(businessId, customerId);

    const data: Prisma.CustomerUpdateInput = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.email !== undefined) data.email = dto.email;
    if (dto.phone !== undefined) data.phone = dto.phone;
    if (dto.sourceChannel !== undefined)
      data.sourceChannel = dto.sourceChannel;
    if (dto.externalId !== undefined) data.externalId = dto.externalId;
    if (dto.province !== undefined) data.province = dto.province;
    if (dto.tags !== undefined) data.tags = dto.tags as Prisma.InputJsonValue;
    if (dto.notes !== undefined) data.notes = dto.notes;
    if (dto.customerScore !== undefined)
      data.customerScore = dto.customerScore;
    if (dto.lastContactAt !== undefined)
      data.lastContactAt = toDate(dto.lastContactAt);
    if (dto.lastPurchaseAt !== undefined)
      data.lastPurchaseAt = toDate(dto.lastPurchaseAt);
    if (dto.nextFollowUpAt !== undefined)
      data.nextFollowUpAt = toDate(dto.nextFollowUpAt);
    if (dto.language !== undefined) data.language = dto.language;
    if (dto.metadata !== undefined)
      data.metadata = dto.metadata as Prisma.InputJsonValue;

    const customer = (await this.prisma.customer.update({
      where: { id: customerId },
      data,
    })) as CustomerRecord;

    await this.audit.writeLog({
      businessId,
      actorType: ActorType.USER,
      actorId: userId,
      action: "customer.updated",
      entityType: "Customer",
      entityId: customerId,
      metadata: { fields: Object.keys(dto) },
    });

    return this.toResponse(customer);
  }

  async archive(
    businessId: string,
    userId: string,
    customerId: string,
  ): Promise<CustomerResponseDto> {
    await this.findScoped(businessId, customerId);

    const customer = (await this.prisma.customer.update({
      where: { id: customerId },
      data: { deletedAt: new Date() },
    })) as CustomerRecord;

    await this.audit.writeLog({
      businessId,
      actorType: ActorType.USER,
      actorId: userId,
      action: "customer.archived",
      entityType: "Customer",
      entityId: customerId,
    });

    return this.toResponse(customer);
  }

  /** Resolve a customer within a business, excluding soft-deleted. 404 on miss/invalid UUID. */
  private async findScoped(
    businessId: string,
    customerId: string,
  ): Promise<CustomerRecord> {
    if (!isUUID(customerId)) {
      throw new NotFoundException("Customer not found");
    }
    const customer = await this.prisma.customer.findFirst({
      where: { id: customerId, businessId, deletedAt: null },
    });
    if (!customer) {
      throw new NotFoundException("Customer not found");
    }
    return customer as CustomerRecord;
  }

  private toResponse(c: CustomerRecord): CustomerResponseDto {
    return {
      id: c.id,
      businessId: c.businessId,
      name: c.name,
      email: c.email,
      phone: c.phone,
      sourceChannel: c.sourceChannel,
      externalId: c.externalId,
      province: c.province,
      tags: c.tags ?? null,
      notes: c.notes,
      customerScore: c.customerScore,
      lastContactAt: c.lastContactAt ? c.lastContactAt.toISOString() : null,
      lastPurchaseAt: c.lastPurchaseAt ? c.lastPurchaseAt.toISOString() : null,
      nextFollowUpAt: c.nextFollowUpAt ? c.nextFollowUpAt.toISOString() : null,
      language: c.language,
      metadata: c.metadata ?? null,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    };
  }
}
