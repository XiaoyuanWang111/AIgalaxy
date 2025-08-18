import { prisma } from './prisma'

// 数据库初始化标记，避免重复初始化
let isInitialized = false

export async function ensureDatabase(): Promise<void> {
  if (isInitialized) {
    return
  }

  try {
    console.log('=== Starting database seeding ===')
    
    // 检查并插入初始数据
    await seedInitialData()

    isInitialized = true
    console.log('=== Database seeding completed ===')

  } catch (error) {
    console.error('Database seeding failed:', error)
    // Don't throw error to prevent breaking the application
  }
}

async function seedInitialData(): Promise<void> {
  try {
    // 创建默认管理员
    const adminCount = await prisma.admin.count()
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
      console.log('Default admin created')
    }

    // 创建默认Agent  
    const agentCount = await prisma.agent.count()
    if (agentCount === 0) {
      console.log('Creating default agents...')
      await prisma.agent.create({
        data: {
          name: 'Claude Code',
          description: 'AI编程助手，支持多种编程语言',
          tags: ['AI', 'Programming', 'Assistant'],
          manager: 'Anthropic',
          enabled: true
        }
      })
      
      await prisma.agent.create({
        data: {
          name: 'GPT-4',
          description: '通用AI助手，支持文本生成和对话',
          tags: ['AI', 'Chat', 'General'],
          manager: 'OpenAI',
          enabled: true
        }
      })
      console.log('Default agents created')
    }

    // 创建默认反馈按钮
    const buttonCount = await prisma.feedbackButton.count()
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
      console.log('Default feedback buttons created')
    }

  } catch (error) {
    console.error('Failed to seed initial data:', error)
    // Don't throw error to prevent breaking the application
  }
}