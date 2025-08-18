'use client'

import React, { useRef, useEffect, useState } from 'react'

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

interface Galaxy3DProps {
  agents: Agent[]
  rotation?: { x: number; y: number }
  zoom?: number
  onPlanetHover?: (agent: Agent | null) => void
  onPlanetClick?: (agent: Agent) => void
  onRotationChange?: (rotation: { x: number; y: number }) => void
  onZoomChange?: (zoom: number) => void
}

interface Planet3D {
  agent: Agent
  x: number
  y: number
  z: number
  orbitRadius: number
  orbitAngle: number
  orbitSpeed: number
  planetSize: number
  color: string
  type: string
}

const planetTypes = [
  { type: 'gas_giant', colors: ['#D2691E', '#CD853F', '#A0522D'], name: '气态巨星' },
  { type: 'ringed', colors: ['#F4A460', '#DEB887', '#D2B48C'], name: '环状行星' },
  { type: 'terrestrial', colors: ['#4682B4', '#5F9EA0', '#20B2AA'], name: '类地行星' },
  { type: 'desert', colors: ['#CD5C5C', '#A0522D', '#8B4513'], name: '沙漠行星' },
  { type: 'ice', colors: ['#B0E0E6', '#87CEEB', '#87CEFA'], name: '冰冻行星' },
  { type: 'lava', colors: ['#FF4500', '#FF6347', '#DC143C'], name: '熔岩行星' }
]

