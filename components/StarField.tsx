'use client'

import React, { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  z: number
  speed: number
  size: number
  opacity: number
}

export const StarField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<Star[]>([])
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
      const numStars = 300

      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: Math.random() * 1000,
          speed: 0.2 + Math.random() * 0.3,
          size: Math.random() * 2,
          opacity: Math.random() * 0.8 + 0.2
        })
      }
      starsRef.current = stars
    }

    // 动画循环
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 20, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      starsRef.current.forEach((star) => {
        // 移动星星
        star.z -= star.speed
        
        // 重置离屏的星星
        if (star.z <= 0) {
          star.z = 1000
          star.x = Math.random() * canvas.width
          star.y = Math.random() * canvas.height
        }

        // 3D投影计算
        const x = (star.x - canvas.width / 2) * (200 / star.z) + canvas.width / 2
        const y = (star.y - canvas.height / 2) * (200 / star.z) + canvas.height / 2
        const size = (1 - star.z / 1000) * star.size * 2

        // 绘制星星
        if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
          ctx.save()
          ctx.globalAlpha = star.opacity * (1 - star.z / 1000)
          ctx.fillStyle = '#ffffff'
          ctx.shadowBlur = 10
          ctx.shadowColor = '#ffffff'
          ctx.beginPath()
          ctx.arc(x, y, size, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    // 初始化
    resizeCanvas()
    createStars()
    animate()

    // 监听窗口大小变化
    window.addEventListener('resize', () => {
      resizeCanvas()
      createStars()
    })

    // 清理函数
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener('resize', resizeCanvas)
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
        background: 'radial-gradient(ellipse at center, #0d1421 0%, #000510 70%, #000000 100%)'
      }}
    />
  )
}