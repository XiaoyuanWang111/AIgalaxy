import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // 在Vercel环境中初始化数据库
    const { prisma } = await import('@/lib/prisma')
    
    // 检查数据库连接
    await prisma.$connect()
    
    // 尝试查询一个简单的表
    const agentCount = await prisma.agent.count()
    
    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully',
      agentCount,
      environment: process.env.NODE_ENV,
      databaseUrl: process.env.DATABASE_URL
    })
  } catch (error) {
    console.error('Database initialization failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}