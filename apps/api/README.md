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

### Business workspace (DEV-004)

All business endpoints require a Bearer JWT. Routes with `:businessId` are additionally protected by `BusinessAccessGuard` (membership check).

| Method | Path | Guards | Description |
| --- | --- | --- | --- |
| POST | `/api/v1/businesses` | JWT | Create a business; caller becomes `OWNER` (transactional) |
| GET | `/api/v1/businesses` | JWT | List businesses the caller is a (non-deleted) member of |
| GET | `/api/v1/businesses/:businessId` | JWT + Access | Get one business + caller's role |
| PATCH | `/api/v1/businesses/:businessId` | JWT + Access + Roles(OWNER, ADMIN) | Update business profile |
| GET | `/api/v1/businesses/:businessId/members` | JWT + Access | List non-deleted members |

**Guards & tenancy:**
- `BusinessAccessGuard` runs after `JwtAuthGuard`, reads `:businessId`, confirms the caller is a non-deleted member of a non-deleted business, and attaches `{ businessId, userId, role }` to the request. Non-members (or missing/deleted businesses) get **404** — identical responses prevent business enumeration.
- `BusinessRolesGuard` reads `@Roles(...)`, requires the access guard's context, **fails closed** if context is missing, and returns **403** when the member's role isn't allowed. Guard order is `JwtAuthGuard, BusinessAccessGuard, BusinessRolesGuard`.
- `@CurrentBusiness()` exposes the resolved membership context to handlers.

**Thai-first creation defaults:** `locale=th-TH`, `timezone=Asia/Bangkok`, `currency=THB`, `language=TH` — applied unless the create DTO overrides them (validated). `slug` is optional; lowercase letters, numbers, and hyphens only.

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

# 5. Create a business (caller becomes OWNER)
curl -s -X POST http://localhost:3001/api/v1/businesses \
  -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" \
  -d '{"name":"ร้านตัวอย่าง","businessType":"online_store"}'

# 6. List my businesses
curl -s http://localhost:3001/api/v1/businesses \
  -H "Authorization: Bearer <TOKEN>"

# 7. Get one business (member only; non-members get 404)
curl -s http://localhost:3001/api/v1/businesses/<BUSINESS_ID> \
  -H "Authorization: Bearer <TOKEN>"

# 8. Update business (OWNER/ADMIN only; others get 403)
curl -s -X PATCH http://localhost:3001/api/v1/businesses/<BUSINESS_ID> \
  -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" \
  -d '{"toneOfVoice":"friendly","description":"ร้านขายของออนไลน์"}'

# 9. List members
curl -s http://localhost:3001/api/v1/businesses/<BUSINESS_ID>/members \
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

- **Audit logging is now active for business-scoped actions** (`business.created`, `business.updated`, `business.member.owner_created`). Writes are best-effort: a logging failure is recorded server-side but never fails the user action.
- No team invitation workflow/emails, no add/remove/role-change member endpoints, no business deletion or ownership transfer.
- No refresh tokens, email verification, password reset, rate limiting, or per-resource RBAC beyond the membership + role guards.
