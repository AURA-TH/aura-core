import { Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";
import {
  DEFAULT_LOCALE,
  DEFAULT_TIMEZONE,
  DEFAULT_CURRENCY,
  DEFAULT_LANGUAGE,
} from "@aura/shared";

const PLACEHOLDER_SECRET = "change-me";

/**
 * Validates environment at boot.
 *
 * Security rule (DEV-003): in production the API must refuse to boot if
 * JWT_SECRET is missing, empty, or still the placeholder "change-me".
 * Outside production we allow the placeholder for local convenience.
 */
function validateEnv(config: Record<string, unknown>): Record<string, unknown> {
  const isProd = config.NODE_ENV === "production";
  const secret = (config.JWT_SECRET as string | undefined)?.trim();

  if (isProd && (!secret || secret === PLACEHOLDER_SECRET)) {
    throw new Error(
      "JWT_SECRET must be set to a strong, non-placeholder value in production.",
    );
  }

  // Apply Thai-first defaults when not provided by the environment.
  return {
    ...config,
    DEFAULT_LOCALE: config.DEFAULT_LOCALE ?? DEFAULT_LOCALE,
    DEFAULT_TIMEZONE: config.DEFAULT_TIMEZONE ?? DEFAULT_TIMEZONE,
    DEFAULT_CURRENCY: config.DEFAULT_CURRENCY ?? DEFAULT_CURRENCY,
    DEFAULT_LANGUAGE: config.DEFAULT_LANGUAGE ?? DEFAULT_LANGUAGE,
  };
}

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
  ],
})
export class ConfigModule {}
