import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { isUUID } from "class-validator";
import { ActorType, DEFAULT_CURRENCY } from "@aura/shared";
import { Prisma } from "@aura/database";
import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ListProductsQueryDto } from "./dto/list-products-query.dto";
import {
  PaginatedProductsDto,
  ProductResponseDto,
} from "./dto/product-response.dto";

/** Detects Prisma's unique-constraint violation (P2002). */
function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "P2002"
  );
}

/** Normalize sku: trim; empty string -> null. */
function normalizeSku(sku: string | undefined): string | null {
  if (sku === undefined) {
    return null;
  }
  const trimmed = sku.trim();
  return trimmed.length === 0 ? null : trimmed;
}

/** Trim a validated money string. Undefined passes through unchanged. */
function normalizeMoney(value: string | undefined): string | undefined {
  return value === undefined ? undefined : value.trim();
}

/** Trim + uppercase currency; default to THB when omitted. */
function normalizeCurrency(currency: string | undefined): string {
  if (currency === undefined) {
    return DEFAULT_CURRENCY;
  }
  const trimmed = currency.trim().toUpperCase();
  return trimmed.length === 0 ? DEFAULT_CURRENCY : trimmed;
}

type ProductRecord = {
  id: string;
  businessId: string;
  name: string;
  description: string | null;
  sku: string | null;
  brand: string | null;
  category: string | null;
  price: { toString(): string };
  cost: { toString(): string } | null;
  currency: string;
  stockQuantity: number;
  imageUrl: string | null;
  isActive: boolean;
  metadata: unknown;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async create(
    businessId: string,
    userId: string,
    dto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    const sku = normalizeSku(dto.sku);

    const data: Prisma.ProductUncheckedCreateInput = {
      businessId,
      name: dto.name,
      price: normalizeMoney(dto.price) as string,
      cost: normalizeMoney(dto.cost) ?? null,
      description: dto.description ?? null,
      sku,
      brand: dto.brand ?? null,
      category: dto.category ?? null,
      currency: normalizeCurrency(dto.currency),
      stockQuantity: dto.stockQuantity ?? 0,
      imageUrl: dto.imageUrl ?? null,
      metadata: (dto.metadata ?? undefined) as
        | Prisma.InputJsonValue
        | undefined,
    };

    let product: ProductRecord;
    try {
      product = (await this.prisma.product.create({
        data,
      })) as ProductRecord;
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new ConflictException("Product sku is already in use");
      }
      throw error;
    }

    await this.audit.writeLog({
      businessId,
      actorType: ActorType.USER,
      actorId: userId,
      action: "product.created",
      entityType: "Product",
      entityId: product.id,
    });

    return this.toResponse(product);
  }

  async list(
    businessId: string,
    query: ListProductsQueryDto,
  ): Promise<PaginatedProductsDto> {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 20, 100);
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      businessId,
      deletedAt: null,
    };
    if (query.brand) {
      where.brand = query.brand;
    }
    if (query.category) {
      where.category = query.category;
    }
    if (query.search) {
      where.name = { contains: query.search, mode: "insensitive" };
    }

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: (rows as ProductRecord[]).map((p) => this.toResponse(p)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getOne(
    businessId: string,
    productId: string,
  ): Promise<ProductResponseDto> {
    const product = await this.findScoped(businessId, productId);
    return this.toResponse(product);
  }

  async update(
    businessId: string,
    userId: string,
    productId: string,
    dto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    // Ensure it exists in this business and is not soft-deleted.
    await this.findScoped(businessId, productId);

    const data: Prisma.ProductUpdateInput = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.price !== undefined) data.price = normalizeMoney(dto.price);
    if (dto.cost !== undefined) data.cost = normalizeMoney(dto.cost);
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.sku !== undefined) data.sku = normalizeSku(dto.sku);
    if (dto.brand !== undefined) data.brand = dto.brand;
    if (dto.category !== undefined) data.category = dto.category;
    if (dto.currency !== undefined)
      data.currency = normalizeCurrency(dto.currency);
    if (dto.stockQuantity !== undefined)
      data.stockQuantity = dto.stockQuantity;
    if (dto.imageUrl !== undefined) data.imageUrl = dto.imageUrl;
    if (dto.isActive !== undefined) data.isActive = dto.isActive;
    if (dto.metadata !== undefined)
      data.metadata = dto.metadata as Prisma.InputJsonValue;

    let product: ProductRecord;
    try {
      product = (await this.prisma.product.update({
        where: { id: productId },
        data,
      })) as ProductRecord;
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new ConflictException("Product sku is already in use");
      }
      throw error;
    }

    await this.audit.writeLog({
      businessId,
      actorType: ActorType.USER,
      actorId: userId,
      action: "product.updated",
      entityType: "Product",
      entityId: productId,
      metadata: { fields: Object.keys(dto) },
    });

    return this.toResponse(product);
  }

  async archive(
    businessId: string,
    userId: string,
    productId: string,
  ): Promise<ProductResponseDto> {
    await this.findScoped(businessId, productId);

    const product = (await this.prisma.product.update({
      where: { id: productId },
      data: { deletedAt: new Date(), isActive: false },
    })) as ProductRecord;

    await this.audit.writeLog({
      businessId,
      actorType: ActorType.USER,
      actorId: userId,
      action: "product.archived",
      entityType: "Product",
      entityId: productId,
    });

    return this.toResponse(product);
  }

  /**
   * Resolve a product within a business, excluding soft-deleted rows.
   * Invalid UUID or no match -> 404 (never query by id alone; anti-enumeration).
   */
  private async findScoped(
    businessId: string,
    productId: string,
  ): Promise<ProductRecord> {
    if (!isUUID(productId)) {
      throw new NotFoundException("Product not found");
    }
    const product = await this.prisma.product.findFirst({
      where: { id: productId, businessId, deletedAt: null },
    });
    if (!product) {
      throw new NotFoundException("Product not found");
    }
    return product as ProductRecord;
  }

  private toResponse(p: ProductRecord): ProductResponseDto {
    return {
      id: p.id,
      businessId: p.businessId,
      name: p.name,
      description: p.description,
      sku: p.sku,
      brand: p.brand,
      category: p.category,
      price: p.price.toString(),
      cost: p.cost === null ? null : p.cost.toString(),
      currency: p.currency,
      stockQuantity: p.stockQuantity,
      imageUrl: p.imageUrl,
      isActive: p.isActive,
      metadata: p.metadata ?? null,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    };
  }
}
