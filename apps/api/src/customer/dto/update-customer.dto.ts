import {
  IsEmail,
  IsIn,
  IsInt,
  IsISO8601,
  IsObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from "class-validator";
import { ConversationChannel, Language } from "@aura/shared";

const CHANNELS = Object.values(ConversationChannel);
const LANGUAGES = Object.values(Language);

/**
 * All fields optional. id, businessId, timestamps absent; combined with the
 * global ValidationPipe whitelist/forbidNonWhitelisted this blocks
 * mass-assignment of protected fields.
 */
export class UpdateCustomerDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  name?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(254)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  phone?: string;

  @IsOptional()
  @IsIn(CHANNELS)
  sourceChannel?: ConversationChannel;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  externalId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  province?: string;

  @IsOptional()
  @IsObject()
  tags?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  notes?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  customerScore?: number;

  @IsOptional()
  @IsISO8601()
  lastContactAt?: string;

  @IsOptional()
  @IsISO8601()
  lastPurchaseAt?: string;

  @IsOptional()
  @IsISO8601()
  nextFollowUpAt?: string;

  @IsOptional()
  @IsIn(LANGUAGES)
  language?: Language;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
