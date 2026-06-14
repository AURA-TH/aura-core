import {
  IsIn,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";
import { Language } from "@aura/shared";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export class CreateBusinessDto {
  @IsString()
  @MinLength(1)
  @MaxLength(160)
  name!: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  @Matches(SLUG_PATTERN, {
    message: "slug must contain only lowercase letters, numbers, and hyphens",
  })
  slug?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  businessType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  // Thai-first overrides (optional). Defaults applied in the service when omitted.
  @IsOptional()
  @IsString()
  @MaxLength(35)
  locale?: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  timezone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(3)
  currency?: string;

  @IsOptional()
  @IsIn([Language.TH, Language.EN])
  language?: Language;

  @IsOptional()
  @IsObject()
  openingHours?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
