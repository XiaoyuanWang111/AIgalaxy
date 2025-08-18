import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // 检查是否有密钥保护（可选）
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')
    
    // 简单的密钥保护，防止随意调用
    if (key !== 'init-db-2025') {
      return NextResponse.json(
        { error: 'Invalid key' },
        { status: 401 }
      )
    }

    console.log('Starting database initialization...')
    
    // 测试连接
    await prisma.$queryRaw`SELECT 1`
    console.log('Database connection successful')

    // 检查表是否存在
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    ` as Array<{table_name: string}>

    console.log('Existing tables:', tables.map(t => t.table_name))

    // 初始化数据
    let results = {
      connection: 'success',
      tables: tables.map(t => t.table_name),
      initialization: {} as any
    }

    // 检查并创建默认管理员
    try {
      const adminCount = await prisma.admin.count()
      if (adminCount === 0) {
        const bcrypt = await import('bcryptjs')
        const hashedPassword = await bcrypt.hash('admin123', 10)
        
        await prisma.admin.create({
          data: {
            email: 'admin@example.com',
            password: hashedPassword,
            name: 'System Admin',
            role: 'SUPER_ADMIN',
            canChangePassword: true,
            canManageAdmins: true
          }
        })
        results.initialization.admin = 'Created default admin'
      } else {
        results.initialization.admin = `Found ${adminCount} admins`
      }
    } catch (error) {
      results.initialization.admin = `Error: ${error instanceof Error ? error.message : 'Unknown'}`
    }

    // 检查并创建默认数据
    try {
      const agentCount = await prisma.agent.count()
      results.initialization.agents = `Found ${agentCount} agents`
    } catch (error) {
      results.initialization.agents = `Error: ${error instanceof Error ? error.message : 'Unknown'}`
    }

    // 检查弹幕配置
    try {
      const configCount = await prisma.danmakuConfig.count()
      if (configCount === 0) {
        await prisma.danmakuConfig.create({
          data: {
            enabled: true,
            maxLength: 20,
            playSpeed: 1.0,
            batchSize: 10
          }
        })
        results.initialization.danmakuConfig = 'Created default config'
      } else {
        results.initialization.danmakuConfig = `Found ${configCount} configs`
      }
    } catch (error) {
      results.initialization.danmakuConfig = `Error: ${error instanceof Error ? error.message : 'Unknown'}`
    }

    return NextResponse.json({
      success: true,
      ...results,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Database initialization error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}