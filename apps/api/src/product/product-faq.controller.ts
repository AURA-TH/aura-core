import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { BusinessMemberRole } from "@aura/shared";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { BusinessAccessGuard } from "../business/guards/business-access.guard";
import { BusinessRolesGuard } from "../business/guards/business-roles.guard";
import { Roles } from "../business/decorators/roles.decorator";
import {
  BusinessContext,
  CurrentBusiness,
} from "../business/decorators/current-business.decorator";
import { ProductFaqService } from "./product-faq.service";
import { CreateProductFaqDto } from "./dto/create-product-faq.dto";
import { UpdateProductFaqDto } from "./dto/update-product-faq.dto";
import { ProductFaqResponseDto } from "./dto/product-faq-response.dto";

@Controller("businesses/:businessId/products/:productId/faqs")
@UseGuards(JwtAuthGuard, BusinessAccessGuard)
export class ProductFaqController {
  constructor(private readonly faqService: ProductFaqService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(BusinessRolesGuard)
  @Roles(
    BusinessMemberRole.OWNER,
    BusinessMemberRole.ADMIN,
    BusinessMemberRole.STAFF,
  )
  create(
    @CurrentBusiness() ctx: BusinessContext,
    @Param("productId") productId: string,
    @Body() dto: CreateProductFaqDto,
  ): Promise<ProductFaqResponseDto> {
    return this.faqService.create(ctx.businessId, ctx.userId, productId, dto);
  }

  @Get()
  list(
    @CurrentBusiness() ctx: BusinessContext,
    @Param("productId") productId: string,
  ): Promise<ProductFaqResponseDto[]> {
    return this.faqService.list(ctx.businessId, productId);
  }

  @Patch(":faqId")
  @UseGuards(BusinessRolesGuard)
  @Roles(
    BusinessMemberRole.OWNER,
    BusinessMemberRole.ADMIN,
    BusinessMemberRole.STAFF,
  )
  update(
    @CurrentBusiness() ctx: BusinessContext,
    @Param("productId") productId: string,
    @Param("faqId") faqId: string,
    @Body() dto: UpdateProductFaqDto,
  ): Promise<ProductFaqResponseDto> {
    return this.faqService.update(
      ctx.businessId,
      ctx.userId,
      productId,
      faqId,
      dto,
    );
  }

  @Post(":faqId/archive")
  @HttpCode(HttpStatus.OK)
  @UseGuards(BusinessRolesGuard)
  @Roles(
    BusinessMemberRole.OWNER,
    BusinessMemberRole.ADMIN,
    BusinessMemberRole.STAFF,
  )
  archive(
    @CurrentBusiness() ctx: BusinessContext,
    @Param("productId") productId: string,
    @Param("faqId") faqId: string,
  ): Promise<ProductFaqResponseDto> {
    return this.faqService.archive(
      ctx.businessId,
      ctx.userId,
      productId,
      faqId,
    );
  }
}
