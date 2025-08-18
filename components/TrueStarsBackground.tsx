'use client'

import React, { useMemo } from 'react'

interface TrueStarsBackgroundProps {
  starCount?: number
  speed?: number
  perspective?: number
}

export const TrueStarsBackground: React.FC<TrueStarsBackgroundProps> = ({
  starCount = 400,
  speed = 3,
  perspective = 340
}) => {
  // 精确生成stars项目风格的box-shadow字符串
  const starsBoxShadow = useMemo(() => {
    const shadows: string[] = []
    const colors = [
      '#ffffff', '#fafafa', '#f7f7f7', '#f0f0f0', '#ebebeb', '#e8e8e8', 
      '#e6e6e6', '#e3e3e3', '#e0e0e0', '#dedede', '#dbdbdb', '#d9d9d9',
      '#d6d6d6', '#d4d4d4', '#d1d1d1', '#cfcfcf', '#cccccc', '#c9c9c9',
      '#c7c7c7', '#c4c4c4', '#c2c2c2', 'whitesmoke', 'white'
    ]
    
    for (let i = 0; i < starCount; i++) {
      // 使用更自然的分布算法，类似stars项目
      const x = Math.floor(Math.random() * 1600 - 800)  // -800 到 800
      const y = Math.floor(Math.random() * 1000 - 500)  // -500 到 500
      const color = colors[Math.floor(Math.random() * colors.length)]
      
      shadows.push(`${x}px ${y}px ${color}`)
    }
    
    return shadows.join(', ')
  }, [starCount])

  return (
    <>
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: '#000',
          perspective: `${perspective}px`,
          overflow: 'hidden',
          zIndex: -10
        }}
      >
        {/* 主星空层 - 完全复制stars项目的实现 */}
        <div
          className="true-stars"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '2px',
            height: '2px',
            boxShadow: starsBoxShadow,
            animation: `trueFly ${speed}s linear infinite`,
            transformStyle: 'preserve-3d'
          }}
        />
      </div>

      {/* CSS动画 - 完全复制stars项目 */}
      <style jsx>{`
        .true-stars {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 2px;
          height: 2px;
          box-shadow: ${starsBoxShadow};
          animation: trueFly ${speed}s linear infinite;
          transform-style: preserve-3d;
        }
        
        .true-stars:before, 
        .true-stars:after {
          content: "";
          position: absolute;
          width: inherit;
          height: inherit;
          box-shadow: inherit;
        }
        
        .true-stars:before {
          transform: translateZ(-300px);
          opacity: .6;
        }
        
        .true-stars:after {
          transform: translateZ(-600px);
          opacity: .4;
        }

        @keyframes trueFly {
          from {
            transform: translateZ(0px);
            opacity: .6;
          }
          to {
            transform: translateZ(300px);
            opacity: 1;
          }
        }
      `}</style>
    </>
  )
}