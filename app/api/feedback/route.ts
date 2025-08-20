import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ensureDatabase } from '@/lib/db-middleware'



// POST /api/feedback - 提交反馈
export async function POST(request: NextRequest) {
  try {
    // 确保数据库已初始化
    await ensureDatabase()
    
    const body = await request.json()
    const { agentId, userName, email, score, comment } = body

    // 验证必填字段
    if (!agentId || !userName || !score) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // 验证评分范围
    if (score < 1 || score > 5) {
      return NextResponse.json(
        { error: 'Score must be between 1 and 5' },
        { status: 400 }
      )
    }

    const feedback = await prisma.agentFeedback.create({
      data: {
        agentId,
        userName,
        email: email || '',
        score,
        comment: comment || ''
      },
      include: {
        agent: true
      }
    })

    return NextResponse.json({ feedback }, { status: 201 })
  } catch (error) {
    console.error('Error creating feedback:', error)
    return NextResponse.json(
      { error: 'Failed to create feedback' },
      { status: 500 }
    )
  }
}

// GET /api/feedback - 获取反馈列表 (管理员)
export async function GET(request: NextRequest) {
  try {
    // 确保数据库已初始化
    await ensureDatabase()
    
    const { searchParams } = new URL(request.url)
    const agentId = searchParams.get('agentId')
    const minScore = searchParams.get('minScore')

    const where: any = {}

    if (agentId) {
      where.agentId = agentId
    }

    if (minScore) {
      where.score = { gte: parseInt(minScore) }
    }

    const feedback = await prisma.agentFeedback.findMany({
      where,
      include: {
        agent: true
      },
      orderBy: { createdAt: 'desc' }
    })

    // 计算统计信息
    const stats = await prisma.agentFeedback.groupBy({
      by: ['agentId'],
      _avg: { score: true },
      _count: { id: true },
      where
    })

    return NextResponse.json({ feedback, stats })
  } catch (error) {
    console.error('Error fetching feedback:', error)
    return NextResponse.json(
      { error: 'Failed to fetch feedback' },
      { status: 500 }
    )
  }
}