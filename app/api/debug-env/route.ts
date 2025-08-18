import { NextResponse } from 'next/server'

export async function GET() {
  // 只在开发环境显示敏感信息
  const isDev = process.env.NODE_ENV === 'development'
  
  const envVars = {
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
    // 检查数据库相关的环境变量是否存在
    DATABASE_URL: process.env.DATABASE_URL ? 
      (isDev ? process.env.DATABASE_URL.substring(0, 30) + '...' : '✓ Set') : 
      '❌ Not set',
    POSTGRES_URL: process.env.POSTGRES_URL ? '✓ Set' : '❌ Not set',
    POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL ? '✓ Set' : '❌ Not set',
    POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING ? '✓ Set' : '❌ Not set',
    // 其他 Supabase 变量
    SUPABASE_URL: process.env.SUPABASE_URL ? '✓ Set' : '❌ Not set',
  }

  // 尝试连接数据库
  let dbStatus = 'Not tested'
  try {
    const { prisma } = await import('@/lib/prisma')
    await prisma.$queryRaw`SELECT 1`
    dbStatus = '✓ Connected'
  } catch (error) {
    dbStatus = `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`
  }

  return NextResponse.json({
    environment: envVars,
    database: {
      status: dbStatus
    },
    timestamp: new Date().toISOString()
  })
}