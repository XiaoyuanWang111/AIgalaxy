import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ensureDatabase, isDemonstrationMode } from '@/lib/db-middleware'
import { demoStarMagnitudeConfig } from '@/lib/demo-data'

// GET - 获取所有星等配置
export async function GET() {
  try {
    // 确保数据库已初始化
    await ensureDatabase()
    
    // 如果是演示模式，返回演示数据
    if (isDemonstrationMode()) {
      console.log('[API/magnitude-config] Running in demo mode, returning mock data')
      return NextResponse.json({
        success: true,
        data: demoStarMagnitudeConfig
      })
    }
    
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
    
    // 数据库出错时回退到演示数据
    console.log('[API/magnitude-config] Database error, falling back to demo data')
    return NextResponse.json({
      success: true,
      data: demoStarMagnitudeConfig
    })
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