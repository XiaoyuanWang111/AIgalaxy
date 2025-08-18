'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button, Tag, Typography, Space } from 'antd'
import { ToolOutlined, UserOutlined } from '@ant-design/icons'
import Link from 'next/link'

const { Title, Text, Paragraph } = Typography

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

interface PlanetAgentProps {
  agent: Agent
  initialPosition: { x: number; y: number }
  onHover?: (isHovered: boolean) => void
}

export const PlanetAgent: React.FC<PlanetAgentProps> = ({ 
  agent, 
  initialPosition, 
  onHover 
}) => {
  const [position, setPosition] = useState(initialPosition)
  const [isHovered, setIsHovered] = useState(false)
  const [rotation, setRotation] = useState(0)
  const planetRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()

  // 行星颜色主题
  const planetColors = [
    ['#ff6b6b', '#ee5a24'], // 火星红
    ['#4834d4', '#686de0'], // 海王星蓝
    ['#ff9ff3', '#f368e0'], // 粉色星球
    ['#26de81', '#20bf6b'], // 绿色星球
    ['#fd79a8', '#e84393'], // 玫瑰星球
    ['#a29bfe', '#6c5ce7'], // 紫色星球
    ['#ffeaa7', '#fdcb6e'], // 金色星球
    ['#74b9ff', '#0984e3'], // 蓝色星球
  ]

  const planetColor = planetColors[agent.id.charCodeAt(0) % planetColors.length]

  // 轨道旋转动画
  useEffect(() => {
    const animate = () => {
      setRotation(prev => (prev + 0.5) % 360)
      animationRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  // 磁力吸引效果
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!planetRef.current) return

      const rect = planetRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const distance = Math.sqrt(
        Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
      )

      // 磁力吸引范围
      const magnetRange = 150
      if (distance < magnetRange) {
        const force = (magnetRange - distance) / magnetRange
        const deltaX = (e.clientX - centerX) * force * 0.1
        const deltaY = (e.clientY - centerY) * force * 0.1
        
        setPosition(prev => ({
          x: prev.x + deltaX * 0.1,
          y: prev.y + deltaY * 0.1
        }))
      } else {
        // 回到初始位置
        setPosition(prev => ({
          x: prev.x + (initialPosition.x - prev.x) * 0.05,
          y: prev.y + (initialPosition.y - prev.y) * 0.05
        }))
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [initialPosition])

  const handleMouseEnter = () => {
    setIsHovered(true)
    onHover?.(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    onHover?.(false)
  }

  return (
    <div
      ref={planetRef}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        transform: `translate(-50%, -50%) ${isHovered ? 'scale(1.2)' : 'scale(1)'}`,
        transition: 'transform 0.3s ease-out',
        zIndex: isHovered ? 1000 : 1,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 行星轨道环 */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
          width: isHovered ? '200px' : '140px',
          height: isHovered ? '200px' : '140px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '50%',
          transition: 'all 0.3s ease-out',
          opacity: isHovered ? 0.8 : 0.3,
        }}
      />

      {/* 行星主体 */}
      <div
        style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: `radial-gradient(circle at 30% 30%, ${planetColor[0]}, ${planetColor[1]})`,
          boxShadow: `
            0 0 20px rgba(${planetColor[0].slice(1)}, 0.5),
            inset -10px -10px 20px rgba(0, 0, 0, 0.3),
            inset 10px 10px 20px rgba(255, 255, 255, 0.1)
          `,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '40px',
          color: 'white',
          textShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
          cursor: 'pointer',
          position: 'relative',
          animation: `rotate 20s linear infinite`,
        }}
      >
        {agent.icon || '🤖'}
        
        {/* 行星光晕 */}
        <div
          style={{
            position: 'absolute',
            top: '-10px',
            left: '-10px',
            right: '-10px',
            bottom: '-10px',
            borderRadius: '50%',
            background: `radial-gradient(circle, transparent 60%, ${planetColor[0]}30 80%, transparent 100%)`,
            opacity: isHovered ? 0.8 : 0.4,
            transition: 'opacity 0.3s ease-out',
          }}
        />
      </div>

      {/* 信息卡片 - 悬浮时显示 */}
      {isHovered && (
        <div
          style={{
            position: 'absolute',
            top: '120px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            padding: '16px',
            minWidth: '280px',
            maxWidth: '320px',
            color: 'white',
            animation: 'fadeInUp 0.3s ease-out',
          }}
        >
          <Title level={4} style={{ color: 'white', margin: '0 0 8px 0' }}>
            {agent.name}
          </Title>
          
          <Paragraph 
            style={{ 
              color: 'rgba(255, 255, 255, 0.8)', 
              margin: '0 0 12px 0',
              fontSize: '13px',
              lineHeight: '1.4'
            }}
          >
            {agent.description}
          </Paragraph>

          <Space style={{ marginBottom: '12px' }}>
            <UserOutlined style={{ color: 'rgba(255, 255, 255, 0.6)' }} />
            <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '12px' }}>
              {agent.manager}
            </Text>
          </Space>

          <div style={{ marginBottom: '16px' }}>
            {agent.tags.split(',').map(tag => (
              <Tag 
                key={tag.trim()} 
                style={{ 
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  margin: '2px'
                }}
              >
                {tag.trim()}
              </Tag>
            ))}
          </div>

          <Space>
            <Link href={`/agents/${agent.id}`}>
              <Button 
                type="primary" 
                size="small" 
                icon={<ToolOutlined />}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                使用指南
              </Button>
            </Link>
            {agent.homepage && (
              <a href={agent.homepage} target="_blank" rel="noopener noreferrer">
                <Button 
                  size="small"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'rgba(255, 255, 255, 0.8)',
                  }}
                >
                  访问官网
                </Button>
              </a>
            )}
          </Space>
        </div>
      )}
    </div>
  )
}

// CSS关键帧动画
const style = document.createElement('style')
style.textContent = `
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
`

if (typeof document !== 'undefined') {
  document.head.appendChild(style)
}