import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // 获取教程配置
    const tutorialConfig = await prisma.$queryRaw`
      SELECT * FROM tutorial_config 
      WHERE enabled = true 
      ORDER BY created_at DESC 
      LIMIT 1;
    ` as any[]

    if (tutorialConfig.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No tutorial config found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: tutorialConfig[0]
    })

  } catch (error) {
    console.error('Get tutorial config error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { miracleTutorialUrl, enabled, title, description } = body

    // 更新教程配置
    const result = await prisma.$executeRaw`
      UPDATE tutorial_config 
      SET 
        miracle_tutorial_url = ${miracleTutorialUrl},
        enabled = ${enabled},
        title = ${title},
        description = ${description},
        updated_at = CURRENT_TIMESTAMP
      WHERE id IN (
        SELECT id FROM tutorial_config 
        ORDER BY created_at DESC 
        LIMIT 1
      );
    `

    if (result === 0) {
      // 如果没有记录，则创建新记录
      await prisma.$executeRaw`
        INSERT INTO tutorial_config (miracle_tutorial_url, enabled, title, description)
        VALUES (${miracleTutorialUrl}, ${enabled}, ${title}, ${description});
      `
    }

    return NextResponse.json({
      success: true,
      message: 'Tutorial config updated successfully'
    })

  } catch (error) {
    console.error('Update tutorial config error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}