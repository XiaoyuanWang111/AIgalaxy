'use client'

import React, { useEffect, useRef } from 'react'

export const CentralStar: React.FC = () => {
  const starRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 添加随机的日冕闪烁效果
    const addCorona = () => {
      const star = starRef.current
      if (!star) return

      const corona = document.createElement('div')
      corona.style.position = 'absolute'
      corona.style.width = '400px'
      corona.style.height = '400px'
      corona.style.borderRadius = '50%'
      corona.style.background = `radial-gradient(circle, 
        rgba(255, 165, 0, 0.3) 0%, 
        rgba(255, 69, 0, 0.2) 30%, 
        rgba(255, 140, 0, 0.1) 60%, 
        transparent 100%)`
      corona.style.top = '-100px'
      corona.style.left = '-100px'
      corona.style.animation = 'coronaFlicker 3s ease-in-out infinite'
      corona.style.pointerEvents = 'none'
      
      star.appendChild(corona)
      
      setTimeout(() => {
        if (corona.parentNode) {
          corona.parentNode.removeChild(corona)
        }
      }, 3000)
    }

    const interval = setInterval(addCorona, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      ref={starRef}
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: '200px',
        height: '200px',
        zIndex: 5,
      }}
    >
      {/* 外层光环 */}
      <div
        style={{
          position: 'absolute',
          top: '-50px',
          left: '-50px',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: `radial-gradient(circle, 
            rgba(255, 165, 0, 0.1) 0%, 
            rgba(255, 140, 0, 0.05) 50%, 
            transparent 100%)`,
          animation: 'rotate 20s linear infinite',
        }}
      />

      {/* 中层光晕 */}
      <div
        style={{
          position: 'absolute',
          top: '-25px',
          left: '-25px',
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          background: `radial-gradient(circle, 
            rgba(255, 140, 0, 0.2) 0%, 
            rgba(255, 69, 0, 0.1) 60%, 
            transparent 100%)`,
          animation: 'pulse 4s ease-in-out infinite',
        }}
      />

      {/* 恒星主体 */}
      <div
        style={{
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: `radial-gradient(circle at 35% 35%, 
            #FFF8DC 0%,
            #FFD700 20%,
            #FF8C00 40%,
            #FF6347 60%,
            #FF4500 80%,
            #B22222 100%)`,
          boxShadow: `
            0 0 100px rgba(255, 165, 0, 0.8),
            0 0 200px rgba(255, 140, 0, 0.6),
            0 0 300px rgba(255, 69, 0, 0.4),
            inset -30px -30px 60px rgba(139, 69, 19, 0.3),
            inset 30px 30px 60px rgba(255, 255, 255, 0.2)
          `,
          animation: 'starRotate 30s linear infinite, starPulse 6s ease-in-out infinite',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 太阳黑子 */}
        <div
          style={{
            position: 'absolute',
            top: '30%',
            left: '20%',
            width: '20px',
            height: '15px',
            borderRadius: '50%',
            background: 'rgba(139, 69, 19, 0.6)',
            animation: 'rotate 30s linear infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '60%',
            right: '25%',
            width: '15px',
            height: '12px',
            borderRadius: '50%',
            background: 'rgba(139, 69, 19, 0.5)',
            animation: 'rotate 30s linear infinite',
          }}
        />

        {/* 日冕粒子 */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '45%',
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: '#FFD700',
            boxShadow: '0 0 10px #FFD700',
            animation: 'coronaParticle 8s ease-in-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '15%',
            right: '40%',
            width: '3px',
            height: '3px',
            borderRadius: '50%',
            background: '#FF8C00',
            boxShadow: '0 0 8px #FF8C00',
            animation: 'coronaParticle 6s ease-in-out infinite 2s',
          }}
        />
      </div>

      {/* 标题 */}
      <div
        style={{
          position: 'absolute',
          top: '220px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'rgba(255, 215, 0, 0.9)',
          fontSize: '18px',
          fontWeight: 'bold',
          textShadow: '0 0 15px rgba(255, 215, 0, 0.8)',
          whiteSpace: 'nowrap',
          animation: 'glow 3s ease-in-out infinite',
        }}
      >
        ⭐ AI Galaxy Core
      </div>
    </div>
  )
}

// 添加CSS动画
const style = document.createElement('style')
style.textContent = `
  @keyframes starRotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes starPulse {
    0%, 100% { 
      box-shadow: 
        0 0 100px rgba(255, 165, 0, 0.8),
        0 0 200px rgba(255, 140, 0, 0.6),
        0 0 300px rgba(255, 69, 0, 0.4),
        inset -30px -30px 60px rgba(139, 69, 19, 0.3),
        inset 30px 30px 60px rgba(255, 255, 255, 0.2);
    }
    50% { 
      box-shadow: 
        0 0 120px rgba(255, 165, 0, 1),
        0 0 240px rgba(255, 140, 0, 0.8),
        0 0 360px rgba(255, 69, 0, 0.6),
        inset -30px -30px 60px rgba(139, 69, 19, 0.3),
        inset 30px 30px 60px rgba(255, 255, 255, 0.2);
    }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 0.8; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.1); }
  }
  
  @keyframes coronaFlicker {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.7; }
  }
  
  @keyframes coronaParticle {
    0%, 100% { 
      transform: translateY(0px) scale(1);
      opacity: 1;
    }
    50% { 
      transform: translateY(-10px) scale(1.2);
      opacity: 0.7;
    }
  }
`

if (typeof document !== 'undefined') {
  document.head.appendChild(style)
}