import { NextRequest, NextResponse } from 'next/server'
import { getAdminFromToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ensureDatabase } from '@/lib/db-middleware'

// GET /api/agents/[id] - 获取单个Agent详情
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 确保数据库已初始化
    await ensureDatabase()
    
    const agent = await prisma.agent.findUnique({
      where: { id: params.id },
      include: {
        applications: {
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        feedback: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    })

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ agent })
  } catch (error) {
    console.error('Error fetching agent:', error)
    return NextResponse.json(
      { error: 'Failed to fetch agent' },
      { status: 500 }
    )
  }
}

// PUT /api/agents/[id] - 更新Agent (管理员)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 确保数据库已初始化
    await ensureDatabase()
    
    console.log('[PUT] Started - Agent ID:', params.id)
    console.log('[PUT] Headers:', Object.fromEntries(request.headers.entries()))
    
    // 验证管理员权限
    const admin = await getAdminFromToken(request)
    console.log('[PUT] Admin auth result:', admin ? 'Authenticated' : 'Not authenticated')
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    console.log('[PUT] Request body:', JSON.stringify(body, null, 2))
    
    const { name, description, tags, manager, guideUrl, homepage, icon, enabled, themeColor, coverImage, guideContent } = body

    // 构建更新数据，只包含提供的字段
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (tags !== undefined) updateData.tags = tags
    if (manager !== undefined) updateData.manager = manager
    if (guideUrl !== undefined) updateData.guideUrl = guideUrl
    if (homepage !== undefined) updateData.homepage = homepage
    if (icon !== undefined) updateData.icon = icon
    if (enabled !== undefined) updateData.enabled = enabled
    if (themeColor !== undefined) updateData.themeColor = themeColor
    if (coverImage !== undefined) updateData.coverImage = coverImage
    if (guideContent !== undefined) updateData.guideContent = guideContent
    
    console.log('[PUT] Update data to be applied:', JSON.stringify(updateData, null, 2))

    // 先查询原始数据
    const originalAgent = await prisma.agent.findUnique({
      where: { id: params.id }
    })
    console.log('[PUT] Original agent data:', JSON.stringify(originalAgent, null, 2))
    
    if (!originalAgent) {
      console.log('[PUT] Agent not found')
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      )
    }
    
    // 执行更新
    console.log('[PUT] Executing database update...')
    const agent = await prisma.agent.update({
      where: { id: params.id },
      data: updateData
    })
    console.log('[PUT] Updated agent data:', JSON.stringify(agent, null, 2))
    
    // 验证更新是否成功
    const verifyAgent = await prisma.agent.findUnique({
      where: { id: params.id }
    })
    console.log('[PUT] Verification query result:', JSON.stringify(verifyAgent, null, 2))
    console.log('[PUT] Update successful')

    return NextResponse.json({ agent: verifyAgent })
  } catch (error) {
    console.error('[PUT] Error updating agent:', error)
    console.error('[PUT] Error stack:', error instanceof Error ? error.stack : 'No stack')
    return NextResponse.json(
      { error: 'Failed to update agent', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// DELETE /api/agents/[id] - 删除Agent (管理员)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 确保数据库已初始化
    await ensureDatabase()
    
    // 验证管理员权限
    const admin = await getAdminFromToken(request)
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    await prisma.agent.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting agent:', error)
    return NextResponse.json(
      { error: 'Failed to delete agent' },
      { status: 500 }
    )
  }
}

// OPTIONS - 处理CORS预检请求
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Allow': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}