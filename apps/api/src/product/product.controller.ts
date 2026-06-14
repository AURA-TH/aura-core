import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
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
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ListProductsQueryDto } from "./dto/list-products-query.dto";
import {
  PaginatedProductsDto,
  ProductResponseDto,
} from "./dto/product-response.dto";

@Controller("businesses/:businessId/products")
@UseGuards(JwtAuthGuard, BusinessAccessGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

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
    @Body() dto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    return this.productService.create(ctx.businessId, ctx.userId, dto);
  }

  @Get()
  list(
    @CurrentBusiness() ctx: BusinessContext,
    @Query() query: ListProductsQueryDto,
  ): Promise<PaginatedProductsDto> {
    return this.productService.list(ctx.businessId, query);
  }

  @Get(":productId")
  getOne(
    @CurrentBusiness() ctx: BusinessContext,
    @Param("productId") productId: string,
  ): Promise<ProductResponseDto> {
    return this.productService.getOne(ctx.businessId, productId);
  }

  @Patch(":productId")
  @UseGuards(BusinessRolesGuard)
  @Roles(
    BusinessMemberRole.OWNER,
    BusinessMemberRole.ADMIN,
    BusinessMemberRole.STAFF,
  )
  update(
    @CurrentBusiness() ctx: BusinessContext,
    @Param("productId") productId: string,
    @Body() dto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    return this.productService.update(
      ctx.businessId,
      ctx.userId,
      productId,
      dto,
    );
  }

  @Post(":productId/archive")
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
  ): Promise<ProductResponseDto> {
    return this.productService.archive(ctx.businessId, ctx.userId, productId);
  }
}
