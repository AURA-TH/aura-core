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
import { CustomerService } from "./customer.service";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";
import { ListCustomersQueryDto } from "./dto/list-customers-query.dto";
import {
  CustomerResponseDto,
  PaginatedCustomersDto,
} from "./dto/customer-response.dto";

const WRITE_ROLES = [
  BusinessMemberRole.OWNER,
  BusinessMemberRole.ADMIN,
  BusinessMemberRole.STAFF,
] as const;

@Controller("businesses/:businessId/customers")
@UseGuards(JwtAuthGuard, BusinessAccessGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(BusinessRolesGuard)
  @Roles(...WRITE_ROLES)
  create(
    @CurrentBusiness() ctx: BusinessContext,
    @Body() dto: CreateCustomerDto,
  ): Promise<CustomerResponseDto> {
    return this.customerService.create(ctx.businessId, ctx.userId, dto);
  }

  @Get()
  list(
    @CurrentBusiness() ctx: BusinessContext,
    @Query() query: ListCustomersQueryDto,
  ): Promise<PaginatedCustomersDto> {
    return this.customerService.list(ctx.businessId, query);
  }

  @Get(":customerId")
  getOne(
    @CurrentBusiness() ctx: BusinessContext,
    @Param("customerId") customerId: string,
  ): Promise<CustomerResponseDto> {
    return this.customerService.getOne(ctx.businessId, customerId);
  }

  @Patch(":customerId")
  @UseGuards(BusinessRolesGuard)
  @Roles(...WRITE_ROLES)
  update(
    @CurrentBusiness() ctx: BusinessContext,
    @Param("customerId") customerId: string,
    @Body() dto: UpdateCustomerDto,
  ): Promise<CustomerResponseDto> {
    return this.customerService.update(
      ctx.businessId,
      ctx.userId,
      customerId,
      dto,
    );
  }

  @Post(":customerId/archive")
  @HttpCode(HttpStatus.OK)
  @UseGuards(BusinessRolesGuard)
  @Roles(...WRITE_ROLES)
  archive(
    @CurrentBusiness() ctx: BusinessContext,
    @Param("customerId") customerId: string,
  ): Promise<CustomerResponseDto> {
    return this.customerService.archive(ctx.businessId, ctx.userId, customerId);
  }
}
