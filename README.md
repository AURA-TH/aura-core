# aura-core

**AURA Intelligence Platform** — an AI-Native Business Brain.

The first product is an **AI Customer Service Employee** for online stores. This repository is a **modular monolith** organized as a pnpm monorepo.

> Sprint DEV-001 scope: initial monorepo structure only. No framework scaffolding, no database schema, no business logic yet.

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

## Install

```bash
pnpm install
```

## Verify the workspace

```bash
# List every workspace pnpm recognizes
pnpm -r list --depth -1

# Run typecheck across all workspaces that define it
pnpm typecheck
```

## Intended dependency direction

`apps/*` → `packages/*` · AI packages → `database` + `shared` · `ui` → `shared`. No app-to-app dependencies.
