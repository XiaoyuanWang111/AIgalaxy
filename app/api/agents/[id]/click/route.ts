import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ensureDatabase } from '@/lib/db-middleware'

// POST /api/agents/[id]/click - 增加Agent点击次数
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 确保数据库已初始化
    await ensureDatabase()
    
    const agentId = params.id

    // 增加点击次数
    const updatedAgent = await prisma.agent.update({
      where: { id: agentId },
      data: {
        clickCount: {
          increment: 1
        }
      }
    })

    return NextResponse.json({ 
      success: true, 
      clickCount: updatedAgent.clickCount 
    })
  } catch (error) {
    console.error('Error updating click count:', error)
    return NextResponse.json(
      { error: 'Failed to update click count' },
      { status: 500 }
    )
  }
}