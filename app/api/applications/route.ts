import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ensureDatabase } from '@/lib/db-middleware'

// POST /api/applications - 提交申请
export async function POST(request: NextRequest) {
  try {
    // 确保数据库已初始化
    await ensureDatabase()
    
    const body = await request.json()
    const { agentId, applicantName, email, reason } = body

    // 验证必填字段
    if (!agentId || !applicantName || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // 检查是否已经申请过
    const existingApplication = await prisma.agentApplication.findFirst({
      where: {
        agentId,
        email,
        status: { in: ['PENDING', 'APPROVED'] }
      }
    })

    if (existingApplication) {
      return NextResponse.json(
        { error: 'Application already exists for this email' },
        { status: 409 }
      )
    }

    const application = await prisma.agentApplication.create({
      data: {
        agentId,
        applicantName,
        email,
        reason: reason || '',
        status: 'PENDING'
      },
      include: {
        agent: true
      }
    })

    return NextResponse.json({ application }, { status: 201 })
  } catch (error) {
    console.error('Error creating application:', error)
    return NextResponse.json(
      { error: 'Failed to create application' },
      { status: 500 }
    )
  }
}

// GET /api/applications - 获取申请列表 (管理员)
export async function GET(request: NextRequest) {
  try {
    // 确保数据库已初始化
    await ensureDatabase()
    
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const agentId = searchParams.get('agentId')

    let where: any = {}

    if (status && status !== 'all') {
      where.status = status
    }

    if (agentId) {
      where.agentId = agentId
    }

    const applications = await prisma.agentApplication.findMany({
      where,
      include: {
        agent: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ applications })
  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
}