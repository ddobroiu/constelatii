import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Cu adaptorul pg, Prisma ignoră ?schema= din adresă și pune implicit „public” în fața tabelelor:
// schema (constelatii) trebuie dată adaptorului, altfel orice interogare prin modele e refuzată.
const connectionString = process.env.DATABASE_URL;
let schema: string | undefined;
try {
  schema = connectionString ? new URL(connectionString).searchParams.get("schema") || undefined : undefined;
} catch {
  schema = undefined;
}

const adapter = new PrismaPg({ connectionString }, schema ? { schema } : undefined);

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
