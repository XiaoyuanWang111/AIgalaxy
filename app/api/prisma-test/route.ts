import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('Starting Prisma test...')
    
    // 检查环境变量
    const databaseUrl = process.env.DATABASE_URL
    console.log('DATABASE_URL:', databaseUrl)
    
    if (!databaseUrl) {
      return NextResponse.json({
        error: 'DATABASE_URL environment variable not found',
        env: process.env.NODE_ENV
      }, { status: 500 })
    }
    
    // 尝试导入Prisma
    console.log('Importing Prisma client...')
    const { prisma } = await import('@/lib/prisma')
    console.log('Prisma client imported successfully')
    
    // 尝试连接数据库
    console.log('Connecting to database...')
    await prisma.$connect()
    console.log('Database connected successfully')
    
    // 尝试简单查询
    console.log('Testing simple query...')
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('Query result:', result)
    
    return NextResponse.json({
      success: true,
      message: 'Prisma test passed',
      databaseUrl: databaseUrl?.replace(/\/[^/]+$/, '/***'), // 隐藏敏感信息
      result
    })
    
  } catch (error) {
    console.error('Prisma test failed:', error)
    
    return NextResponse.json({
      error: 'Prisma test failed',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      databaseUrl: process.env.DATABASE_URL?.replace(/\/[^/]+$/, '/***')
    }, { status: 500 })
  }
}