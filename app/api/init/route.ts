import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('Starting database initialization...')
    
    // 检查管理员是否存在
    const adminCount = await prisma.admin.count()
    console.log('Current admin count:', adminCount)
    
    if (adminCount === 0) {
      console.log('Creating default admin...')
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
      console.log('Default admin created successfully')
    }

    // 检查Agent是否存在
    const agentCount = await prisma.agent.count()
    console.log('Current agent count:', agentCount)
    
    if (agentCount === 0) {
      console.log('Creating default agents...')
      await prisma.agent.createMany({
        data: [
          {
            name: 'Claude Code',
            description: 'AI编程助手，支持多种编程语言',
            tags: ['AI', 'Programming', 'Assistant'],
            manager: 'Anthropic',
            enabled: true
          },
          {
            name: 'GPT-4',
            description: '通用AI助手，支持文本生成和对话',
            tags: ['AI', 'Chat', 'General'],
            manager: 'OpenAI',
            enabled: true
          }
        ]
      })
      console.log('Default agents created successfully')
    }

    // 检查反馈按钮是否存在
    const buttonCount = await prisma.feedbackButton.count()
    console.log('Current feedback button count:', buttonCount)
    
    if (buttonCount === 0) {
      console.log('Creating default feedback buttons...')
      await prisma.feedbackButton.createMany({
        data: [
          {
            title: '产品反馈',
            description: '对产品功能的建议',
            url: 'https://forms.gle/example1',
            icon: 'message',
            color: '#1890ff',
            order: 1,
            enabled: true
          },
          {
            title: '问题反馈',
            description: '报告使用中遇到的问题',
            url: 'https://forms.gle/example2',
            icon: 'form',
            color: '#f56a00',
            order: 2,
            enabled: true
          }
        ]
      })
      console.log('Default feedback buttons created successfully')
    }

    const finalCounts = {
      admins: await prisma.admin.count(),
      agents: await prisma.agent.count(),
      feedbackButtons: await prisma.feedbackButton.count()
    }

    return NextResponse.json({
      success: true,
      message: 'Database initialization completed',
      counts: finalCounts
    })

  } catch (error) {
    console.error('Database initialization failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}