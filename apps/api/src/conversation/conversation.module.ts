import { Module } from "@nestjs/common";
import { AuditModule } from "../audit/audit.module";
import { ConversationController } from "./conversation.controller";
import { MessageController } from "./message.controller";
import { ConversationService } from "./conversation.service";
import { MessageService } from "./message.service";
import { BusinessAccessGuard } from "../business/guards/business-access.guard";
import { BusinessRolesGuard } from "../business/guards/business-roles.guard";

@Module({
  imports: [AuditModule],
  controllers: [ConversationController, MessageController],
  providers: [
    ConversationService,
    MessageService,
    BusinessAccessGuard,
    BusinessRolesGuard,
  ],
})
export class ConversationModule {}
