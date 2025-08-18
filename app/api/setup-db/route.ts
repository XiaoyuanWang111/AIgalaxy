import { NextResponse } from 'next/server'

export async function POST() {
  try {
    console.log('[Setup DB] Starting database setup...')
    
    const { prisma } = await import('@/lib/prisma')
    
    // 推送数据库schema到目标数据库
    console.log('[Setup DB] Applying database schema...')
    
    // 检查并创建基本数据
    console.log('[Setup DB] Checking admin users...')
    const adminCount = await prisma.admin.count()
    
    if (adminCount === 0) {
      console.log('[Setup DB] Creating default admin user...')
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
      console.log('[Setup DB] Default admin created')
    }
    
    // 检查Agent表
    const agentCount = await prisma.agent.count()
    if (agentCount === 0) {
      console.log('[Setup DB] Creating sample agent...')
      await prisma.agent.create({
        data: {
          name: 'Claude Code',
          description: 'AI programming assistant',
          tags: ['AI', 'Programming', 'Assistant'],
          manager: 'Anthropic',
          enabled: true
        }
      })
    }
    
    // 检查反馈按钮
    const buttonCount = await prisma.feedbackButton.count()
    if (buttonCount === 0) {
      console.log('[Setup DB] Creating default feedback buttons...')
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
    }
    
    return NextResponse.json({
      success: true,
      message: 'Database setup completed',
      counts: {
        admins: await prisma.admin.count(),
        agents: await prisma.agent.count(),
        feedbackButtons: await prisma.feedbackButton.count()
      }
    })
    
  } catch (error) {
    console.error('[Setup DB] Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}