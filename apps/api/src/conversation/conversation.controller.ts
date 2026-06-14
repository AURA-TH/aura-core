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
import { ConversationService } from "./conversation.service";
import { CreateConversationDto } from "./dto/create-conversation.dto";
import { UpdateConversationDto } from "./dto/update-conversation.dto";
import { ListConversationsQueryDto } from "./dto/list-conversations-query.dto";
import {
  ConversationResponseDto,
  PaginatedConversationsDto,
} from "./dto/conversation-response.dto";

const WRITE_ROLES = [
  BusinessMemberRole.OWNER,
  BusinessMemberRole.ADMIN,
  BusinessMemberRole.STAFF,
] as const;

@Controller("businesses/:businessId/conversations")
@UseGuards(JwtAuthGuard, BusinessAccessGuard)
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(BusinessRolesGuard)
  @Roles(...WRITE_ROLES)
  create(
    @CurrentBusiness() ctx: BusinessContext,
    @Body() dto: CreateConversationDto,
  ): Promise<ConversationResponseDto> {
    return this.conversationService.create(ctx.businessId, ctx.userId, dto);
  }

  @Get()
  list(
    @CurrentBusiness() ctx: BusinessContext,
    @Query() query: ListConversationsQueryDto,
  ): Promise<PaginatedConversationsDto> {
    return this.conversationService.list(ctx.businessId, query);
  }

  @Get(":conversationId")
  getOne(
    @CurrentBusiness() ctx: BusinessContext,
    @Param("conversationId") conversationId: string,
  ): Promise<ConversationResponseDto> {
    return this.conversationService.getOne(ctx.businessId, conversationId);
  }

  @Patch(":conversationId")
  @UseGuards(BusinessRolesGuard)
  @Roles(...WRITE_ROLES)
  update(
    @CurrentBusiness() ctx: BusinessContext,
    @Param("conversationId") conversationId: string,
    @Body() dto: UpdateConversationDto,
  ): Promise<ConversationResponseDto> {
    return this.conversationService.update(
      ctx.businessId,
      ctx.userId,
      conversationId,
      dto,
    );
  }

  @Post(":conversationId/archive")
  @HttpCode(HttpStatus.OK)
  @UseGuards(BusinessRolesGuard)
  @Roles(...WRITE_ROLES)
  archive(
    @CurrentBusiness() ctx: BusinessContext,
    @Param("conversationId") conversationId: string,
  ): Promise<ConversationResponseDto> {
    return this.conversationService.archive(
      ctx.businessId,
      ctx.userId,
      conversationId,
    );
  }
}
