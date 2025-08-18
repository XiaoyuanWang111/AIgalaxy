import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ensureDatabase } from '@/lib/db-middleware'

// DELETE - 删除星等配置
export async function DELETE(
  request: NextRequest,
  { params }: { params: { magnitude: string } }
) {
  try {
    // 确保数据库已初始化
    await ensureDatabase()
    
    const magnitude = parseInt(params.magnitude)
    
    if (isNaN(magnitude)) {
      return NextResponse.json(
        { success: false, message: '无效的星等值' },
        { status: 400 }
      )
    }

    await prisma.starMagnitudeConfig.delete({
      where: { magnitude }
    })

    return NextResponse.json({
      success: true,
      message: '删除成功'
    })
  } catch (error) {
    console.error('Error deleting magnitude config:', error)
    return NextResponse.json(
      { success: false, message: '删除配置失败' },
      { status: 500 }
    )
  }
}