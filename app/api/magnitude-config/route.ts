import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ensureDatabase } from '@/lib/db-middleware'

// GET - 获取所有星等配置
export async function GET() {
  try {
    // 确保数据库已初始化
    await ensureDatabase()
    
    const configs = await prisma.starMagnitudeConfig.findMany({
      where: { isEnabled: true },
      orderBy: { magnitude: 'asc' }
    })
    
    return NextResponse.json({
      success: true,
      data: configs
    })
  } catch (error) {
    console.error('Error fetching magnitude configs:', error)
    return NextResponse.json(
      { success: false, message: '获取配置失败' },
      { status: 500 }
    )
  }
}

// POST - 创建或更新星等配置
export async function POST(request: NextRequest) {
  try {
    // 确保数据库已初始化
    await ensureDatabase()
    
    const body = await request.json()
    const { magnitude, minClicks, maxClicks, size, brightness, glow, color, label, description } = body

    if (!magnitude || minClicks === undefined || size === undefined || brightness === undefined) {
      return NextResponse.json(
        { success: false, message: '缺少必要参数' },
        { status: 400 }
      )
    }

    const config = await prisma.starMagnitudeConfig.upsert({
      where: { magnitude },
      update: {
        minClicks,
        maxClicks,
        size: parseFloat(size),
        brightness: parseFloat(brightness),
        glow: parseFloat(glow),
        color,
        label,
        description
      },
      create: {
        magnitude,
        minClicks,
        maxClicks,
        size: parseFloat(size),
        brightness: parseFloat(brightness),
        glow: parseFloat(glow),
        color,
        label,
        description,
        orderIndex: magnitude
      }
    })

    return NextResponse.json({
      success: true,
      data: config
    })
  } catch (error) {
    console.error('Error saving magnitude config:', error)
    return NextResponse.json(
      { success: false, message: '保存配置失败' },
      { status: 500 }
    )
  }
}