// 数据库回退处理
export const dbFallback = {
  agents: [
    {
      id: '1',
      name: 'Claude Code',
      description: 'AI编程助手，支持多种编程语言',
      tags: 'AI,Programming,Assistant',
      manager: 'Anthropic',
      enabled: true,
      clickCount: 100,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2', 
      name: 'GPT-4',
      description: '通用AI助手，支持文本生成和对话',
      tags: 'AI,Chat,General',
      manager: 'OpenAI',
      enabled: true,
      clickCount: 200,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  feedbackButtons: [
    {
      id: '1',
      title: '产品反馈',
      description: '对产品功能的建议',
      url: 'https://forms.gle/example1',
      icon: 'message',
      color: '#1890ff',
      order: 1,
      enabled: true
    }
  ],
  danmaku: [],
  admins: []
}