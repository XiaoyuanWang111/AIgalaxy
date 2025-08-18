import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ensureDatabase } from '@/lib/db-middleware'

// 获取弹幕配置
export async function GET() {
  try {
    // 确保数据库已初始化
    await ensureDatabase()
    
    let config = await prisma.danmakuConfig.findFirst()
    
    // 如果没有配置，创建默认配置
    if (!config) {
      config = await prisma.danmakuConfig.create({
        data: {
          enabled: true,
          maxLength: 20,
          playSpeed: 1.0,
          batchSize: 10
        }
      })
    }

    return NextResponse.json({
      success: true,
      config
    })
  } catch (error) {
    console.error('获取弹幕配置失败:', error)
    return NextResponse.json(
      { success: false, message: '获取弹幕配置失败' },
      { status: 500 }
    )
  }
}

// 更新弹幕配置
export async function PUT(request: NextRequest) {
  try {
    // 确保数据库已初始化
    await ensureDatabase()
    
    const body = await request.json()
    const { enabled, maxLength, playSpeed, batchSize } = body

    let config = await prisma.danmakuConfig.findFirst()
    
    if (!config) {
      // 创建新配置
      config = await prisma.danmakuConfig.create({
        data: {
          enabled: enabled ?? true,
          maxLength: maxLength ?? 20,
          playSpeed: playSpeed ?? 1.0,
          batchSize: batchSize ?? 10
        }
      })
    } else {
      // 更新现有配置
      config = await prisma.danmakuConfig.update({
        where: { id: config.id },
        data: {
          enabled: enabled ?? config.enabled,
          maxLength: maxLength ?? config.maxLength,
          playSpeed: playSpeed ?? config.playSpeed,
          batchSize: batchSize ?? config.batchSize
        }
      })
    }

    return NextResponse.json({
      success: true,
      config
    })
  } catch (error) {
    console.error('更新弹幕配置失败:', error)
    return NextResponse.json(
      { success: false, message: '更新弹幕配置失败' },
      { status: 500 }
    )
  }
}