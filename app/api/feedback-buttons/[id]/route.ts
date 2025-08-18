import { NextRequest, NextResponse } from 'next/server'
import { getAdminFromToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ensureDatabase } from '@/lib/db-middleware'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 确保数据库已初始化
    await ensureDatabase()
    
    const admin = await getAdminFromToken(request)
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, description, url, icon, color, order, enabled } = body

    const button = await prisma.feedbackButton.update({
      where: { id: params.id },
      data: {
        title,
        description,
        url,
        icon,
        color,
        order: parseInt(order) || 0,
        enabled: Boolean(enabled)
      }
    })

    return NextResponse.json({ button })
  } catch (error) {
    console.error('Failed to update feedback button:', error)
    return NextResponse.json(
      { error: 'Failed to update feedback button' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 确保数据库已初始化
    await ensureDatabase()
    
    const admin = await getAdminFromToken(request)
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await prisma.feedbackButton.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete feedback button:', error)
    return NextResponse.json(
      { error: 'Failed to delete feedback button' },
      { status: 500 }
    )
  }
}