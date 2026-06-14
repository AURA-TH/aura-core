# Localization Standard

**Status:** DEV-001 documentation. Defines policy and architectural intent only — no UI language switching is implemented yet.

## 1. Principle — AURA is Thai-First

AURA's primary users are online store operators in Thailand. The product defaults to Thai everywhere a human reads it. English is a planned secondary language, added later via a language switch — it is **not** the baseline.

## 2. Default Locale Settings

| Setting | Default | Notes |
| --- | --- | --- |
| Language | Thai (`th`) | Default UI and AI language |
| Locale | `th-TH` | Formatting of dates, numbers, lists |
| Timezone | `Asia/Bangkok` | UTC+7, no DST |
| Currency | `THB` | Thai Baht; display and formatting default |

English (`en` / `en-US`) is supported **later** as a secondary, user-selectable language. It does not replace the Thai default.

## 3. Language Boundary — Thai vs. English

A hard line separates what users read from what developers write.

**Thai (user-facing):**
- All UI text, labels, buttons, messages, notifications
- AI Customer Service Employee replies (see §6)
- Customer- and operator-facing emails and documents

**English (system-facing — always):**
- Source code, comments
- File and folder names
- Variable, function, and class names
- API request/response field names
- Database table and column names
- Enum keys, config keys, log messages, internal identifiers

Rationale: keeping the codebase and data layer in English keeps the system maintainable and tooling-friendly, while localized values are presented to users at the edges.

## 4. No Hardcoded User-Facing Text

When UI development begins (a later sprint), user-facing strings must **not** be hardcoded into components. All such text goes through a translation/message layer keyed by stable English identifiers, e.g.:

```
// Intended pattern (illustrative — not implemented in DEV-001)
t("conversation.reply.sent")   →  "ส่งข้อความแล้ว"
```

This keeps the future English switch a matter of adding a translation file, not editing components.

## 5. Architectural Preparation for i18n

DEV-001 does not implement i18n, but the structure anticipates it:
- A future translation/message resource layer (likely surfaced through `packages/shared` for shared keys/types, with app-level message catalogs).
- Locale, timezone, and currency treated as configurable values with the defaults in §2 — never assumed inline.
- A per-business / per-user language preference field to be added to the data model in a future sprint, defaulting to `th`.

No i18n libraries, message catalogs, or switching logic are added in this sprint.

## 6. AI Language Default

The AI Customer Service Employee responds in **Thai by default**. It uses another language only when the business or end user explicitly selects one (or, in future, when configured per workspace/customer). This default lives at the AI layer (`packages/brain`) and is documented here ahead of implementation.

## 7. Out of Scope for DEV-001

- Actual UI language switching
- i18n libraries or message catalogs
- Locale/currency formatting utilities
- Per-business or per-user language preference storage
- Any Next.js / NestJS / business-logic implementation

These are documentation and architectural intent only at this stage.
