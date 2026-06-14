import { Type } from "class-transformer";
import {
  IsIn,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from "class-validator";
import { ConversationChannel } from "@aura/shared";

const CHANNELS = Object.values(ConversationChannel);

/** Defaults: page=1, limit=20. limit>100 -> VALIDATION_ERROR (no silent clamp). */
export class ListCustomersQueryDto {
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
  @IsString()
  @MaxLength(200)
  search?: string;

  @IsOptional()
  @IsIn(CHANNELS)
  sourceChannel?: ConversationChannel;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  province?: string;

  @IsOptional()
  @IsISO8601()
  nextFollowUpBefore?: string;
}
