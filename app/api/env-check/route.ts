import { NextResponse } from 'next/server'

// 环境变量检查API
export async function GET() {
  try {
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL: process.env.DATABASE_URL ? 'configured' : 'missing',
      JWT_SECRET: process.env.JWT_SECRET ? 'configured' : 'missing',
      timestamp: new Date().toISOString()
    }
    
    return NextResponse.json({
      status: 'success',
      environment: envCheck,
      message: 'Environment variables checked'
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: String(error)
    }, { status: 500 })
  }
}