import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // 先测试基本的响应
    const basicTest = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      databaseUrl: process.env.DATABASE_URL ? 'configured' : 'missing'
    }

    // 尝试导入prisma
    try {
      const { prisma } = await import('@/lib/prisma')
      
      // 尝试简单的查询
      const agentCount = await prisma.agent.count()
      
      return NextResponse.json({
        success: true,
        basicTest,
        database: {
          connection: 'success',
          agentCount,
          prismaImport: 'success'
        }
      })
    } catch (prismaError) {
      return NextResponse.json({
        success: false,
        basicTest,
        database: {
          connection: 'failed',
          prismaImport: 'failed',
          error: prismaError instanceof Error ? prismaError.message : String(prismaError),
          stack: prismaError instanceof Error ? prismaError.stack : undefined
        }
      })
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}