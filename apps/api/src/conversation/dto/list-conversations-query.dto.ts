import { Type } from "class-transformer";
import {
  IsIn,
  IsInt,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from "class-validator";
import {
  ConversationChannel,
  ConversationStatus,
  SalesStage,
} from "@aura/shared";

const CHANNELS = Object.values(ConversationChannel);
const STATUSES = Object.values(ConversationStatus);
const STAGES = Object.values(SalesStage);

/** Defaults: page=1, limit=20. limit>100 -> VALIDATION_ERROR. */
export class ListConversationsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @IsIn(STATUSES)
  status?: ConversationStatus;

  @IsOptional()
  @IsIn(STAGES)
  salesStage?: SalesStage;

  @IsOptional()
  @IsIn(CHANNELS)
  channel?: ConversationChannel;

  @IsOptional()
  @IsUUID()
  customerId?: string;
}
