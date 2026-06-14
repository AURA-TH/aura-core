# @aura/database

Shared data layer: Prisma client and PostgreSQL schema. The single source of truth for persistence — all data access flows through here.

## Boundaries

Depends on `shared` only. Must not import from `apps/*` or `ui`.

## What's here

- `prisma/schema.prisma` — datasource (PostgreSQL), generator, all MVP models and DB enums.
- `src/index.ts` — Prisma client singleton + re-export of generated `@prisma/client` types.

## Conventions

- **Primary keys:** UUID — `id String @id @default(uuid()) @db.Uuid`.
- **Multi-tenant:** every business-scoped model carries `businessId` (`@db.Uuid`) with an index. `User` is the only non-tenant identity.
- **Timestamps:** stored in **UTC**. `Asia/Bangkok` is a presentation default, not a storage timezone.
- **Money:** `Decimal` only (never `Float`). `Product.price` / `Product.cost` use `@db.Decimal(12, 2)`.
- **Soft delete:** `deletedAt DateTime?` on business/domain models. **`AuditLog` is immutable** (no `deletedAt`, created-only).
- **Field names are English;** only user-facing *values* may be Thai.
- **Json** is used only where the shape is still evolving (AI payloads, metadata).

## Setup

1. Copy the root env file and set your connection string:
   ```bash
   cp .env.example .env      # run from the repo root
   ```
   Set `DATABASE_URL`, e.g. `postgresql://user:pass@localhost:5432/aura?schema=public`.

2. Install dependencies (from repo root):
   ```bash
   pnpm install
   ```

3. Generate the Prisma client:
   ```bash
   pnpm --filter @aura/database db:generate
   ```

4. Create and apply the first migration (requires a running PostgreSQL):
   ```bash
   pnpm --filter @aura/database db:migrate
   ```

## Scripts

| Script | Purpose |
| --- | --- |
| `db:generate` | Generate the Prisma client |
| `db:migrate` | Create + apply a dev migration |
| `db:deploy` | Apply migrations (production) |
| `db:studio` | Open Prisma Studio |
| `db:format` | Format the schema |
| `db:validate` | Validate the schema |

> Note: the first `migrate` must be run locally against a real PostgreSQL instance. The schema in this sprint has been validated for correctness, but no migration has been committed yet.
