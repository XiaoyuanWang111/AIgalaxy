import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ensureDatabase, isDemonstrationMode } from '@/lib/db-middleware'

// POST /api/agents/[id]/click - 增加Agent点击次数
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 确保数据库已初始化
    await ensureDatabase()
    
    const agentId = params.id

    // 如果是演示模式，返回模拟的点击增加
    if (isDemonstrationMode()) {
      // 生成一个随机的点击数（模拟增加）
      const simulatedClickCount = Math.floor(Math.random() * 100) + 50
      
      return NextResponse.json({ 
        success: true, 
        clickCount: simulatedClickCount,
        mode: 'demonstration'
      })
    }

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
    
    // 数据库出错时，返回模拟点击
    const simulatedClickCount = Math.floor(Math.random() * 100) + 50
    
    return NextResponse.json({ 
      success: true, 
      clickCount: simulatedClickCount,
      mode: 'fallback'
    })
  }
}