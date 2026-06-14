# @aura/shared

Cross-cutting types, DTOs, utilities, and constants used across apps and packages.

## Boundaries

Has no internal dependencies. Must not import from any other workspace.

## What's here

- `src/enums.ts` — application-facing enum contracts. These **mirror the Prisma `enum` declarations** in `packages/database/prisma/schema.prisma` one-to-one (identical member names). Prisma enums aren't importable as plain app contracts, so these const objects are the source of truth for app code. Keep both in sync.
- `src/constants.ts` — Thai-first default constants (`DEFAULT_LOCALE`, `DEFAULT_TIMEZONE`, `DEFAULT_CURRENCY`, `DEFAULT_LANGUAGE`). These mirror the root `.env.example` and the `Business` model defaults.

## Enums

`UserStatus`, `BusinessMemberRole`, `ConversationStatus`, `ConversationChannel`, `MessageSender`, `MessageType`, `AiActionType`, `AiActionStatus`, `ApprovalStatus`, `TaskStatus`, `TaskPriority`, `AiMemoryType`, `Language`, `SalesStage`, `ActorType`.

Each is a `const` object plus a matching union type, e.g.:

```ts
import { TaskStatus } from "@aura/shared";
const s: TaskStatus = TaskStatus.TODO;
```
