# @aura/api

Backend modular monolith built with NestJS + TypeScript. Hosts MVP domains in future sprints. All routes are served under the global prefix **`/api/v1`**.

## Boundaries

Depends on `@aura/database` and `@aura/shared`. The single deployable backend; domain modules are internal boundaries, not separate services.

## What's here (DEV-003)

- **Config** — env loading with Thai-first defaults; refuses to boot in production if `JWT_SECRET` is missing/empty/`change-me`.
- **Prisma** — `PrismaService` (extends the generated `PrismaClient` from `@aura/database`) is the single way the API accesses the database.
- **Health** — `GET /api/v1/health` with a DB connectivity ping.
- **Auth** — JWT-based register/login/me. Passwords hashed with `bcryptjs`. `passwordHash` is never returned.
- **Audit** — `AuditService` skeleton only; auth audit logging is intentionally deferred (see below).
- **Common** — global exception filter producing a consistent error envelope.

## Prerequisites

- Node.js >= 20.9.0, pnpm >= 9
- A running PostgreSQL, with the Prisma client generated:
  ```bash
  cp .env.example .env                       # set DATABASE_URL, JWT_SECRET, etc.
  pnpm install                               # from repo root
  pnpm --filter @aura/database db:generate   # generate Prisma client
  pnpm --filter @aura/database db:migrate    # create the first migration
  ```

## Run

```bash
pnpm --filter @aura/api start:dev   # watch mode
# or
pnpm --filter @aura/api build && pnpm --filter @aura/api start:prod
```

The API logs `http://localhost:3001/api/v1` on boot (port from `API_PORT`).

## Endpoints

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/v1/health` | – | Liveness + DB ping |
| POST | `/api/v1/auth/register` | – | Create user, auto-login (returns user + accessToken) |
| POST | `/api/v1/auth/login` | – | Authenticate (returns user + accessToken) |
| GET | `/api/v1/auth/me` | Bearer JWT | Current user |

## Error format

All errors use a stable envelope (success responses are plain DTOs):

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {
      "statusCode": 400,
      "path": "/api/v1/...",
      "timestamp": "2026-01-01T00:00:00.000Z"
    }
  }
}
```

Status → code mapping: 400 `BAD_REQUEST`, 401 `UNAUTHORIZED`, 403 `FORBIDDEN`, 404 `NOT_FOUND`, 409 `CONFLICT`, 422 `VALIDATION_ERROR`, 500 `INTERNAL_SERVER_ERROR`. Validation failures (from `ValidationPipe`) surface as `VALIDATION_ERROR` with `message` as a `string[]`. Stack traces are never exposed.

## Manual verification (curl)

```bash
# 1. Health
curl -s http://localhost:3001/api/v1/health

# 2. Register (auto-login: returns user + accessToken)
curl -s -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"owner@example.com","password":"password123","displayName":"Owner"}'

# 3. Login
curl -s -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"owner@example.com","password":"password123"}'

# 4. Me (replace <TOKEN> with accessToken from step 2 or 3)
curl -s http://localhost:3001/api/v1/auth/me \
  -H "Authorization: Bearer <TOKEN>"
```

## Environment

| Var | Example | Purpose |
| --- | --- | --- |
| `API_PORT` | `3001` | HTTP port |
| `JWT_SECRET` | `change-me` | JWT signing secret (must be changed in production) |
| `JWT_EXPIRES_IN` | `1h` | Access token lifetime |
| `CORS_ORIGIN` | `http://localhost:3000` | Allowed CORS origin (no wildcard default) |
| `BCRYPT_ROUNDS` | `12` | bcryptjs cost factor |
| `DATABASE_URL` | – | PostgreSQL connection string |

## Intentionally deferred

- **Auth audit logging.** `AuditLog` requires `businessId`, but auth is user-identity scoped with no business context. `AuditService.writeLog` is a no-op seam until business-scoped actions exist.
- No refresh tokens, email verification, password reset, RBAC, rate limiting, or `businessId` enforcement yet.
