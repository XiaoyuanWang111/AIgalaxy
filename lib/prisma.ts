import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// 在 Vercel 环境中处理数据库连接
function getDatabaseUrl(): string {
  // 优先使用 DATABASE_URL
  if (process.env.DATABASE_URL) {
    // 清理可能的空白字符
    const cleanUrl = process.env.DATABASE_URL.trim()
    
    // 检查是否有未编码的特殊字符
    if (cleanUrl.includes('#') && !cleanUrl.includes('%23')) {
      console.warn('WARNING: Unencoded # character found in DATABASE_URL')
      console.warn('Replace # with %23 in your password')
    }
    
    // 检查基本格式
    if (!cleanUrl.startsWith('postgresql://') && !cleanUrl.startsWith('postgres://')) {
      throw new Error('DATABASE_URL must start with postgresql:// or postgres://')
    }
    
    console.log('Using DATABASE_URL (length: ' + cleanUrl.length + ')')
    return cleanUrl
  }
  
  // Vercel Postgres 环境变量
  if (process.env.POSTGRES_PRISMA_URL) {
    const cleanUrl = process.env.POSTGRES_PRISMA_URL.trim()
    console.log('Using POSTGRES_PRISMA_URL')
    return cleanUrl
  }
  
  if (process.env.POSTGRES_URL) {
    const cleanUrl = process.env.POSTGRES_URL.trim()
    console.log('Using POSTGRES_URL')
    return cleanUrl
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