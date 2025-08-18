'use client'

import React from 'react'
import { Card, Button, Typography, Space, Tag } from 'antd'
import { ToolOutlined, HomeOutlined, CloseOutlined } from '@ant-design/icons'
import Link from 'next/link'

const { Title, Paragraph, Text } = Typography

interface Agent {
  id: string
  name: string
  description: string
  tags: string
  manager: string
  homepage?: string
  icon?: string
  enabled: boolean
}

interface PlanetInfoPanelProps {
  agent: Agent | null
  onClose: () => void
}

export const PlanetInfoPanel: React.FC<PlanetInfoPanelProps> = ({ agent, onClose }) => {
  if (!agent) return null

  const tags = agent.tags.split(',').map(tag => tag.trim()).filter(Boolean)

  return (
    <div style={{
      position: 'fixed',
      right: '20px',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 200,
      width: '380px',
      maxHeight: '80vh',
      overflow: 'auto'
    }}>
      <Card
        style={{
          background: 'rgba(0, 5, 15, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '16px',
          color: 'white',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
        }}
        actions={[
          <Link key="detail" href={`/agents/${agent.id}`}>
            <Button 
              type="primary" 
              icon={<ToolOutlined />}
              style={{
                background: 'linear-gradient(45deg, #1890ff, #36cfc9)',
                border: 'none',
                borderRadius: '8px'
              }}
            >
              深入探索
            </Button>
          </Link>,
          agent.homepage && (
            <a key="homepage" href={agent.homepage} target="_blank" rel="noopener noreferrer">
              <Button 
                icon={<HomeOutlined />}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  borderRadius: '8px'
                }}
              >
                访问主页
              </Button>
            </a>
          )
        ].filter(Boolean)}
      >
        {/* 关闭按钮 */}
        <Button
          icon={<CloseOutlined />}
          onClick={onClose}
          size="small"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
            zIndex: 1
          }}
        />

        {/* 行星标题 */}
        <div style={{ marginBottom: '20px' }}>
          <Title 
            level={3} 
            style={{ 
              color: 'white', 
              margin: 0,
              background: 'linear-gradient(45deg, #ffffff, #a8e6cf)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            🪐 {agent.name}
          </Title>
          <Text 
            style={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '14px',
              display: 'block',
              marginTop: '8px'
            }}
          >
            👨‍🚀 行星主理人: {agent.manager}
          </Text>
        </div>

        {/* 行星描述 */}
        <div style={{ marginBottom: '20px' }}>
          <Title level={5} style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '10px' }}>
            🌍 行星简介
          </Title>
          <Paragraph 
            style={{ 
              color: 'rgba(255, 255, 255, 0.8)',
              lineHeight: '1.6',
              margin: 0
            }}
          >
            {agent.description}
          </Paragraph>
        </div>

        {/* 行星标签 */}
        {tags.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <Title level={5} style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '10px' }}>
              🏷️ 行星特性
            </Title>
            <Space wrap>
              {tags.map((tag, index) => (
                <Tag
                  key={index}
                  style={{
                    background: 'rgba(24, 144, 255, 0.2)',
                    border: '1px solid rgba(24, 144, 255, 0.5)',
                    color: '#91d5ff',
                    borderRadius: '12px',
                    padding: '4px 12px'
                  }}
                >
                  {tag}
                </Tag>
              ))}
            </Space>
          </div>
        )}

        {/* 行星状态 */}
        <div style={{ marginBottom: '20px' }}>
          <Title level={5} style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '10px' }}>
            🛰️ 轨道状态
          </Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{
              background: 'rgba(82, 196, 26, 0.2)',
              border: '1px solid rgba(82, 196, 26, 0.5)',
              borderRadius: '8px',
              padding: '8px 12px',
              color: '#b7eb8f'
            }}>
              ✅ 行星活跃中
            </div>
            <div style={{
              background: 'rgba(24, 144, 255, 0.2)',
              border: '1px solid rgba(24, 144, 255, 0.5)',
              borderRadius: '8px',
              padding: '8px 12px',
              color: '#91d5ff'
            }}>
              🌌 遵循开普勒定律运行
            </div>
          </Space>
        </div>

        {/* 探索提示 */}
        <div style={{
          background: 'rgba(255, 193, 7, 0.2)',
          border: '1px solid rgba(255, 193, 7, 0.5)',
          borderRadius: '12px',
          padding: '15px',
          textAlign: 'center'
        }}>
          <div style={{ 
            color: '#ffd666', 
            fontSize: '16px', 
            marginBottom: '8px' 
          }}>
            ✨ 发现新的AI可能性
          </div>
          <div style={{ 
            color: 'rgba(255, 214, 102, 0.8)', 
            fontSize: '12px' 
          }}>
            点击下方按钮开始你的AI探索之旅
          </div>
        </div>
      </Card>
    </div>
  )
}