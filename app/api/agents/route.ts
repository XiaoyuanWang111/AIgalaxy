import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ensureDatabase, isDemonstrationMode } from '@/lib/db-middleware'
import { demoAgents } from '@/lib/demo-data'

// GET /api/agents - 获取所有启用的Agent
export async function GET(request: NextRequest) {
  try {
    console.log('[API/agents] Starting request')
    console.log('[API/agents] DATABASE_URL exists:', !!process.env.DATABASE_URL)
    
    // 确保数据库已初始化
    await ensureDatabase()
    console.log('[API/agents] Database initialized')

    // 如果是演示模式，返回演示数据
    if (isDemonstrationMode()) {
      console.log('[API/agents] Running in demo mode, returning mock data')
      
      const { searchParams } = new URL(request.url)
      const search = searchParams.get('search')
      const tag = searchParams.get('tag')
      
      let filteredAgents = demoAgents.filter(agent => agent.enabled)
      
      // 搜索过滤
      if (search) {
        const searchLower = search.toLowerCase()
        filteredAgents = filteredAgents.filter(agent =>
          agent.name.toLowerCase().includes(searchLower) ||
          agent.description.toLowerCase().includes(searchLower) ||
          agent.tags.some(t => t.toLowerCase().includes(searchLower))
        )
      }
      
      // 标签过滤
      if (tag && tag !== 'all') {
        filteredAgents = filteredAgents.filter(agent =>
          agent.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
        )
      }
      
      return NextResponse.json({ agents: filteredAgents })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const tag = searchParams.get('tag')

    const where: any = { enabled: true }

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
    
    // 如果数据库出错，切换到演示模式
    console.log('[API/agents] Database error, falling back to demo data')
    const filteredAgents = demoAgents.filter(agent => agent.enabled)
    return NextResponse.json({ agents: filteredAgents })
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