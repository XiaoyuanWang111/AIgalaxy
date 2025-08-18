import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ensureDatabase } from '@/lib/db-middleware'

// GET /api/admin/agents - 获取所有Agent（包括禁用的）- 管理员专用
export async function GET(request: NextRequest) {
  try {
    // 确保数据库已初始化
    await ensureDatabase()
    
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const tag = searchParams.get('tag')

    let where: any = {} // 不过滤enabled状态，获取所有agents

    // 搜索过滤
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: [search] } }
      ]
    }

    // 标签过滤
    if (tag && tag !== 'all') {
      where.tags = { has: tag }
    }

    const agents = await prisma.agent.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ agents })
  } catch (error) {
    console.error('Error fetching agents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch agents' },
      { status: 500 }
    )
  }
}