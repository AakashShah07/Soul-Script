/* eslint-disable @typescript-eslint/no-namespace */
import { PrismaClient } from "@prisma/client";

// Extend globalThis to include `prisma`
declare global {
  namespace NodeJS {
    interface Global {
      prisma?: PrismaClient;
    }
  }
}

// Use globalThis to store Prisma instance in development
const prismadb = globalThis.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prismadb;
}

export default prismadb;
