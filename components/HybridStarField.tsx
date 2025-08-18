'use client'

import React from 'react'
import { CSSStarField } from './CSSStarField'
import { EnhancedStarField } from './EnhancedStarField'

interface HybridStarFieldProps {
  mode?: 'css' | 'canvas' | 'hybrid'
  performance?: 'high' | 'medium' | 'low'
  enableInteractivity?: boolean
}

export const HybridStarField: React.FC<HybridStarFieldProps> = ({
  mode = 'hybrid',
  performance = 'high',
  enableInteractivity = true
}) => {
  // 根据性能模式和设备能力选择最佳实现
  const getOptimalMode = () => {
    // 检测设备性能
    const isHighEnd = window.devicePixelRatio > 1 && 
                     navigator.hardwareConcurrency > 4 &&
                     window.innerWidth > 1200

    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    
    if (mode === 'hybrid') {
      if (isMobile || performance === 'low') {
        return 'css'  // 移动设备或低性能模式使用CSS
      } else if (isHighEnd && performance === 'high') {
        return 'canvas'  // 高端设备使用Canvas获得最佳效果
      } else {
        return 'css'  // 默认使用CSS保证兼容性
      }
    }
    
    return mode
  }

  const optimalMode = getOptimalMode()

  // CSS模式配置
  const cssConfig = {
    starCount: performance === 'high' ? 500 : performance === 'medium' ? 300 : 200,
    speed: 4,
    colors: [
      '#ffffff', '#fafafa', '#f7f7f7', '#f0f0f0', '#e6e6e6',
      '#ffe9d4', '#ffd4a3', '#fff5d1', '#e1f0ff', '#d4e7ff'
    ],
    enableTwinkle: performance !== 'low'
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {optimalMode === 'css' && (
        <CSSStarField {...cssConfig} />
      )}
      
      {optimalMode === 'canvas' && (
        <EnhancedStarField />
      )}
      
      {optimalMode === 'css' && (
        <>
          {/* CSS层作为基础背景 */}
          <CSSStarField 
            starCount={200}
            speed={5}
            colors={['#ffffff', '#fafafa', '#f0f0f0']}
            enableTwinkle={false}
          />
          
          {/* Canvas层作为交互增强 */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            <EnhancedStarField />
          </div>
        </>
      )}

      {/* 性能监控和优化提示 */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          position: 'fixed',
          top: '10px',
          left: '10px',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '8px',
          borderRadius: '4px',
          fontSize: '12px',
          zIndex: 9999,
          fontFamily: 'monospace'
        }}>
          星空模式: {optimalMode.toUpperCase()} | 性能: {performance.toUpperCase()}
        </div>
      )}
    </div>
  )
}