export const Galaxy3D: React.FC<Galaxy3DProps> = ({ 
  agents, 
  rotation: externalRotation,
  zoom: externalZoom,
  onPlanetHover, 
  onPlanetClick,
  onRotationChange,
  onZoomChange
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const planetsRef = useRef<Planet3D[]>([])
  const animationRef = useRef<number>()
  
  // 3D旋转控制
  const [internalRotation, setInternalRotation] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 })
  const [internalZoom, setInternalZoom] = useState(1)
  const [hoveredPlanet, setHoveredPlanet] = useState<Planet3D | null>(null)

  // 使用外部控制的rotation和zoom，如果没有则使用内部状态
  const rotation = externalRotation || internalRotation
  const zoom = externalZoom || internalZoom

  // 初始化3D行星数据
  useEffect(() => {
    const planets: Planet3D[] = agents.map((agent, index) => {
      const orbitRadius = 200 + (index * 150) // 轨道半径
      const orbitAngle = (index * 60) % 360 // 初始角度
      const orbitSpeed = 0.5 / Math.pow(orbitRadius / 200, 0.8) // 开普勒第三定律
      const planetType = planetTypes[index % planetTypes.length]
      
      return {
        agent,
        x: 0,
        y: 0,
        z: 0,
        orbitRadius,
        orbitAngle,
        orbitSpeed,
        planetSize: 30 + (Math.random() * 40),
        color: planetType.colors[0],
        type: planetType.type
      }
    })
    
    planetsRef.current = planets
  }, [agents])

  // 3D数学函数
  const rotateX = (point: { x: number; y: number; z: number }, angle: number) => {
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    return {
      x: point.x,
      y: point.y * cos - point.z * sin,
      z: point.y * sin + point.z * cos
    }
  }

  const rotateY = (point: { x: number; y: number; z: number }, angle: number) => {
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    return {
      x: point.x * cos + point.z * sin,
      y: point.y,
      z: -point.x * sin + point.z * cos
    }
  }

  const project3D = (point: { x: number; y: number; z: number }, canvas: HTMLCanvasElement) => {
    const distance = 800
    const adjustedZ = Math.max(point.z, -distance + 50) // 防止除零和负缩放
    const scale = distance / (distance + adjustedZ)
    const finalScale = Math.max(0.01, scale * zoom) // 确保缩放为正数
    
    return {
      x: (point.x * finalScale) + canvas.width / 2,
      y: (point.y * finalScale) + canvas.height / 2,
      scale: finalScale,
      z: point.z
    }
  }

  // 绘制3D星系
  const draw3DGalaxy = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // 清除画布 - 深空背景
    const gradient = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height)
    )
    gradient.addColorStop(0, 'rgba(15, 23, 42, 0.95)')
    gradient.addColorStop(0.5, 'rgba(5, 15, 35, 0.97)')
    gradient.addColorStop(1, 'rgba(0, 5, 15, 0.99)')
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // 绘制3D星空背景
    drawStarField3D(ctx, canvas)

    // 绘制中央恒星
    drawCentralStar3D(ctx, canvas)

    // 更新并绘制行星
    const planetsWithDepth = planetsRef.current.map(planet => {
      // 更新轨道位置
      planet.orbitAngle += planet.orbitSpeed

      // 计算3D轨道位置
      const orbitX = Math.cos(planet.orbitAngle * Math.PI / 180) * planet.orbitRadius
      const orbitY = Math.sin(planet.orbitAngle * Math.PI / 180) * planet.orbitRadius * 0.3 // 椭圆轨道
      const orbitZ = Math.sin(planet.orbitAngle * Math.PI / 180) * planet.orbitRadius * 0.8

      // 应用3D旋转
      let rotated = { x: orbitX, y: orbitY, z: orbitZ }
      rotated = rotateX(rotated, rotation.x)
      rotated = rotateY(rotated, rotation.y)

      planet.x = rotated.x
      planet.y = rotated.y
      planet.z = rotated.z

      // 投影到2D
      const projected = project3D(rotated, canvas)
      
      return { planet, projected }
    })

    // 按Z深度排序（远的先画）
    planetsWithDepth.sort((a, b) => a.planet.z - b.planet.z)

    // 绘制轨道路径
    drawOrbits3D(ctx, canvas, planetsWithDepth)

    // 绘制行星
    planetsWithDepth.forEach(({ planet, projected }) => {
      drawPlanet3D(ctx, planet, projected)
    })
  }

  // 绘制3D星空（静态版本）
  const drawStarField3D = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const starCount = 400
    const time = Date.now() * 0.001 // 只用于闪烁效果
    
    for (let i = 0; i < starCount; i++) {
      // 固定的星星位置，基于索引生成稳定的位置
      const baseX = (Math.sin(i * 0.618) * 1500) + (Math.sin(i * 0.314) * 800)
      const baseY = (Math.cos(i * 0.618) * 1500) + (Math.cos(i * 0.271) * 800)
      const baseZ = (Math.sin(i * 0.271) * 1500) + (Math.sin(i * 0.182) * 800)
      
      // 星星位置完全静态，不添加任何移动偏移
      const star = {
        x: baseX,
        y: baseY,
        z: baseZ
      }

      let rotated = rotateX(star, rotation.x)
      rotated = rotateY(rotated, rotation.y)
      
      const projected = project3D(rotated, canvas)
      
      if (projected.x > -50 && projected.x < canvas.width + 50 && 
          projected.y > -50 && projected.y < canvas.height + 50 && 
          projected.z > -800) {
        
        // 保留缓慢闪烁效果
        const twinkleSpeed = 0.2 + (i % 7) * 0.05 // 更慢的闪烁速度
        const twinkleFactor = (Math.sin(time * twinkleSpeed + i) + 1) * 0.2 + 0.6 // 0.6-1.0之间变化，减少闪烁幅度
        
        const baseBrightness = Math.max(0.3, 1 - Math.abs(rotated.z) / 1200)
        const brightness = baseBrightness * twinkleFactor
        
        // 星星大小基于距离和索引，保持稳定
        const baseSize = projected.scale * (1.2 + (i % 4) * 0.4)
        const size = baseSize // 大小保持稳定，不随闪烁变化
        
        // 星星颜色保持不变
        const starColors = ['#ffffff', '#ffe9d4', '#ffd4a3', '#fff5d1', '#e1f0ff', '#d4e7ff']
        const starColor = starColors[i % starColors.length]
        
        ctx.save()
        ctx.globalAlpha = brightness * 0.8
        ctx.fillStyle = starColor
        ctx.shadowBlur = 6 + size
        ctx.shadowColor = starColor
        
        ctx.beginPath()
        ctx.arc(projected.x, projected.y, size, 0, Math.PI * 2)
        ctx.fill()
        
        // 添加微弱的星芒效果（只对较亮较大的星星）
        if (brightness > 0.8 && size > 2.5) {
          ctx.strokeStyle = starColor
          ctx.lineWidth = 0.3
          ctx.globalAlpha = brightness * 0.3
          ctx.beginPath()
          ctx.moveTo(projected.x - size * 2, projected.y)
          ctx.lineTo(projected.x + size * 2, projected.y)
          ctx.moveTo(projected.x, projected.y - size * 2)
          ctx.lineTo(projected.x, projected.y + size * 2)
          ctx.stroke()
        }
        
        ctx.restore()
      }
    }
  }

  // 绘制中央恒星
  const drawCentralStar3D = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const star = { x: 0, y: 0, z: 0 }
    let rotated = rotateX(star, rotation.x)
    rotated = rotateY(rotated, rotation.y)
    
    const projected = project3D(rotated, canvas)
    const size = Math.max(10, 60 * projected.scale) // 确保最小尺寸

    // 只有当恒星可见时才绘制
    if (projected.scale <= 0.05 || size < 5) {
      return
    }

    // 外层光晕
    const outerRadius = Math.max(size * 3, 15)
    const outerGradient = ctx.createRadialGradient(
      projected.x, projected.y, 0,
      projected.x, projected.y, outerRadius
    )
    outerGradient.addColorStop(0, 'rgba(255, 165, 0, 0.4)')
    outerGradient.addColorStop(0.3, 'rgba(255, 140, 0, 0.2)')
    outerGradient.addColorStop(1, 'transparent')
    
    ctx.fillStyle = outerGradient
    ctx.beginPath()
    ctx.arc(projected.x, projected.y, outerRadius, 0, Math.PI * 2)
    ctx.fill()

    // 恒星主体
    const starGradient = ctx.createRadialGradient(
      projected.x - size * 0.3, projected.y - size * 0.3, 0,
      projected.x, projected.y, size
    )
    starGradient.addColorStop(0, '#FFF8DC')
    starGradient.addColorStop(0.3, '#FFD700')
    starGradient.addColorStop(0.6, '#FF8C00')
    starGradient.addColorStop(0.8, '#FF6347')
    starGradient.addColorStop(1, '#B22222')
    
    ctx.fillStyle = starGradient
    ctx.shadowBlur = Math.min(30, size)
    ctx.shadowColor = '#FF8C00'
    ctx.beginPath()
    ctx.arc(projected.x, projected.y, size, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0
  }

  // 绘制轨道
  const drawOrbits3D = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, planetsWithDepth: any[]) => {
    planetsWithDepth.forEach(({ planet }) => {
      if (hoveredPlanet?.agent.id === planet.agent.id) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
        ctx.lineWidth = 1
        ctx.setLineDash([5, 5])
        ctx.beginPath()

        // 绘制3D轨道椭圆
        for (let angle = 0; angle <= 360; angle += 5) {
          const orbitX = Math.cos(angle * Math.PI / 180) * planet.orbitRadius
          const orbitY = Math.sin(angle * Math.PI / 180) * planet.orbitRadius * 0.3
          const orbitZ = Math.sin(angle * Math.PI / 180) * planet.orbitRadius * 0.8

          let rotated = { x: orbitX, y: orbitY, z: orbitZ }
          rotated = rotateX(rotated, rotation.x)
          rotated = rotateY(rotated, rotation.y)

          const projected = project3D(rotated, canvas)
          
          if (angle === 0) {
            ctx.moveTo(projected.x, projected.y)
          } else {
            ctx.lineTo(projected.x, projected.y)
          }
        }
        
        ctx.stroke()
        ctx.setLineDash([])
      }
    })
  }

  // 绘制3D行星
  const drawPlanet3D = (ctx: CanvasRenderingContext2D, planet: Planet3D, projected: any) => {
    // 检查投影是否有效（防止负半径错误）
    if (projected.x < -200 || projected.x > ctx.canvas.width + 200 ||
        projected.y < -200 || projected.y > ctx.canvas.height + 200 ||
        projected.scale <= 0 || projected.z < -500) {
      return
    }

    const size = Math.max(1, planet.planetSize * projected.scale) // 确保尺寸为正数
    const planetType = planetTypes.find(type => type.type === planet.type)!

    // 行星阴影（3D效果）
    const shadowOffset = size * 0.3
    ctx.save()
    ctx.globalAlpha = 0.3
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    ctx.beginPath()
    ctx.arc(projected.x + shadowOffset, projected.y + shadowOffset, size, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()

    // 行星纹理
    const planetGradient = ctx.createRadialGradient(
      projected.x - size * 0.3, projected.y - size * 0.3, 0,
      projected.x, projected.y, size
    )
    planetGradient.addColorStop(0, planetType.colors[0])
    planetGradient.addColorStop(0.4, planetType.colors[1])
    planetGradient.addColorStop(0.8, planetType.colors[2])
    planetGradient.addColorStop(1, planetType.colors[2])

    ctx.fillStyle = planetGradient
    ctx.beginPath()
    ctx.arc(projected.x, projected.y, size, 0, Math.PI * 2)
    ctx.fill()

    // 3D高光效果
    const highlightGradient = ctx.createRadialGradient(
      projected.x - size * 0.4, projected.y - size * 0.4, 0,
      projected.x - size * 0.4, projected.y - size * 0.4, size * 0.6
    )
    highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)')
    highlightGradient.addColorStop(1, 'transparent')
    
    ctx.fillStyle = highlightGradient
    ctx.beginPath()
    ctx.arc(projected.x, projected.y, size, 0, Math.PI * 2)
    ctx.fill()

    // 行星环（土星类型）
    if (planet.type === 'ringed') {
      drawPlanetRings(ctx, projected.x, projected.y, size, projected.scale)
    }

    // 行星名称标签
    drawPlanetLabel(ctx, planet, projected.x, projected.y + size + 15, projected.scale)
  }

  // 绘制行星环
  const drawPlanetRings = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, scale: number) => {
    if (size <= 0 || scale <= 0) return // 防止无效参数
    
    ctx.save()
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)'
    ctx.lineWidth = Math.max(0.5, 2 * scale)
    ctx.setLineDash([3, 2])
    
    for (let i = 1; i <= 3; i++) {
      const ringRadiusX = Math.max(1, size * (1.5 + i * 0.3))
      const ringRadiusY = Math.max(0.5, size * 0.2)
      
      ctx.beginPath()
      ctx.ellipse(x, y, ringRadiusX, ringRadiusY, 0, 0, Math.PI * 2)
      ctx.stroke()
    }
    
    ctx.setLineDash([])
    ctx.restore()
  }

  // 绘制行星标签
  const drawPlanetLabel = (ctx: CanvasRenderingContext2D, planet: Planet3D, x: number, y: number, scale: number) => {
    if (scale <= 0.05) return // 太小的行星不显示标签
    
    const fontSize = Math.max(8, Math.min(20, 12 * scale))
    ctx.font = `bold ${fontSize}px sans-serif`
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.textAlign = 'center'
    ctx.shadowBlur = 5
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'
    
    // 背景
    const textWidth = ctx.measureText(planet.agent.name).width
    const bgWidth = Math.max(textWidth + 16, 60)
    const bgHeight = Math.max(fontSize + 8, 20)
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    ctx.fillRect(x - bgWidth/2, y - bgHeight/2, bgWidth, bgHeight)
    
    // 文本
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.fillText(planet.agent.name, x, y + fontSize/3)
    ctx.shadowBlur = 0
  }

  // 动画循环
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const animate = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      
      draw3DGalaxy(ctx, canvas)
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [rotation, zoom, hoveredPlanet])

  // 鼠标/触摸控制
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setLastMouse({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - lastMouse.x
      const deltaY = e.clientY - lastMouse.y
      
      const newRotation = {
        x: rotation.x + deltaY * 0.01,
        y: rotation.y + deltaX * 0.01
      }
      
      if (onRotationChange) {
        onRotationChange(newRotation)
      } else {
        setInternalRotation(newRotation)
      }
      
      setLastMouse({ x: e.clientX, y: e.clientY })
    } else {
      // 检测悬浮的行星
      checkPlanetHover(e.clientX, e.clientY)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1
    const newZoom = Math.max(0.3, Math.min(3, zoom * zoomFactor))
    
    if (onZoomChange) {
      onZoomChange(newZoom)
    } else {
      setInternalZoom(newZoom)
    }
  }

  // 检测行星悬浮
  const checkPlanetHover = (mouseX: number, mouseY: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    let hoveredPlanet = null

    for (const planet of planetsRef.current) {
      let rotated = { x: planet.x, y: planet.y, z: planet.z }
      rotated = rotateX(rotated, rotation.x)
      rotated = rotateY(rotated, rotation.y)

      const projected = project3D(rotated, canvas)
      const size = planet.planetSize * projected.scale
      
      const distance = Math.sqrt(
        Math.pow(mouseX - projected.x, 2) + 
        Math.pow(mouseY - projected.y, 2)
      )
      
      if (distance <= size) {
        hoveredPlanet = planet
        break
      }
    }

    setHoveredPlanet(hoveredPlanet)
    onPlanetHover?.(hoveredPlanet?.agent || null)
  }

  const handleClick = (e: React.MouseEvent) => {
    if (hoveredPlanet) {
      onPlanetClick?.(hoveredPlanet.agent)
    }
  }

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        cursor: isDragging ? 'grabbing' : hoveredPlanet ? 'pointer' : 'grab',
        zIndex: 0
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onClick={handleClick}
    />
  )
}