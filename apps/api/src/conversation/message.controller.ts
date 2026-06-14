import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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
import { MessageService } from "./message.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { ListMessagesQueryDto } from "./dto/list-messages-query.dto";
import {
  MessageResponseDto,
  PaginatedMessagesDto,
} from "./dto/message-response.dto";

const WRITE_ROLES = [
  BusinessMemberRole.OWNER,
  BusinessMemberRole.ADMIN,
  BusinessMemberRole.STAFF,
] as const;

@Controller("businesses/:businessId/conversations/:conversationId/messages")
@UseGuards(JwtAuthGuard, BusinessAccessGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(BusinessRolesGuard)
  @Roles(...WRITE_ROLES)
  create(
    @CurrentBusiness() ctx: BusinessContext,
    @Param("conversationId") conversationId: string,
    @Body() dto: CreateMessageDto,
  ): Promise<MessageResponseDto> {
    return this.messageService.create(
      ctx.businessId,
      ctx.userId,
      conversationId,
      dto,
    );
  }

  @Get()
  list(
    @CurrentBusiness() ctx: BusinessContext,
    @Param("conversationId") conversationId: string,
    @Query() query: ListMessagesQueryDto,
  ): Promise<PaginatedMessagesDto> {
    return this.messageService.list(ctx.businessId, conversationId, query);
  }
}
