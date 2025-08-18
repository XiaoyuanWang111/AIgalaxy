import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // 输出环境变量信息（隐藏敏感部分）
    const dbUrl = process.env.DATABASE_URL || ''
    const maskedUrl = dbUrl ? dbUrl.replace(/:([^@]+)@/, ':****@') : 'Not set'
    
    console.log('Database URL:', maskedUrl)
    console.log('Environment:', process.env.NODE_ENV)
    console.log('Vercel:', process.env.VERCEL ? 'Yes' : 'No')
    
    // 测试数据库连接
    await prisma.$connect()
    console.log('Database connected successfully')
    
    // 检查各个表是否存在
    const checks = {
      agents: 0,
      admins: 0,
      danmakuConfig: 0,
      feedbackButtons: 0,
      starMagnitudeConfigs: 0
    }
    
    try {
      checks.agents = await prisma.agent.count()
    } catch (e) {
      console.error('Agents table error:', e)
    }
    
    try {
      checks.admins = await prisma.admin.count()
    } catch (e) {
      console.error('Admins table error:', e)
    }
    
    try {
      checks.danmakuConfig = await prisma.danmakuConfig.count()
    } catch (e) {
      console.error('DanmakuConfig table error:', e)
    }
    
    try {
      checks.feedbackButtons = await prisma.feedbackButton.count()
    } catch (e) {
      console.error('FeedbackButtons table error:', e)
    }
    
    try {
      checks.starMagnitudeConfigs = await prisma.starMagnitudeConfig.count()
    } catch (e) {
      console.error('StarMagnitudeConfigs table error:', e)
    }
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      databaseUrl: maskedUrl,
      environment: process.env.NODE_ENV,
      isVercel: !!process.env.VERCEL,
      tables: checks,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Database initialization failed:', error)
    
    // 更详细的错误信息
    let errorMessage = 'Unknown error'
    let errorCode = 'UNKNOWN'
    
    if (error instanceof Error) {
      errorMessage = error.message
      
      if (errorMessage.includes('P1001')) {
        errorCode = 'CONNECTION_FAILED'
        errorMessage = 'Cannot reach database server. Please check your DATABASE_URL.'
      } else if (errorMessage.includes('P1003')) {
        errorCode = 'DATABASE_NOT_FOUND'
        errorMessage = 'Database does not exist.'
      } else if (errorMessage.includes('P2002')) {
        errorCode = 'UNIQUE_CONSTRAINT'
        errorMessage = 'Unique constraint violation.'
      } else if (errorMessage.includes('DATABASE_URL')) {
        errorCode = 'NO_DATABASE_URL'
        errorMessage = 'DATABASE_URL environment variable is not set.'
      }
    }
    
    return NextResponse.json({
      success: false,
      error: errorMessage,
      errorCode,
      databaseUrl: process.env.DATABASE_URL ? 'Set (hidden)' : 'Not set',
      environment: process.env.NODE_ENV,
      isVercel: !!process.env.VERCEL,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}