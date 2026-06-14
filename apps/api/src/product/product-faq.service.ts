import { Injectable, NotFoundException } from "@nestjs/common";
import { isUUID } from "class-validator";
import { ActorType } from "@aura/shared";
import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { CreateProductFaqDto } from "./dto/create-product-faq.dto";
import { UpdateProductFaqDto } from "./dto/update-product-faq.dto";
import { ProductFaqResponseDto } from "./dto/product-faq-response.dto";

type FaqRecord = {
  id: string;
  businessId: string;
  productId: string;
  question: string;
  answer: string;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class ProductFaqService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async create(
    businessId: string,
    userId: string,
    productId: string,
    dto: CreateProductFaqDto,
  ): Promise<ProductFaqResponseDto> {
    await this.assertProduct(businessId, productId);

    const faq = (await this.prisma.productFAQ.create({
      data: {
        businessId,
        productId,
        question: dto.question,
        answer: dto.answer,
      },
    })) as FaqRecord;

    await this.audit.writeLog({
      businessId,
      actorType: ActorType.USER,
      actorId: userId,
      action: "product_faq.created",
      entityType: "ProductFAQ",
      entityId: faq.id,
    });

    return this.toResponse(faq);
  }

  async list(
    businessId: string,
    productId: string,
  ): Promise<ProductFaqResponseDto[]> {
    await this.assertProduct(businessId, productId);

    const faqs = await this.prisma.productFAQ.findMany({
      where: { businessId, productId, deletedAt: null },
      orderBy: { createdAt: "asc" },
    });
    return (faqs as FaqRecord[]).map((f) => this.toResponse(f));
  }

  async update(
    businessId: string,
    userId: string,
    productId: string,
    faqId: string,
    dto: UpdateProductFaqDto,
  ): Promise<ProductFaqResponseDto> {
    await this.assertProduct(businessId, productId);
    await this.findScoped(businessId, productId, faqId);

    const data: Record<string, unknown> = {};
    if (dto.question !== undefined) data.question = dto.question;
    if (dto.answer !== undefined) data.answer = dto.answer;

    const faq = (await this.prisma.productFAQ.update({
      where: { id: faqId },
      data,
    })) as FaqRecord;

    await this.audit.writeLog({
      businessId,
      actorType: ActorType.USER,
      actorId: userId,
      action: "product_faq.updated",
      entityType: "ProductFAQ",
      entityId: faqId,
      metadata: { fields: Object.keys(dto) },
    });

    return this.toResponse(faq);
  }

  async archive(
    businessId: string,
    userId: string,
    productId: string,
    faqId: string,
  ): Promise<ProductFaqResponseDto> {
    await this.assertProduct(businessId, productId);
    await this.findScoped(businessId, productId, faqId);

    const faq = (await this.prisma.productFAQ.update({
      where: { id: faqId },
      data: { deletedAt: new Date() },
    })) as FaqRecord;

    await this.audit.writeLog({
      businessId,
      actorType: ActorType.USER,
      actorId: userId,
      action: "product_faq.archived",
      entityType: "ProductFAQ",
      entityId: faqId,
    });

    return this.toResponse(faq);
  }

  /**
   * Confirm the product exists in this business and is not soft-deleted.
   * Invalid UUID or no match -> 404.
   */
  private async assertProduct(
    businessId: string,
    productId: string,
  ): Promise<void> {
    if (!isUUID(productId)) {
      throw new NotFoundException("Product not found");
    }
    const product = await this.prisma.product.findFirst({
      where: { id: productId, businessId, deletedAt: null },
      select: { id: true },
    });
    if (!product) {
      throw new NotFoundException("Product not found");
    }
  }

  /**
   * Resolve a FAQ scoped to BOTH business and product, excluding soft-deleted.
   * This blocks the cross-product FAQ access vector. Invalid UUID -> 404.
   */
  private async findScoped(
    businessId: string,
    productId: string,
    faqId: string,
  ): Promise<FaqRecord> {
    if (!isUUID(faqId)) {
      throw new NotFoundException("FAQ not found");
    }
    const faq = await this.prisma.productFAQ.findFirst({
      where: { id: faqId, businessId, productId, deletedAt: null },
    });
    if (!faq) {
      throw new NotFoundException("FAQ not found");
    }
    return faq as FaqRecord;
  }

  private toResponse(f: FaqRecord): ProductFaqResponseDto {
    return {
      id: f.id,
      businessId: f.businessId,
      productId: f.productId,
      question: f.question,
      answer: f.answer,
      createdAt: f.createdAt.toISOString(),
      updatedAt: f.updatedAt.toISOString(),
    };
  }
}
