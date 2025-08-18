// PostgreSQL version of lib/prisma.ts
// Replace the original file with this after migration

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Note: Database initialization is no longer needed with PostgreSQL
// Tables are created through Prisma migrations
// Seed data should be handled through prisma/seed.ts or admin interface