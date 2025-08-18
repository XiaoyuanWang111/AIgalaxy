'use client'

import React, { useMemo, useState, useEffect } from 'react'

interface EnhancedCSSStarFieldProps {
  starCount?: number
  speed?: number
  enableRotation?: boolean
  enableZoom?: boolean
  theme?: 'classic' | 'galaxy' | 'nebula' | 'warm' | 'cool'
}

export const EnhancedCSSStarField: React.FC<EnhancedCSSStarFieldProps> = ({
  starCount = 400,
  speed = 3,
  enableRotation = false,
  enableZoom = false,
  theme = 'galaxy'
}) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)

  // 主题色彩配置
  const themeColors = useMemo(() => {
    const themes = {
      classic: ['#ffffff', '#fafafa', '#f7f7f7', '#f0f0f0', '#e6e6e6'],
      galaxy: ['#ffffff', '#ffe9d4', '#ffd4a3', '#fff5d1', '#e1f0ff', '#d4e7ff', '#c9c9c9'],
      nebula: ['#FF6B9D', '#C44569', '#F8B500', '#FF9FF3', '#54a0ff', '#5f27cd'],
      warm: ['#FFD93D', '#FF8C42', '#FF6B35', '#F15025', '#C73E1D'],
      cool: ['#74b9ff', '#0984e3', '#00b894', '#00cec9', '#6c5ce7', '#a29bfe']
    }
    return themes[theme] || themes.galaxy
  }, [theme])

  // 生成星星坐标 - 改进的算法
  const starLayers = useMemo(() => {
    const generateStarShadows = (layerIndex: number, count: number) => {
      const shadows: string[] = []
      const layerMultiplier = layerIndex + 1
      
      for (let i = 0; i < count; i++) {
        // 使用更自然的分布算法
        const angle = Math.random() * Math.PI * 2
        const distance = Math.random() * 800 + 100
        const x = Math.cos(angle) * distance * layerMultiplier
        const y = Math.sin(angle) * distance * layerMultiplier * 0.7  // 椭圆分布
        
        const color = themeColors[Math.floor(Math.random() * themeColors.length)]
        const size = Math.random() * 2 + 0.5  // 不同大小的星星
        
        shadows.push(`${Math.round(x)}px ${Math.round(y)}px ${size}px ${color}`)
      }
      
      return shadows.join(', ')
    }

    return [
      generateStarShadows(0, Math.floor(starCount * 0.4)),  // 第一层 40%
      generateStarShadows(1, Math.floor(starCount * 0.35)), // 第二层 35%
      generateStarShadows(2, Math.floor(starCount * 0.25))  // 第三层 25%
    ]
  }, [starCount, themeColors])

  // 自动旋转效果
  useEffect(() => {
    if (!enableRotation) return

    const interval = setInterval(() => {
      setRotation(prev => ({
        x: prev.x + 0.1,
        y: prev.y + 0.05
      }))
    }, 50)

    return () => clearInterval(interval)
  }, [enableRotation])

  // 鼠标交互效果
  useEffect(() => {
    if (!enableZoom) return

    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      const maxDistance = Math.min(centerX, centerY)
      
      const deltaX = (e.clientX - centerX) / maxDistance
      const deltaY = (e.clientY - centerY) / maxDistance
      
      setRotation({
        x: deltaY * 10,
        y: deltaX * 10
      })
    }

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      const zoomFactor = e.deltaY > 0 ? 0.95 : 1.05
      setZoom(prev => Math.max(0.5, Math.min(2, prev * zoomFactor)))
    }

    if (enableZoom) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('wheel', handleWheel, { passive: false })
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('wheel', handleWheel)
    }
  }, [enableZoom])

  return (
    <div 
      className="enhanced-css-star-field"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        perspective: `${400 * zoom}px`,
        overflow: 'hidden',
        background: theme === 'nebula' 
          ? 'radial-gradient(ellipse at center, rgba(99, 39, 120, 0.3) 0%, rgba(5, 15, 35, 0.8) 50%, rgba(0, 5, 15, 0.99) 100%)'
          : 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        transform: enableZoom ? `scale(${zoom})` : 'none',
        transition: enableRotation ? 'none' : 'transform 0.2s ease'
      }}
    >
      {/* 星云背景层 */}
      {theme === 'nebula' && (
        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '30%',
            width: '40%',
            height: '60%',
            background: 'radial-gradient(ellipse, rgba(255, 107, 157, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'nebulaRotate 20s linear infinite',
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          }}
        />
      )}

      {/* 第一层星空 - 最亮最近 */}
      <div
        className="stars-layer stars-layer-1"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '1px',
          height: '1px',
          transform: `translate(-50%, -50%) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          boxShadow: starLayers[0],
          animation: `starFly ${speed}s linear infinite, starTwinkle 3s ease-in-out infinite`,
          transformStyle: 'preserve-3d',
        }}
      />
      
      {/* 第二层星空 - 中等亮度和距离 */}
      <div
        className="stars-layer stars-layer-2"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '1px',
          height: '1px',
          transform: `translate(-50%, -50%) translateZ(-300px) rotateX(${rotation.x * 0.7}deg) rotateY(${rotation.y * 0.7}deg)`,
          boxShadow: starLayers[1],
          opacity: 0.7,
          animation: `starFly ${speed * 1.3}s linear infinite, starTwinkle 4s ease-in-out infinite 1s`,
          transformStyle: 'preserve-3d',
        }}
      />
      
      {/* 第三层星空 - 最暗最远 */}
      <div
        className="stars-layer stars-layer-3"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '1px',
          height: '1px',
          transform: `translate(-50%, -50%) translateZ(-600px) rotateX(${rotation.x * 0.5}deg) rotateY(${rotation.y * 0.5}deg)`,
          boxShadow: starLayers[2],
          opacity: 0.4,
          animation: `starFly ${speed * 1.6}s linear infinite, starTwinkle 5s ease-in-out infinite 2s`,
          transformStyle: 'preserve-3d',
        }}
      />

      {/* 流星效果 */}
      <div
        className="shooting-star"
        style={{
          position: 'absolute',
          top: '20%',
          right: '20%',
          width: '2px',
          height: '2px',
          background: '#ffffff',
          borderRadius: '50%',
          boxShadow: '0 0 6px 2px rgba(255, 255, 255, 0.8)',
          animation: 'shootingStar 8s ease-in infinite',
          transformStyle: 'preserve-3d',
        }}
      />

      {/* CSS动画定义 */}
      <style jsx>{`
        @keyframes starFly {
          from {
            transform: translate(-50%, -50%) translateZ(0px);
            opacity: 0.4;
          }
          to {
            transform: translate(-50%, -50%) translateZ(300px);
            opacity: 1;
          }
        }
        
        @keyframes starTwinkle {
          0%, 100% { 
            filter: brightness(0.7) saturate(0.8); 
          }
          25% { 
            filter: brightness(1.3) saturate(1.2); 
          }
          50% { 
            filter: brightness(0.9) saturate(1.0); 
          }
          75% { 
            filter: brightness(1.1) saturate(1.1); 
          }
        }

        @keyframes nebulaRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes shootingStar {
          0% {
            transform: translate(0, 0) rotate(45deg);
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          15% {
            transform: translate(-300px, 300px) rotate(45deg);
            opacity: 1;
          }
          20% {
            opacity: 0;
          }
          100% {
            transform: translate(-300px, 300px) rotate(45deg);
            opacity: 0;
          }
        }

        /* 响应式优化 */
        @media (max-width: 768px) {
          .enhanced-css-star-field {
            perspective: ${300 * zoom}px;
          }
          
          .stars-layer {
            animation-duration: ${speed * 1.5}s, 4s;
          }
        }

        @media (max-width: 480px) {
          .enhanced-css-star-field {
            perspective: ${200 * zoom}px;
          }
          
          .stars-layer {
            animation-duration: ${speed * 2}s, 5s;
          }
        }

        /* 高刷新率屏幕优化 */
        @media (min-resolution: 120dpi) {
          .stars-layer {
            animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          }
        }

        /* 降级处理 */
        @supports not (transform-style: preserve-3d) {
          .stars-layer {
            background: radial-gradient(ellipse at center, 
              rgba(255,255,255,0.1) 0%, 
              rgba(255,255,255,0.05) 50%, 
              rgba(0,0,0,0) 70%);
            animation: fadeInOut 4s ease-in-out infinite;
          }
          
          @keyframes fadeInOut {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 0.6; }
          }
        }

        /* 暗色模式适配 */
        @media (prefers-color-scheme: dark) {
          .enhanced-css-star-field {
            background: linear-gradient(135deg, #000510 0%, #0a0f1c 50%, #000510 100%);
          }
        }

        /* 减少动画偏好设置 */
        @media (prefers-reduced-motion: reduce) {
          .stars-layer,
          .shooting-star {
            animation-duration: 10s;
            animation-iteration-count: 1;
          }
        }
      `}</style>
    </div>
  )
}