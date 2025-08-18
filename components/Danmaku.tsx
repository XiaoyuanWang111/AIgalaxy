'use client'

import React, { useState, useEffect, useRef } from 'react'

interface DanmakuItem {
  id: string
  text: string
  color: string
  createdAt: string
  x?: number
  y?: number
  speed?: number
  timestamp?: number
}

interface DanmakuProps {
  enabled?: boolean
  showInput?: boolean
  isPlaying?: boolean
  onShowInputChange?: (show: boolean) => void
  onPlayingChange?: (playing: boolean) => void
}

export const Danmaku: React.FC<DanmakuProps> = ({ 
  enabled = true, 
  showInput = false, 
  isPlaying = false,
  onShowInputChange,
  onPlayingChange 
}) => {
  const [danmakus, setDanmakus] = useState<DanmakuItem[]>([])
  const [inputValue, setInputValue] = useState('')
  const [selectedColor, setSelectedColor] = useState('#FFFFFF')
  const [displayedDanmakus, setDisplayedDanmakus] = useState<DanmakuItem[]>([])
  const [configEnabled, setConfigEnabled] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // 获取弹幕列表
  const fetchDanmakus = async () => {
    try {
      const response = await fetch('/api/danmaku')
      const data = await response.json()
      if (data.success) {
        setDanmakus(data.danmakus)
      }
    } catch (error) {
      console.error('获取弹幕失败:', error)
    }
  }

  // 获取弹幕配置
  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/danmaku/config')
      const data = await response.json()
      if (data.success) {
        setConfigEnabled(data.config.enabled)
      }
    } catch (error) {
      console.error('获取弹幕配置失败:', error)
    }
  }

  // 动画更新弹幕位置
  useEffect(() => {
    if (!enabled) return

    const interval = setInterval(() => {
      setDisplayedDanmakus(prev => 
        prev
          .map(danmaku => ({
            ...danmaku,
            x: (danmaku.x || 0) - (danmaku.speed || 2)
          }))
          .filter(danmaku => (danmaku.x || 0) > -400) // 确保弹幕完全移出屏幕后才移除
      )
    }, 16) // 60fps

    return () => clearInterval(interval)
  }, [enabled])

  useEffect(() => {
    if (enabled) {
      fetchConfig()
      fetchDanmakus()
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [enabled])

  // 发送弹幕到服务器
  const sendDanmaku = async () => {
    if (!inputValue.trim() || inputValue.length > 20) return

    try {
      const response = await fetch('/api/danmaku', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputValue.trim(),
          color: selectedColor
        })
      })

      const data = await response.json()
      if (data.success) {
        setInputValue('')
        onShowInputChange?.(false)
        fetchDanmakus() // 刷新弹幕列表
      }
    } catch (error) {
      console.error('发送弹幕失败:', error)
    }
  }

  // 处理播放状态变化
  useEffect(() => {
    if (isPlaying) {
      // 开始播放
      let index = 0
      const batchSize = 10

      const playBatch = () => {
        if (index >= danmakus.length) {
          onPlayingChange?.(false)
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
          return
        }

        const batch = danmakus.slice(index, index + batchSize)
        const containerWidth = containerRef.current?.offsetWidth || window.innerWidth
        const containerHeight = containerRef.current?.offsetHeight || window.innerHeight
        
        batch.forEach((danmaku, i) => {
          setTimeout(() => {
            const displayDanmaku = {
              ...danmaku,
              id: `${danmaku.id}-${Date.now()}-${i}`,
              x: containerWidth,
              y: Math.random() * (containerHeight - 100) + 50,
              speed: 1 + Math.random() * 2,
              timestamp: Date.now()
            }
            
            setDisplayedDanmakus(prev => [...prev, displayDanmaku])
          }, i * 200)
        })

        index += batchSize
      }

      playBatch()
      intervalRef.current = setInterval(playBatch, 3000)
    } else {
      // 停止播放
      setDisplayedDanmakus([])
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isPlaying, danmakus, onPlayingChange])

  // 键盘事件
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendDanmaku()
    } else if (e.key === 'Escape') {
      onShowInputChange?.(false)
      setInputValue('')
    }
  }

  if (!enabled || !configEnabled) return null

  return (
    <>
      {/* 弹幕容器 */}
      <div
        ref={containerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 200,
          overflow: 'hidden'
        }}
      >
        {displayedDanmakus.map(danmaku => (
          <div
            key={danmaku.id}
            style={{
              position: 'absolute',
              left: `${danmaku.x || 0}px`,
              top: `${danmaku.y || 0}px`,
              color: danmaku.color,
              fontSize: '16px',
              fontWeight: 'bold',
              textShadow: `
                1px 1px 2px rgba(0,0,0,0.8),
                -1px -1px 2px rgba(0,0,0,0.8),
                1px -1px 2px rgba(0,0,0,0.8),
                -1px 1px 2px rgba(0,0,0,0.8)
              `,
              whiteSpace: 'nowrap',
              userSelect: 'none',
              animation: 'danmakuGlow 3s ease-in-out infinite',
              filter: 'drop-shadow(0 0 5px currentColor)'
            }}
          >
            {danmaku.text}
          </div>
        ))}
      </div>

      {/* 弹幕输入框 */}
      {showInput && (
        <div
          style={{
            position: 'fixed',
            bottom: '60px',
            left: '20px',
            zIndex: 300,
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(10px)',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            minWidth: '280px'
          }}
        >
          {/* 输入框和颜色选择器 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="输入弹幕内容（最多20字）"
              maxLength={20}
              autoFocus
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '4px',
                padding: '8px',
                color: 'white',
                fontSize: '14px',
                flex: 1
              }}
            />
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              style={{
                width: '40px',
                height: '36px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '4px',
                background: 'transparent',
                cursor: 'pointer'
              }}
              title="选择弹幕颜色"
            />
          </div>

          {/* 预览效果 */}
          <div style={{ 
            color: selectedColor, 
            fontSize: '14px', 
            fontWeight: 'bold',
            textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
            minHeight: '20px',
            display: 'flex',
            alignItems: 'center'
          }}>
            {inputValue || '预览效果'}
          </div>
          
          {/* 快速颜色选择 */}
          <div>
            <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '4px' }}>
              快速选色：
            </div>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {[
                '#FFFFFF', '#FF0000', '#FF7F00', '#FFFF00', 
                '#00FF00', '#0000FF', '#4B0082', '#9400D3',
                '#FF1493', '#00CED1', '#FFD700', '#ADFF2F'
              ].map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: color,
                    border: selectedColor === color ? '2px solid #fff' : '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    boxSizing: 'border-box'
                  }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* 操作按钮 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={sendDanmaku}
              disabled={!inputValue.trim() || inputValue.length > 20}
              style={{
                background: inputValue.trim() && inputValue.length <= 20 
                  ? 'linear-gradient(135deg, #4F46E5, #7C3AED)' 
                  : 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: inputValue.trim() && inputValue.length <= 20 ? 'pointer' : 'not-allowed',
                fontSize: '14px'
              }}
            >
              发送
            </button>
            <button
              onClick={() => {
                onShowInputChange?.(false)
                setInputValue('')
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* CSS动画 */}
      <style jsx global>{`
        @keyframes danmakuGlow {
          0%, 100% {
            filter: drop-shadow(0 0 5px currentColor);
          }
          50% {
            filter: drop-shadow(0 0 15px currentColor) drop-shadow(0 0 25px currentColor);
          }
        }
        
        @keyframes danmaku-flow {
          from {
            transform: translateX(100vw);
          }
          to {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </>
  )
}

export default Danmaku