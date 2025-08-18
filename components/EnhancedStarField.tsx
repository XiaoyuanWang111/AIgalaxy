'use client'

import React, { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  z: number
  speed: number
  size: number
  opacity: number
  color: string
}

interface DustParticle {
  x: number
  y: number
  z: number
  speed: number
  size: number
  opacity: number
  angle: number
  drift: number
}

interface Nebula {
  x: number
  y: number
  size: number
  opacity: number
  color: string
  rotation: number
}

export const EnhancedStarField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<Star[]>([])
  const dustRef = useRef<DustParticle[]>([])
  const nebulaRef = useRef<Nebula[]>([])
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 初始化画布尺寸
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    // 创建星星
    const createStars = () => {
      const stars: Star[] = []
      const numStars = 300 // 减少星星数量

      const starColors = [
        '#ffffff', '#ffe9d4', '#ffd4a3', '#fff5d1', '#e1f0ff', '#d4e7ff'
      ]

      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: Math.random() * 1000,
          speed: 0.05 + Math.random() * 0.1, // 减慢星星移动速度
          size: Math.random() * 2.5, // 略微减小星星大小
          opacity: Math.random() * 0.6 + 0.3, // 调整透明度范围
          color: starColors[Math.floor(Math.random() * starColors.length)]
        })
      }
      starsRef.current = stars
    }

    // 创建星际尘埃
    const createDust = () => {
      const dust: DustParticle[] = []
      const numDust = 100 // 减少粒子数量

      for (let i = 0; i < numDust; i++) {
        dust.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: Math.random() * 500 + 500,
          speed: 0.02 + Math.random() * 0.05, // 减慢移动速度
          size: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.2 + 0.05, // 降低透明度
          angle: Math.random() * Math.PI * 2,
          drift: (Math.random() - 0.5) * 0.005 // 减慢旋转速度
        })
      }
      dustRef.current = dust
    }

    // 创建星云
    const createNebula = () => {
      const nebulae: Nebula[] = []
      const nebulaColors = [
        'rgba(255, 20, 147, 0.1)', // 粉红
        'rgba(0, 191, 255, 0.08)', // 深蓝
        'rgba(255, 140, 0, 0.06)', // 橙色
        'rgba(128, 0, 255, 0.08)', // 紫色
        'rgba(0, 255, 127, 0.06)', // 青绿
      ]

      for (let i = 0; i < 8; i++) {
        nebulae.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: 200 + Math.random() * 400,
          opacity: 0.3 + Math.random() * 0.4,
          color: nebulaColors[Math.floor(Math.random() * nebulaColors.length)],
          rotation: Math.random() * 360
        })
      }
      nebulaRef.current = nebulae
    }

    // 动画循环
    const animate = () => {
      // 清除画布，使用深空背景
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height)
      )
      gradient.addColorStop(0, 'rgba(15, 23, 42, 0.95)')
      gradient.addColorStop(0.5, 'rgba(5, 15, 35, 0.97)')
      gradient.addColorStop(1, 'rgba(0, 5, 15, 0.99)')
      
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // 绘制星云
      nebulaRef.current.forEach((nebula) => {
        nebula.rotation += 0.02 // 减慢星云旋转速度

        ctx.save()
        ctx.translate(nebula.x, nebula.y)
        ctx.rotate(nebula.rotation * Math.PI / 180)
        
        const nebulaGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, nebula.size)
        nebulaGradient.addColorStop(0, nebula.color)
        nebulaGradient.addColorStop(0.5, nebula.color.replace(/0\.\d+/, '0.02')) // 进一步降低透明度
        nebulaGradient.addColorStop(1, 'transparent')
        
        ctx.fillStyle = nebulaGradient
        ctx.fillRect(-nebula.size, -nebula.size, nebula.size * 2, nebula.size * 2)
        ctx.restore()
      })

      // 绘制星际尘埃
      dustRef.current.forEach((particle) => {
        particle.z -= particle.speed
        particle.angle += particle.drift
        
        if (particle.z <= 0) {
          particle.z = 500 + Math.random() * 500
          particle.x = Math.random() * canvas.width
          particle.y = Math.random() * canvas.height
        }

        const x = (particle.x - canvas.width / 2) * (100 / particle.z) + canvas.width / 2
        const y = (particle.y - canvas.height / 2) * (100 / particle.z) + canvas.height / 2
        const size = (1 - particle.z / 1000) * particle.size

        if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
          ctx.save()
          ctx.globalAlpha = particle.opacity * (1 - particle.z / 1000)
          ctx.fillStyle = '#8B7355'
          ctx.translate(x, y)
          ctx.rotate(particle.angle)
          ctx.fillRect(-size/2, -size/4, size, size/2)
          ctx.restore()
        }
      })

      // 绘制星星
      const time = Date.now() * 0.001 // 添加时间因子用于闪烁
      starsRef.current.forEach((star, index) => {
        star.z -= star.speed
        
        if (star.z <= 0) {
          star.z = 1000
          star.x = Math.random() * canvas.width
          star.y = Math.random() * canvas.height
        }

        const x = (star.x - canvas.width / 2) * (200 / star.z) + canvas.width / 2
        const y = (star.y - canvas.height / 2) * (200 / star.z) + canvas.height / 2
        const size = (1 - star.z / 1000) * star.size * 2

        if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
          // 缓慢闪烁效果
          const twinkleSpeed = 0.5 + (index % 10) * 0.1 // 不同星星有不同闪烁速度
          const twinkleFactor = (Math.sin(time * twinkleSpeed + index) + 1) * 0.3 + 0.4 // 0.4-1.0之间变化
          
          ctx.save()
          ctx.globalAlpha = star.opacity * (1 - star.z / 1000) * twinkleFactor
          ctx.fillStyle = star.color
          ctx.shadowBlur = 10 + size
          ctx.shadowColor = star.color
          ctx.beginPath()
          ctx.arc(x, y, size * twinkleFactor, 0, Math.PI * 2)
          ctx.fill()
          
          // 添加星芒效果（只对较亮的星星）
          if (size > 1.5 && twinkleFactor > 0.7) {
            ctx.strokeStyle = star.color
            ctx.lineWidth = 0.3
            ctx.globalAlpha = (star.opacity * (1 - star.z / 1000)) * 0.4
            ctx.beginPath()
            ctx.moveTo(x - size * 2.5, y)
            ctx.lineTo(x + size * 2.5, y)
            ctx.moveTo(x, y - size * 2.5)
            ctx.lineTo(x, y + size * 2.5)
            ctx.stroke()
          }
          
          ctx.restore()
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    // 初始化
    resizeCanvas()
    createStars()
    createDust()
    createNebula()
    animate()

    // 监听窗口大小变化
    const handleResize = () => {
      resizeCanvas()
      createStars()
      createDust()
      createNebula()
    }
    
    window.addEventListener('resize', handleResize)

    // 清理函数
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
      }}
    />
  )
}