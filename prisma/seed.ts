import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // 清空现有数据（忽略表不存在的错误）
  try {
    await prisma.agentFeedback.deleteMany()
  } catch (e) {
    console.log('AgentFeedback table does not exist, skipping...')
  }
  
  try {
    await prisma.agentApplication.deleteMany()
  } catch (e) {
    console.log('AgentApplication table does not exist, skipping...')
  }
  
  try {
    await prisma.agent.deleteMany()
  } catch (e) {
    console.log('Agent table does not exist, skipping...')
  }
  
  try {
    await prisma.admin.deleteMany()
  } catch (e) {
    console.log('Admin table does not exist, skipping...')
  }
  
  try {
    await prisma.feedbackConfig.deleteMany()
  } catch (e) {
    console.log('FeedbackConfig table does not exist, skipping...')
  }
  
  try {
    await prisma.feedbackButton.deleteMany()
  } catch (e) {
    console.log('FeedbackButton table does not exist, skipping...')
  }

  // 创建管理员账号
  const hashedPassword = await bcrypt.hash('miracleplus666,.', 10)
  await prisma.admin.create({
    data: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: '超级管理员',
      role: 'SUPER_ADMIN',
      canChangePassword: true,
      canManageAdmins: true
    }
  })

  // 创建反馈配置
  await prisma.feedbackConfig.create({
    data: {
      productFeedbackUrl: 'https://docs.google.com/forms/d/e/example/viewform',
      platformFeedbackUrl: 'https://docs.google.com/forms/d/e/example2/viewform'
    }
  })

  // 创建初始Agent数据
  const agents = [
    {
      name: 'Claude Code',
      description: '用于代码生成、调试、数据处理任务，支持多轮交互',
      tags: ['编程', '调试', 'Agent编排'],
      manager: '张三',
      guideUrl: '/guides/claude-code',
      homepage: 'https://claude.ai',
      icon: '🤖',
      coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop',
      guideContent: '# Claude Code 使用指南\n\n## 📖 简介\n\nClaude Code 是 Anthropic 开发的 AI 编程助手，专门为代码生成、调试和数据处理任务设计。\n\n## 🚀 主要功能\n\n### 1. 代码生成\n- 支持多种编程语言\n- 可以根据自然语言描述生成代码\n- 提供代码优化建议\n\n### 2. 调试协助\n- 识别代码错误\n- 提供修复建议\n- 解释错误原因\n\n### 3. 数据处理\n- 数据清洗脚本生成\n- 数据分析代码\n- 可视化图表代码\n\n## 💡 使用技巧\n\n1. **明确描述需求**：详细描述你想要实现的功能\n2. **提供上下文**：分享相关的代码片段或项目背景\n3. **迭代改进**：根据输出结果进行进一步的优化请求',
      enabled: true,
    },
    {
      name: 'ChatGPT Plus',
      description: '通用AI助手，支持文本生成、问答、创作等多种任务',
      tags: ['通用', '写作', '问答'],
      manager: '李四',
      guideUrl: '/guides/chatgpt',
      homepage: 'https://chat.openai.com',
      icon: '💬',
      coverImage: 'https://images.unsplash.com/photo-1684785627128-58b4bd00450d?w=400&h=200&fit=crop',
      guideContent: '# ChatGPT Plus 使用指南\n\n## 📖 简介\n\nChatGPT Plus 是 OpenAI 的高级版本 AI 助手，提供更快的响应速度和优先访问新功能。\n\n## 🚀 主要功能\n\n### 1. 文本生成\n- 文章写作\n- 创意写作\n- 技术文档\n\n### 2. 问答系统\n- 知识问答\n- 学习辅导\n- 专业咨询\n\n### 3. 代码协助\n- 代码编写\n- 错误调试\n- 算法解释',
      enabled: true,
    },
    {
      name: 'Midjourney',
      description: 'AI图像生成工具，创建高质量的艺术作品和设计',
      tags: ['设计', '图像生成', '艺术'],
      manager: '王五',
      guideUrl: '/guides/midjourney',
      homepage: 'https://midjourney.com',
      icon: '🎨',
      coverImage: 'https://images.unsplash.com/photo-1688496019313-d4dc472fa5c4?w=400&h=200&fit=crop',
      guideContent: '# Midjourney 使用指南\n\n## 📖 简介\n\nMidjourney 是领先的 AI 图像生成工具，能够根据文本描述创建高质量的艺术作品。\n\n## 🎨 创作流程\n\n1. 在 Discord 中使用 /imagine 命令\n2. 输入详细的图像描述\n3. 等待 AI 生成初始图像\n4. 使用 U 按钮放大或 V 按钮创建变体\n\n## 🔧 参数设置\n\n- --ar 16:9：设置宽高比\n- --v 5：选择模型版本\n- --stylize：调整风格化程度',
      enabled: true,
    },
    {
      name: 'Cursor IDE',
      description: 'AI驱动的代码编辑器，提供智能补全和代码生成',
      tags: ['编程', 'IDE', '代码补全'],
      manager: '赵六',
      guideUrl: '/guides/cursor',
      homepage: 'https://cursor.sh',
      icon: '⚡',
      coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop',
      guideContent: '# Cursor IDE 使用指南\n\n## 📖 简介\n\nCursor 是一款 AI 驱动的代码编辑器，提供智能代码补全和生成功能。\n\n## ⚡ 核心功能\n\n### 1. AI 代码补全\n- 实时代码建议\n- 上下文感知补全\n- 多语言支持\n\n### 2. 代码生成\n- Ctrl+K 快速生成\n- 自然语言转代码\n- 重构建议\n\n## 🎯 最佳实践\n\n- 编写清晰的注释\n- 使用有意义的变量名\n- 保持代码结构清晰',
      enabled: true,
    },
    {
      name: 'Perplexity AI',
      description: 'AI搜索引擎，提供准确的信息检索和答案生成',
      tags: ['搜索', '研究', '信息获取'],
      manager: '钱七',
      guideUrl: '/guides/perplexity',
      homepage: 'https://perplexity.ai',
      icon: '🔍',
      coverImage: 'https://images.unsplash.com/photo-1677442135136-760c813028c0?w=400&h=200&fit=crop',
      guideContent: '# Perplexity AI 使用指南\n\n## 📖 简介\n\nPerplexity AI 是新一代 AI 搜索引擎，结合传统搜索和 AI 对话能力。\n\n## 🔍 搜索功能\n\n- 自然语言查询\n- 实时信息获取\n- 引用来源显示\n\n## 📊 使用场景\n\n- 研究资料收集\n- 事实核查\n- 学习新知识',
      enabled: true,
    },
    {
      name: 'Notion AI',
      description: '集成在Notion中的AI助手，帮助写作、总结和头脑风暴',
      tags: ['写作', '笔记', '知识管理'],
      manager: '孙八',
      guideUrl: '/guides/notion-ai',
      homepage: 'https://notion.so',
      icon: '📝',
      coverImage: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=200&fit=crop',
      guideContent: '# Notion AI 使用指南\n\n## 📖 简介\n\nNotion AI 集成在 Notion 工作空间中的 AI 助手，提供写作、总结、翻译等功能。\n\n## ✨ 主要功能\n\n### 1. 写作协助\n- 内容生成\n- 语法检查\n- 风格调整\n\n### 2. 总结提炼\n- 长文总结\n- 要点提取\n- 会议纪要\n\n### 3. 头脑风暴\n- 创意生成\n- 项目规划\n- 问题解决',
      enabled: true,
    }
  ]

  for (const agent of agents) {
    await prisma.agent.create({
      data: agent,
    })
  }

  // 创建默认反馈按钮
  await prisma.feedbackButton.createMany({
    data: [
      {
        title: 'AI产品反馈',
        description: '对具体AI工具的使用反馈',
        url: 'https://docs.google.com/forms/d/e/example/viewform',
        icon: 'message',
        color: '#1890ff',
        order: 1,
        enabled: true
      },
      {
        title: '平台体验反馈',
        description: '对体验台平台的建议',
        url: 'https://docs.google.com/forms/d/e/example2/viewform',
        icon: 'form',
        color: '#52c41a',
        order: 2,
        enabled: true
      }
    ]
  })

  // 创建默认星等配置（忽略已存在的数据）
  try {
    await prisma.starMagnitudeConfig.deleteMany()
  } catch (e) {
    console.log('StarMagnitudeConfig table does not exist, skipping...')
  }
  
  await prisma.starMagnitudeConfig.createMany({
    data: [
      {
        magnitude: 1,
        minClicks: 1000,
        maxClicks: null,
        size: 8,
        brightness: 1.0,
        glow: 20,
        color: '#FFD700',
        label: '超亮星',
        description: '最受欢迎的明星，点击1000+',
        orderIndex: 1
      },
      {
        magnitude: 2,
        minClicks: 500,
        maxClicks: 999,
        size: 6,
        brightness: 0.9,
        glow: 16,
        color: '#FFA500',
        label: '一等星',
        description: '非常受欢迎的星星，点击500-999',
        orderIndex: 2
      },
      {
        magnitude: 3,
        minClicks: 200,
        maxClicks: 499,
        size: 5,
        brightness: 0.8,
        glow: 12,
        color: '#FF8C00',
        label: '二等星',
        description: '受欢迎的星星，点击200-499',
        orderIndex: 3
      },
      {
        magnitude: 4,
        minClicks: 100,
        maxClicks: 199,
        size: 4,
        brightness: 0.7,
        glow: 10,
        color: '#FFFF00',
        label: '三等星',
        description: '中等亮度星星，点击100-199',
        orderIndex: 4
      },
      {
        magnitude: 5,
        minClicks: 50,
        maxClicks: 99,
        size: 3.5,
        brightness: 0.6,
        glow: 8,
        color: '#FFFFFF',
        label: '四等星',
        description: '普通亮度星星，点击50-99',
        orderIndex: 5
      },
      {
        magnitude: 6,
        minClicks: 20,
        maxClicks: 49,
        size: 3,
        brightness: 0.5,
        glow: 6,
        color: '#E6E6FA',
        label: '五等星',
        description: '较暗星星，点击20-49',
        orderIndex: 6
      },
      {
        magnitude: 7,
        minClicks: 0,
        maxClicks: 19,
        size: 2.5,
        brightness: 0.4,
        glow: 4,
        color: '#CCCCCC',
        label: '暗星',
        description: '最暗的星星，点击0-19',
        orderIndex: 7
      }
    ]
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })