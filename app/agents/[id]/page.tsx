'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, Typography, Button, Space, Tag, Row, Col, Avatar, Statistic, Divider, Rate, Tabs, Empty, Spin, Descriptions } from 'antd'
import { ArrowLeftOutlined, UserOutlined, CalendarOutlined, StarOutlined, MessageOutlined, BookOutlined, DownOutlined, UpOutlined } from '@ant-design/icons'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { FeedbackForm } from '@/components/FeedbackForm'

const { Title, Text, Paragraph } = Typography
const { TabPane } = Tabs

interface Agent {
  id: string
  name: string
  description: string
  tags: string
  manager: string
  guideUrl?: string
  homepage?: string
  icon?: string
  createdAt: string
  applications: any[]
  feedback: any[]
}

// 获取真实Agent数据
const getAgentGuide = (agentName: string) => {
  const guides: Record<string, string> = {
    'Claude Code': `
# Claude Code 使用指南

## 📖 简介

Claude Code 是 Anthropic 开发的 AI 编程助手，专门为代码生成、调试和数据处理任务设计。

## 🚀 主要功能

### 1. 代码生成
- 支持多种编程语言
- 可以根据自然语言描述生成代码
- 提供代码优化建议

### 2. 调试协助
- 识别代码错误
- 提供修复建议
- 解释错误原因

### 3. 数据处理
- 数据清洗脚本生成
- 数据分析代码
- 可视化图表代码

## 💡 使用技巧

1. **明确描述需求**：详细描述你想要实现的功能
2. **提供上下文**：分享相关的代码片段或项目背景
3. **迭代改进**：根据输出结果进行进一步的优化请求

## 📝 示例对话

\`\`\`
用户：帮我写一个Python函数，计算列表中数字的平均值
Claude：好的，我来为您创建一个计算平均值的函数...
\`\`\`

## ⚠️ 注意事项

- 生成的代码需要测试验证
- 涉及安全性的代码需要额外审查
- 大型项目建议分步骤进行
`,
    'ChatGPT Plus': `
# ChatGPT Plus 使用指南

## 📖 简介

ChatGPT Plus 是 OpenAI 的高级版本 AI 助手，提供更快的响应速度和优先访问新功能。

## 🚀 主要功能

### 1. 文本生成
- 文章写作
- 创意写作
- 技术文档

### 2. 问答系统
- 知识问答
- 学习辅导
- 专业咨询

### 3. 代码协助
- 代码编写
- 错误调试
- 算法解释

## 💡 使用建议

- 提供清晰的问题描述
- 利用上下文对话能力
- 善用角色扮演功能
`,
    'Midjourney': `
# Midjourney 使用指南

## 📖 简介

Midjourney 是领先的 AI 图像生成工具，能够根据文本描述创建高质量的艺术作品。

## 🎨 创作流程

1. 在 Discord 中使用 /imagine 命令
2. 输入详细的图像描述
3. 等待 AI 生成初始图像
4. 使用 U 按钮放大或 V 按钮创建变体

## 🔧 参数设置

- --ar 16:9：设置宽高比
- --v 5：选择模型版本
- --stylize：调整风格化程度
`,
    'Cursor IDE': `
# Cursor IDE 使用指南

## 📖 简介

Cursor 是一款 AI 驱动的代码编辑器，提供智能代码补全和生成功能。

## ⚡ 核心功能

### 1. AI 代码补全
- 实时代码建议
- 上下文感知补全
- 多语言支持

### 2. 代码生成
- Ctrl+K 快速生成
- 自然语言转代码
- 重构建议

## 🎯 最佳实践

- 编写清晰的注释
- 使用有意义的变量名
- 保持代码结构清晰
`
  }
  
  return guides[agentName] || `# ${agentName} 使用指南\n\n暂无详细文档，敬请期待...`
}

// 反馈卡片组件
const FeedbackCard = ({ feedback }: { feedback: any }) => {
  const [expanded, setExpanded] = useState(false)
  const maxLength = 100 // 超过这个长度就显示展开按钮
  const shouldShowExpand = feedback.comment && feedback.comment.length > maxLength
  
  return (
    <Card
      size="small"
      style={{
        marginBottom: 12,
        background: '#ffffff',
        border: '1px solid #f0f0f0',
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        transition: 'all 0.3s ease'
      }}
      bodyStyle={{ padding: 16 }}
      hoverable
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0px)'
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)'
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size={12}>
        {/* 用户信息和评分 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Text strong style={{ fontSize: 14 }}>
              {feedback.userName}
            </Text>
            {feedback.email && (
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {feedback.email}
                </Text>
              </div>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <Rate disabled defaultValue={feedback.score} />
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {new Date(feedback.createdAt).toLocaleDateString()}
              </Text>
            </div>
          </div>
        </div>

        {/* 反馈内容 */}
        {feedback.comment && (
          <div>
            <Text 
              style={{ 
                fontSize: 13, 
                lineHeight: 1.6,
                display: 'block'
              }}
            >
              {shouldShowExpand && !expanded 
                ? `${feedback.comment.substring(0, maxLength)}...`
                : feedback.comment
              }
            </Text>
            
            {shouldShowExpand && (
              <Button
                type="text"
                size="small"
                icon={expanded ? <UpOutlined /> : <DownOutlined />}
                onClick={() => setExpanded(!expanded)}
                style={{
                  padding: '4px 8px',
                  height: 'auto',
                  fontSize: 12,
                  marginTop: 8
                }}
              >
                {expanded ? '收起' : '展开'}
              </Button>
            )}
          </div>
        )}
      </Space>
    </Card>
  )
}

