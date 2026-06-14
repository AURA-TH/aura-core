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
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { AuthenticatedUser } from "../auth/strategies/jwt.strategy";
import { BusinessService } from "./business.service";
import { CreateBusinessDto } from "./dto/create-business.dto";
import { UpdateBusinessDto } from "./dto/update-business.dto";
import {
  BusinessMemberResponseDto,
  BusinessResponseDto,
} from "./dto/business-response.dto";
import { BusinessAccessGuard } from "./guards/business-access.guard";
import { BusinessRolesGuard } from "./guards/business-roles.guard";
import { Roles } from "./decorators/roles.decorator";
import {
  BusinessContext,
  CurrentBusiness,
} from "./decorators/current-business.decorator";

@Controller("businesses")
@UseGuards(JwtAuthGuard)
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateBusinessDto,
  ): Promise<BusinessResponseDto> {
    return this.businessService.create(user.id, dto);
  }

  @Get()
  listMine(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<BusinessResponseDto[]> {
    return this.businessService.listMine(user.id);
  }

  @Get(":businessId")
  @UseGuards(BusinessAccessGuard)
  getOne(
    @CurrentBusiness() ctx: BusinessContext,
  ): Promise<BusinessResponseDto> {
    return this.businessService.getOne(ctx);
  }

  @Patch(":businessId")
  @UseGuards(BusinessAccessGuard, BusinessRolesGuard)
  @Roles(BusinessMemberRole.OWNER, BusinessMemberRole.ADMIN)
  update(
    @CurrentBusiness() ctx: BusinessContext,
    @Body() dto: UpdateBusinessDto,
  ): Promise<BusinessResponseDto> {
    return this.businessService.update(ctx, dto);
  }

  @Get(":businessId/members")
  @UseGuards(BusinessAccessGuard)
  listMembers(
    @CurrentBusiness() ctx: BusinessContext,
  ): Promise<BusinessMemberResponseDto[]> {
    return this.businessService.listMembers(ctx.businessId);
  }
}
