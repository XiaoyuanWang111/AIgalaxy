'use client'

import { useState, useEffect } from 'react'
import { Button, Space, message, Tooltip, Typography } from 'antd'

const { Title } = Typography
import { 
  MessageOutlined, 
  FormOutlined, 
  FileTextOutlined,
  BulbOutlined,
  CommentOutlined,
  QuestionCircleOutlined 
} from '@ant-design/icons'

interface FeedbackButton {
  id: string
  title: string
  description?: string
  url: string
  icon?: string
  color?: string
  order: number
  enabled: boolean
}

const iconMap: { [key: string]: any } = {
  'message': MessageOutlined,
  'form': FormOutlined,
  'file': FileTextOutlined,
  'bulb': BulbOutlined,
  'comment': CommentOutlined,
  'question': QuestionCircleOutlined
}

export function FeedbackButtons() {
  const [buttons, setButtons] = useState<FeedbackButton[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeedbackButtons()
  }, [])

  const fetchFeedbackButtons = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/feedback-buttons')
      const data = await response.json()
      
      // 只显示启用的按钮
      const enabledButtons = data.buttons.filter((btn: FeedbackButton) => btn.enabled)
      setButtons(enabledButtons)
    } catch (error) {
      console.error('Failed to fetch feedback buttons:', error)
      message.error('获取反馈按钮配置失败')
    } finally {
      setLoading(false)
    }
  }

  const handleButtonClick = (button: FeedbackButton) => {
    if (button.url) {
      window.open(button.url, '_blank')
    } else {
      message.warning('反馈链接未配置')
    }
  }

  const getIcon = (iconName?: string) => {
    if (!iconName) return <MessageOutlined />
    const IconComponent = iconMap[iconName] || MessageOutlined
    return <IconComponent />
  }

  if (loading) {
    return null
  }

  if (buttons.length === 0) {
    return null
  }

  return (
    <div style={{ 
      marginTop: 60,
      padding: '40px 20px',
      textAlign: 'center'
    }}>
      <Title 
        level={3} 
        style={{ 
          color: 'white', 
          marginBottom: 32,
          textShadow: '0 0 15px rgba(255, 255, 255, 0.5)'
        }}
      >
        ✨ 银河系反馈中心
      </Title>
      
      <Space size="large" wrap>
        {buttons.map((button, index) => (
          <Tooltip key={button.id} title={button.description}>
            <Button
              type={index === 0 ? 'primary' : 'default'}
              size="large"
              icon={getIcon(button.icon)}
              onClick={() => handleButtonClick(button)}
              style={{
                background: index === 0 
                  ? `linear-gradient(135deg, ${button.color}80, ${button.color}40)`
                  : 'rgba(255, 255, 255, 0.1)',
                border: `1px solid ${index === 0 ? button.color + '60' : 'rgba(255, 255, 255, 0.3)'}`,
                color: 'white',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                height: '48px',
                padding: '0 24px',
                fontWeight: 500,
                boxShadow: index === 0 
                  ? `0 8px 25px ${button.color}40`
                  : '0 8px 25px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = index === 0 
                  ? `0 12px 35px ${button.color}60`
                  : '0 12px 35px rgba(255, 255, 255, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = index === 0 
                  ? `0 8px 25px ${button.color}40`
                  : '0 8px 25px rgba(0, 0, 0, 0.3)'
              }}
            >
              {button.title}
            </Button>
          </Tooltip>
        ))}
      </Space>
    </div>
  )
}

export default FeedbackButtons