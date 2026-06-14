/**
 * Thai-first default constants for AURA.
 *
 * AURA is a Thai-first product (see docs/03_architecture/Localization_Standard.md).
 * These are the application-level defaults. They mirror the values in the root
 * `.env.example` and the defaults set on the `Business` model in the Prisma schema.
 *
 * Timestamps are always stored in UTC. `DEFAULT_TIMEZONE` is a presentation
 * default only — it is not a storage timezone.
 */

import { Language } from "./enums";

/** BCP 47 locale used for formatting (dates, numbers, lists). */
export const DEFAULT_LOCALE = "th-TH" as const;

/** IANA timezone used for presenting timestamps. Storage stays in UTC. */
export const DEFAULT_TIMEZONE = "Asia/Bangkok" as const;

/** ISO 4217 currency code. */
export const DEFAULT_CURRENCY = "THB" as const;

/** Default user-facing / AI reply language. */
export const DEFAULT_LANGUAGE: Language = Language.TH;
