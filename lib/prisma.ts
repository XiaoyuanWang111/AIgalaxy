import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// 在 Vercel 环境中处理数据库连接
function getDatabaseUrl(): string {
  // 优先使用 DATABASE_URL
  if (process.env.DATABASE_URL) {
    console.log('Using DATABASE_URL')
    return process.env.DATABASE_URL
  }
  
  // Vercel Postgres 环境变量
  if (process.env.POSTGRES_PRISMA_URL) {
    console.log('Using POSTGRES_PRISMA_URL')
    return process.env.POSTGRES_PRISMA_URL
  }
  
  if (process.env.POSTGRES_URL) {
    console.log('Using POSTGRES_URL')
    return process.env.POSTGRES_URL
  }
  
  // Supabase 环境变量
  if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    // Supabase 数据库连接字符串需要手动构建
    console.log('Supabase environment detected but DATABASE_URL not set')
  }
  
  throw new Error(
    'Database connection string not found. Please set DATABASE_URL environment variable.'
  )
}

// 创建 Prisma 客户端
let prismaInstance: PrismaClient

try {
  const databaseUrl = getDatabaseUrl()
  
  prismaInstance = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
    datasources: {
      db: {
        url: databaseUrl
      }
    }
  })
  
  // 缓存实例
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = prismaInstance
  }
} catch (error) {
  console.error('Failed to initialize Prisma client:', error)
  throw error
}

export const prisma = prismaInstance