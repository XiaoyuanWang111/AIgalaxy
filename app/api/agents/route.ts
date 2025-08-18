import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ensureDatabase } from '@/lib/db-middleware'

// GET /api/agents - 获取所有启用的Agent
export async function GET(request: NextRequest) {
  try {
    console.log('[API/agents] Starting request')
    console.log('[API/agents] DATABASE_URL exists:', !!process.env.DATABASE_URL)
    
    // 确保数据库已初始化
    await ensureDatabase()
    console.log('[API/agents] Database initialized')

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const tag = searchParams.get('tag')

    let where: any = { enabled: true }

    // Check if we're using SQLite (file: URL)
    const isSQLite = process.env.DATABASE_URL?.startsWith('file:')
    
    // 搜索过滤
    if (search) {
      if (isSQLite) {
        // SQLite doesn't support array operations, use LIKE on string
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { tags: { contains: search, mode: 'insensitive' } }
        ]
      } else {
        // PostgreSQL array operations
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { tags: { hasSome: [search] } }
        ]
      }
    }

    // 标签过滤
    if (tag && tag !== 'all') {
      if (isSQLite) {
        // For SQLite, use contains on the string representation
        where.tags = { contains: tag }
      } else {
        // PostgreSQL array operation
        where.tags = { has: tag }
      }
    }

    console.log('[API/agents] Query where clause:', JSON.stringify(where))
    
    const agents = await prisma.agent.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })
    
    console.log(`[API/agents] Found ${agents.length} agents`)

    return NextResponse.json({ agents })
  } catch (error) {
    console.error('[API/agents] Detailed error:', error)
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('P2023') || error.message.includes('hasSome')) {
        // This is likely a PostgreSQL array operation on SQLite
        console.error('[API/agents] Database type mismatch - PostgreSQL array operations on SQLite?')
        return NextResponse.json(
          { 
            error: 'Database configuration error', 
            details: 'Array operations not supported on current database',
            hint: 'Check DATABASE_URL configuration'
          },
          { status: 500 }
        )
      }
      
      return NextResponse.json(
        { 
          error: 'Failed to fetch agents', 
          details: error.message 
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch agents' },
      { status: 500 }
    )
  }
}

// POST /api/agents - 创建新Agent (管理员)
export async function POST(request: NextRequest) {
  try {
    // 确保数据库已初始化
    await ensureDatabase()
    
    const body = await request.json()
    const { name, description, tags, manager, guideUrl, homepage, icon, themeColor, coverImage, guideContent, enabled } = body

    const agent = await prisma.agent.create({
      data: {
        name,
        description,
        tags,
        manager,
        guideUrl,
        homepage,
        icon,
        themeColor: themeColor || '#FFFFFF',
        coverImage,
        guideContent,
        enabled: enabled !== undefined ? enabled : true
      }
    })

    return NextResponse.json({ agent }, { status: 201 })
  } catch (error) {
    console.error('Error creating agent:', error)
    return NextResponse.json(
      { error: 'Failed to create agent' },
      { status: 500 }
    )
  }
}