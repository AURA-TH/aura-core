import {
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from "class-validator";
import {
  ConversationChannel,
  ConversationStatus,
  SalesStage,
} from "@aura/shared";

const CHANNELS = Object.values(ConversationChannel);
const STATUSES = Object.values(ConversationStatus);
const STAGES = Object.values(SalesStage);

/** All optional; id/businessId/timestamps absent (mass-assignment blocked). */
export class UpdateConversationDto {
  @IsOptional()
  @IsUUID()
  customerId?: string;

  @IsOptional()
  @IsIn(CHANNELS)
  channel?: ConversationChannel;

  @IsOptional()
  @IsIn(STATUSES)
  status?: ConversationStatus;

  @IsOptional()
  @IsIn(STAGES)
  salesStage?: SalesStage;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  subject?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  summary?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  externalThreadId?: string;
}
