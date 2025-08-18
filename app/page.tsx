'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const GalaxyStarSystem = dynamic(() => import('@/components/GalaxyStarSystem'), {
  loading: () => <div style={{ 
    minHeight: '100vh', 
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    color: 'white'
  }}>🌌 加载星系中...</div>,
  ssr: false
})

const FeedbackButtons = dynamic(() => import('@/components/FeedbackButtons'), {
  loading: () => null,
  ssr: false
})

const Danmaku = dynamic(() => import('@/components/Danmaku'), {
  loading: () => null,
  ssr: false
})

interface Agent {
  id: string
  name: string
  description: string
  tags: string[]
  manager: string
  guideUrl?: string
  homepage?: string
  icon?: string
  enabled: boolean
  clickCount?: number
}

export default function Galaxy3DPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState<string>('all')
  const [agents, setAgents] = useState<Agent[]>([])
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([])
  const [allTags, setAllTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [danmakuInputVisible, setDanmakuInputVisible] = useState(false)
  const [danmakuPlaying, setDanmakuPlaying] = useState(false)

  useEffect(() => {
    fetchAgents()
  }, [])

  useEffect(() => {
    let filtered = agents.filter(agent => agent.enabled)
    
    if (searchTerm) {
      filtered = filtered.filter(agent => 
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (Array.isArray(agent.tags) && agent.tags.some(tag => 
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      )
    }
    
    if (selectedTag !== 'all') {
      filtered = filtered.filter(agent => 
        Array.isArray(agent.tags) && agent.tags.includes(selectedTag)
      )
    }
    
    setFilteredAgents(filtered)
  }, [searchTerm, selectedTag, agents])

  const fetchAgents = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/agents')
      if (!response.ok) throw new Error('Failed to fetch agents')
      const data = await response.json()
      setAgents(data.agents)
      
      const allTagsSet = new Set<string>()
      data.agents.forEach((agent: Agent) => {
        if (Array.isArray(agent.tags)) {
          agent.tags.forEach(tag => allTagsSet.add(tag))
        }
      })
      setAllTags(Array.from(allTagsSet))
    } catch (err) {
      console.error('Failed to load agents:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '48px', 
            marginBottom: '20px',
            animation: 'rotate 2s linear infinite'
          }}>
            🌌
          </div>
          <div style={{ fontSize: '18px', marginBottom: '10px' }}>
            正在初始化奇绩AI星系...
          </div>
          <div style={{ fontSize: '14px', opacity: 0.7 }}>
            准备观测星海中的奇绩AI智慧
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* 银河系AI星图标题 */}
      <div style={{
        position: 'fixed',
        top: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1001,
        textAlign: 'center',
        pointerEvents: 'none'
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: 'bold',
          color: '#e5e5e5',
          textShadow: `
            0 0 10px rgba(192, 192, 192, 0.8),
            0 0 20px rgba(192, 192, 192, 0.6),
            0 0 30px rgba(192, 192, 192, 0.4),
            0 0 40px rgba(192, 192, 192, 0.2)
          `,
          animation: 'glow 2s ease-in-out infinite alternate',
          letterSpacing: '2px',
          margin: 0,
          padding: 0
        }}>
          MiraclePlus AI Galaxy
        </h1>
        <p style={{
          fontSize: '16px',
          color: 'rgba(192, 192, 192, 0.8)',
          margin: '8px 0 0 0',
          textShadow: '0 0 5px rgba(192, 192, 192, 0.5)'
        }}>
          探索奇绩AI的星海
        </p>
      </div>

      {/* CSS动画 */}
      <style jsx global>{`
        @keyframes glow {
          from {
            text-shadow: 
              0 0 10px rgba(192, 192, 192, 0.8),
              0 0 20px rgba(192, 192, 192, 0.6),
              0 0 30px rgba(192, 192, 192, 0.4),
              0 0 40px rgba(192, 192, 192, 0.2);
          }
          to {
            text-shadow: 
              0 0 20px rgba(192, 192, 192, 1),
              0 0 30px rgba(192, 192, 192, 0.8),
              0 0 50px rgba(192, 192, 192, 0.6),
              0 0 70px rgba(192, 192, 192, 0.4);
          }
        }
      `}</style>

      {/* 银河系AI星图 - 基于点击次数的星等系统 */}
      <GalaxyStarSystem 
        agents={filteredAgents}
      />

      {/* 搜索和筛选控制 */}
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        background: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '12px',
        padding: '16px',
        color: 'white',
        fontSize: '14px',
        zIndex: 1000,
        minWidth: '200px',
        maxWidth: '220px'
      }}>
        <div style={{ marginBottom: '12px', fontWeight: 'bold' }}>
          🌌 奇绩AI星图
        </div>
        <input
          type="text"
          placeholder="搜索星星..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '6px',
            color: 'white',
            boxSizing: 'border-box'
          }}
        />
        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '6px',
            color: 'white'
          }}
        >
          <option value="all">全部分类</option>
          {allTags.map(tag => (
            <option key={tag} value={tag} style={{ color: 'black' }}>{tag}</option>
          ))}
        </select>
        <div style={{ marginTop: '8px', fontSize: '12px', opacity: 0.7 }}>
          ⭐ {filteredAgents.length} 颗AI星星
        </div>
        
        {/* 弹幕控制区域 */}
        <div style={{ 
          marginTop: '12px', 
          paddingTop: '12px', 
          borderTop: '1px solid rgba(255, 255, 255, 0.2)' 
        }}>
          <div style={{ marginBottom: '8px', fontSize: '12px', fontWeight: 'bold' }}>
            💬 弹幕系统
          </div>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
            <button
              onClick={() => setDanmakuInputVisible(!danmakuInputVisible)}
              style={{
                flex: 1,
                padding: '6px 8px',
                background: danmakuInputVisible 
                  ? 'rgba(255, 255, 255, 0.2)' 
                  : 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '6px',
                color: 'white',
                fontSize: '11px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textShadow: '0 0 10px rgba(255, 255, 255, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = danmakuInputVisible 
                  ? 'rgba(255, 255, 255, 0.2)' 
                  : 'rgba(255, 255, 255, 0.1)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              {danmakuInputVisible ? '关闭输入' : '发送弹幕'}
            </button>
            <button
              onClick={() => setDanmakuPlaying(!danmakuPlaying)}
              style={{
                flex: 1,
                padding: '6px 8px',
                background: danmakuPlaying 
                  ? 'rgba(255, 255, 255, 0.2)' 
                  : 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '6px',
                color: 'white',
                fontSize: '11px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textShadow: '0 0 10px rgba(255, 255, 255, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = danmakuPlaying 
                  ? 'rgba(255, 255, 255, 0.2)' 
                  : 'rgba(255, 255, 255, 0.1)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              {danmakuPlaying ? '停止播放' : '播放弹幕'}
            </button>
          </div>
        </div>
      </div>

      {/* 反馈按钮 */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 150
      }}>
        <FeedbackButtons />
      </div>

      {/* 作者信息 */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '12px',
        zIndex: 100,
        textShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px'
      }}>
        <div style={{ 
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          创新活动产品组
        </div>
        <div style={{ 
          fontSize: '11px',
          opacity: 0.8
        }}>
          Made by Xaiver / 邓湘雷
        </div>
      </div>

      {/* 底部版权信息 */}
      <div style={{
        position: 'fixed',
        bottom: '10px',
        right: '20px',
        color: 'rgba(255, 255, 255, 0.3)',
        fontSize: '12px',
        zIndex: 100
      }}>
        ⭐ MiraclePlus AI Galaxy Star System
      </div>

      {/* 弹幕系统 */}
      <Danmaku 
        enabled={true} 
        showInput={danmakuInputVisible}
        isPlaying={danmakuPlaying}
        onShowInputChange={setDanmakuInputVisible}
        onPlayingChange={setDanmakuPlaying}
      />
    </div>
  )
}