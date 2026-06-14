import { IsIn, IsObject, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { MessageSender, MessageType } from "@aura/shared";

// DEV-006: clients may only create CUSTOMER or USER messages.
// AI and SYSTEM messages are created later by internal services.
const ALLOWED_SENDERS = [MessageSender.CUSTOMER, MessageSender.USER] as const;
// DEV-006: TEXT only. Image/file/audio handling is out of scope.
const ALLOWED_TYPES = [MessageType.TEXT] as const;

export class CreateMessageDto {
  @IsIn(ALLOWED_SENDERS)
  sender!: MessageSender;

  @IsOptional()
  @IsIn(ALLOWED_TYPES)
  type?: MessageType;

  @IsString()
  @MinLength(1)
  @MaxLength(8000)
  content!: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
