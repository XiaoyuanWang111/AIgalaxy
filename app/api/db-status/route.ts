import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { prisma } = await import('@/lib/prisma')
    
    // 检查数据库表是否存在
    const tableChecks = await Promise.allSettled([
      prisma.agent.count().then(count => ({ table: 'Agent', count, status: 'exists' })),
      prisma.feedbackButton.count().then(count => ({ table: 'FeedbackButton', count, status: 'exists' })),
      prisma.danmaku.count().then(count => ({ table: 'Danmaku', count, status: 'exists' })),
      prisma.danmakuConfig.count().then(count => ({ table: 'DanmakuConfig', count, status: 'exists' })),
      prisma.admin.count().then(count => ({ table: 'Admin', count, status: 'exists' }))
    ])
    
    const results = tableChecks.map((result, index) => {
      const tables = ['Agent', 'FeedbackButton', 'Danmaku', 'DanmakuConfig', 'Admin']
      if (result.status === 'fulfilled') {
        return result.value
      } else {
        return {
          table: tables[index],
          status: 'error',
          error: result.reason instanceof Error ? result.reason.message : String(result.reason)
        }
      }
    })
    
    return NextResponse.json({
      success: true,
      databaseUrl: process.env.DATABASE_URL?.replace(/\/[^/]+$/, '/***'),
      tables: results
    })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}