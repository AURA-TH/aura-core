# aura-core

**AURA Intelligence Platform** — an AI-Native Business Brain.

The first product is an **AI Customer Service Employee** for online stores. This repository is a **modular monolith** organized as a pnpm monorepo.

## Project status

| Sprint | Scope | Status |
| --- | --- | --- |
| DEV-001 | Monorepo structure (apps + packages, configs, docs) | ✅ Complete |
| DEV-002 | Database foundation: Prisma schema, enums, relations | ✅ Complete |
| DEV-003 | API bootstrap (NestJS), JWT auth foundation, health, Prisma service | ✅ Complete |
| DEV-004 | Business workspace + tenant permission foundation (membership & role guards) | ✅ Complete |
| DEV-005 | Product knowledge & FAQ APIs (business-scoped, role-gated) | ✅ Complete |
| DEV-006 | Customer, conversation & message APIs (business-scoped, role-gated) | ✅ Complete |

The backend (`apps/api`) currently exposes auth, business-workspace, product-knowledge, and customer/conversation/message endpoints with multi-tenant access control. The AI layer (reply generation, memory extraction) is not yet implemented.

## Localization — Thai-First

AURA is a **Thai-first** product. Primary users are online store operators in Thailand, so the system defaults to Thai everywhere a human reads it.

| Setting | Default |
| --- | --- |
| Language | Thai (`th`) |
| Locale | `th-TH` |
| Timezone | `Asia/Bangkok` |
| Currency | `THB` |

- **User-facing UI text and AI replies default to Thai.**
- **English** is a planned **secondary** language, added later via a language switch.
- **Code, file names, variables, API fields, and database fields stay in English.**
- User-facing text will not be hardcoded into components; i18n architecture is prepared, not yet implemented.

See [`docs/03_architecture/Localization_Standard.md`](docs/03_architecture/Localization_Standard.md) for the full standard.

## Structure

```
aura-core/
├── apps/
│   ├── web/          # Next.js + TS — store owner dashboard (scaffolded later)
│   ├── admin/        # Next.js + TS — internal admin console (scaffolded later)
│   └── api/          # NestJS + TS — modular monolith backend (scaffolded later)
├── packages/
│   ├── brain/        # AI reasoning / reply generation core
│   ├── memory/       # AI Memory + Business Memory Graph
│   ├── workflow/     # Task / Approval / orchestration
│   ├── actions/      # AI Action definitions & execution
│   ├── database/     # Prisma client + schema (data layer)
│   ├── shared/       # Cross-cutting types, DTOs, utils, constants
│   └── ui/           # Shared React component library
├── docs/             # Project documentation (foundation → meeting)
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── .gitignore
```

## Tech direction

- **Frontend:** Next.js + TypeScript
- **Backend:** NestJS + TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Package manager:** pnpm
- **Architecture:** Modular Monolith

## Prerequisites

- Node.js >= 20.9.0
- pnpm >= 9 (`npm install -g pnpm`)
- PostgreSQL (for the database layer)

## Install

```bash
pnpm install
```

## Database & Environment

The data layer lives in [`packages/database`](packages/database) (Prisma + PostgreSQL).

```bash
# 1. Create your env file from the example and set DATABASE_URL
cp .env.example .env

# 2. Generate the Prisma client
pnpm --filter @aura/database db:generate

# 3. Create + apply the first migration (needs a running PostgreSQL)
pnpm --filter @aura/database db:migrate
```

`.env.example` ships the Thai-first defaults: `DEFAULT_LOCALE=th-TH`, `DEFAULT_TIMEZONE=Asia/Bangkok`, `DEFAULT_CURRENCY=THB`, `DEFAULT_LANGUAGE=TH`. Timestamps are stored in UTC; `Asia/Bangkok` is a presentation default. See [`packages/database/README.md`](packages/database/README.md) for the full schema conventions.

## Run the API

The backend ([`apps/api`](apps/api), NestJS) serves all routes under `/api/v1`.

```bash
# after db:generate + .env setup
pnpm --filter @aura/api start:dev
# -> http://localhost:3001/api/v1
```

Endpoints in this sprint: `GET /api/v1/health`, auth routes (`/auth/*`), business-workspace routes (`/businesses/*`), product-knowledge routes (`/businesses/:businessId/products/*` and `.../faqs/*`), and customer/conversation/message routes (`/businesses/:businessId/customers/*`, `.../conversations/*`, `.../conversations/:conversationId/messages`). See [`apps/api/README.md`](apps/api/README.md) for env vars, guard notes, and curl examples.

## Verify the workspace

```bash
# List every workspace pnpm recognizes
pnpm -r list --depth -1

# Run typecheck across all workspaces that define it
pnpm typecheck
```

## Intended dependency direction

`apps/*` → `packages/*` · AI packages → `database` + `shared` · `ui` → `shared`. No app-to-app dependencies.
