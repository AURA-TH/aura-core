/**
 * @aura/database
 *
 * Single source of truth for persistence. Exposes a Prisma client singleton
 * (so repeated imports don't open new connection pools in dev) plus a
 * re-export of generated Prisma types.
 *
 * No business logic lives here — data layer only.
 */

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export * from "@prisma/client";
