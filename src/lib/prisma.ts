import { PrismaClient } from "../generated/prisma";

// Prisma Client'ı singleton pattern ile oluşturuyoruz
// Bu sayede development'ta hot reload sırasında birden fazla instance oluşmaz
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