export default function AgentDetailPage() {
  const params = useParams()
  const [agent, setAgent] = useState<Agent | null>(null)
  const [loading, setLoading] = useState(true)
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)

  useEffect(() => {
    fetchAgent()
  }, [params.id])

  const fetchAgent = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/agents/${params.id}`)
      if (!response.ok) throw new Error('Failed to fetch agent')
      const data = await response.json()
      setAgent(data.agent)
    } catch (err) {
      console.error('Failed to load agent:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    )
  }

  if (!agent) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Empty
          description="Agent 未找到"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
        <Link href="/" legacyBehavior>
          <Button type="primary" icon={<ArrowLeftOutlined />}>返回首页</Button>
        </Link>
      </div>
    )
  }

  const averageScore = agent.feedback.length > 0 
    ? (agent.feedback.reduce((sum: number, f: any) => sum + f.score, 0) / agent.feedback.length).toFixed(1)
    : 'N/A'

  return (
    <div style={{ position: 'relative', padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Frosted Glass Back Button - Left Top Corner */}
      <Link href="/" legacyBehavior>
        <button
          style={{
            position: 'fixed',
            top: '20px',
            left: '20px',
            width: '48px',
            height: '48px',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '12px',
            cursor: 'pointer',
            zIndex: 1000,
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(0, 0, 0, 0.7)',
            fontSize: '18px',
            fontWeight: 'bold'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'
            e.currentTarget.style.transform = 'scale(1.05)'
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)'
          }}
          title="返回首页"
        >
          ←
        </button>
      </Link>

      {/* Header */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[24, 24]} align="middle">
          <Col flex="none">
            <Avatar
              size={120}
              style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontSize: 48
              }}
            >
              {agent.icon || '🤖'}
            </Avatar>
          </Col>
          <Col flex="auto">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Title level={1} style={{ margin: 0 }}>
                {agent.name}
              </Title>
              <Paragraph style={{ fontSize: 16, margin: 0 }}>
                {agent.description}
              </Paragraph>
              
              <Space size="large">
                <Space>
                  <UserOutlined />
                  <Text type="secondary">主理人: {agent.manager}</Text>
                </Space>
                <Space>
                  <CalendarOutlined />
                  <Text type="secondary">{new Date(agent.createdAt).toLocaleDateString()}</Text>
                </Space>
                <Space>
                  <StarOutlined />
                  <Text type="secondary">平均评分: {averageScore}/5.0</Text>
                </Space>
              </Space>

              <Space>
                {agent.tags.split(',').map(tag => (
                  <Tag key={tag.trim()} color="blue">{tag.trim()}</Tag>
                ))}
              </Space>

              <Button 
                type="primary" 
                size="large"
                href={agent.homepage}
                target="_blank"
                style={{ marginRight: 12 }}
              >
                访问官网
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card
            title={
              <Space>
                <BookOutlined />
                <span>使用指南</span>
              </Space>
            }
          >
            <div className="prose max-w-none">
              <ReactMarkdown>{getAgentGuide(agent.name)}</ReactMarkdown>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            {/* 添加反馈按钮 */}
            <Button 
              type="primary" 
              icon={<MessageOutlined />}
              onClick={() => setShowFeedbackForm(true)}
              style={{ width: '100%' }}
              size="large"
            >
              分享您的使用体验
            </Button>
            
            <Card
              title="使用统计"
              size="small"
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <Statistic title="申请人数" value={agent.applications.length} />
                <Statistic title="反馈数量" value={agent.feedback.length} />
                <Statistic title="平均评分" value={averageScore} suffix="/ 5.0" />
              </Space>
            </Card>

            <div>
              <Title level={4} style={{ marginBottom: 16, fontSize: 16 }}>
                用户反馈 ({agent.feedback.length})
              </Title>
              {agent.feedback.length > 0 ? (
                <div style={{ maxHeight: '600px', overflowY: 'auto', paddingRight: 8 }}>
                  {agent.feedback.map((feedback: any) => (
                    <FeedbackCard key={feedback.id} feedback={feedback} />
                  ))}
                </div>
              ) : (
                <Card style={{ textAlign: 'center', padding: '24px 16px' }}>
                  <Text type="secondary">
                    暂无用户反馈，成为第一个分享使用体验的用户吧！
                  </Text>
                </Card>
              )}
            </div>
          </Space>
        </Col>
      </Row>

      {/* 表单模态框 */}
      {showFeedbackForm && agent && (
        <FeedbackForm
          agentId={agent.id}
          agentName={agent.name}
          onClose={() => setShowFeedbackForm(false)}
        />
      )}
    </div>
  )
}