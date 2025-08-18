'use client'

import React, { useMemo } from 'react'

interface CSSStarFieldProps {
  starCount?: number
  speed?: number
  colors?: string[]
  enableTwinkle?: boolean
}

export const CSSStarField: React.FC<CSSStarFieldProps> = ({
  starCount = 400,
  speed = 3,
  colors = ['#ffffff', '#fafafa', '#f0f0f0', '#e6e6e6', '#ffe9d4', '#ffd4a3', '#fff5d1', '#e1f0ff', '#d4e7ff'],
  enableTwinkle = true
}) => {
  // 生成随机星星坐标和颜色
  const starShadows = useMemo(() => {
    const shadows: string[] = []
    
    for (let i = 0; i < starCount; i++) {
      // 生成随机坐标，范围更大以适应3D银河系
      const x = Math.random() * 2000 - 1000  // -1000 到 1000
      const y = Math.random() * 1500 - 750   // -750 到 750
      const color = colors[Math.floor(Math.random() * colors.length)]
      
      shadows.push(`${Math.round(x)}px ${Math.round(y)}px ${color}`)
    }
    
    return shadows.join(', ')
  }, [starCount, colors])

  return (
    <div 
      className="css-star-field"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -2,
        perspective: '400px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      }}
    >
      {/* 第一层星空 - 最近最亮 */}
      <div
        className="stars-layer-1"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '2px',
          height: '2px',
          transform: 'translate(-50%, -50%)',
          boxShadow: starShadows,
          animation: `starFly ${speed}s linear infinite ${enableTwinkle ? ', starTwinkle 4s ease-in-out infinite' : ''}`,
          transformStyle: 'preserve-3d',
        }}
      />
      
      {/* 第二层星空 - 中等距离 */}
      <div
        className="stars-layer-2"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '2px',
          height: '2px',
          transform: 'translate(-50%, -50%) translateZ(-200px)',
          boxShadow: starShadows,
          opacity: 0.7,
          animation: `starFly ${speed * 1.2}s linear infinite ${enableTwinkle ? ', starTwinkle 5s ease-in-out infinite 1s' : ''}`,
          transformStyle: 'preserve-3d',
        }}
      />
      
      {/* 第三层星空 - 最远最暗 */}
      <div
        className="stars-layer-3"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '2px',
          height: '2px',
          transform: 'translate(-50%, -50%) translateZ(-400px)',
          boxShadow: starShadows,
          opacity: 0.4,
          animation: `starFly ${speed * 1.5}s linear infinite ${enableTwinkle ? ', starTwinkle 6s ease-in-out infinite 2s' : ''}`,
          transformStyle: 'preserve-3d',
        }}
      />

      {/* CSS动画定义 */}
      <style jsx>{`
        @keyframes starFly {
          from {
            transform: translate(-50%, -50%) translateZ(0px);
            opacity: 0.6;
          }
          to {
            transform: translate(-50%, -50%) translateZ(200px);
            opacity: 1;
          }
        }
        
        @keyframes starTwinkle {
          0%, 100% { 
            filter: brightness(0.8); 
          }
          25% { 
            filter: brightness(1.2); 
          }
          50% { 
            filter: brightness(0.9); 
          }
          75% { 
            filter: brightness(1.1); 
          }
        }

        /* 移动设备优化 */
        @media (max-width: 768px) {
          .css-star-field {
            perspective: 250px;
          }
          
          .stars-layer-1,
          .stars-layer-2,
          .stars-layer-3 {
            animation-duration: ${speed * 1.5}s, ${enableTwinkle ? '5s' : 'none'};
          }
        }

        /* 高性能设备增强 */
        @media (min-width: 1920px) {
          .css-star-field {
            perspective: 600px;
          }
        }

        /* 降级处理 - 不支持3D的浏览器 */
        @supports not (transform-style: preserve-3d) {
          .stars-layer-1,
          .stars-layer-2,
          .stars-layer-3 {
            background: radial-gradient(ellipse at center, 
              rgba(255,255,255,0.1) 0%, 
              rgba(255,255,255,0.05) 50%, 
              rgba(0,0,0,0) 70%);
            animation: fadeInOut 3s ease-in-out infinite;
          }
          
          @keyframes fadeInOut {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.8; }
          }
        }
      `}</style>
    </div>
  )
}