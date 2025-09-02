import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isDemonstrationMode } from '@/lib/db-middleware'

export async function GET() {
  try {
    // 如果是演示模式，返回健康状态
    if (isDemonstrationMode()) {
      return NextResponse.json({
        status: 'healthy',
        database: 'demo-mode',
        mode: 'demonstration',
        timestamp: new Date().toISOString()
      })
    }

    // 测试数据库连接
    await prisma.$queryRaw`SELECT 1`
    
    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      mode: 'production',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
      mode: 'error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}