import { PrismaClient } from "@prisma/client";

import { env } from "@/env";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      env.NEXT_PUBLIC_ENVIRONMENT === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (env.NEXT_PUBLIC_ENVIRONMENT !== "production") globalForPrisma.prisma = db;
