import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const dbUrl = process.env.DATABASE_URL || ''
    
    // 解析 URL 组件（隐藏敏感信息）
    let urlInfo = {
      hasUrl: !!dbUrl,
      protocol: '',
      host: '',
      port: '',
      database: '',
      hasPassword: false,
      passwordHasSpecialChars: false,
      rawLength: dbUrl.length
    }
    
    if (dbUrl) {
      try {
        // 尝试解析 URL
        const match = dbUrl.match(/^(postgresql|postgres):\/\/([^:]+):([^@]+)@([^:\/]+):(\d+)\/(.+)/)
        
        if (match) {
          urlInfo.protocol = match[1]
          urlInfo.host = match[4]
          urlInfo.port = match[5]
          urlInfo.database = match[6].split('?')[0]
          urlInfo.hasPassword = !!match[3]
          
          // 检查密码中的特殊字符
          const password = match[3]
          urlInfo.passwordHasSpecialChars = /[#@:/?&=+\s]/.test(password)
        }
      } catch (e) {
        // URL 解析失败
      }
    }
    
    // 检查其他相关环境变量
    const envCheck = {
      DATABASE_URL: urlInfo,
      POSTGRES_URL: !!process.env.POSTGRES_URL,
      POSTGRES_PRISMA_URL: !!process.env.POSTGRES_PRISMA_URL,
      POSTGRES_URL_NON_POOLING: !!process.env.POSTGRES_URL_NON_POOLING,
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: !!process.env.VERCEL,
      VERCEL_ENV: process.env.VERCEL_ENV
    }
    
    // 诊断信息
    const diagnostics = []
    
    if (!dbUrl) {
      diagnostics.push('❌ DATABASE_URL is not set')
    } else if (urlInfo.passwordHasSpecialChars) {
      diagnostics.push('⚠️ Password contains special characters - make sure they are URL encoded')
      diagnostics.push('   # → %23')
      diagnostics.push('   @ → %40')
      diagnostics.push('   : → %3A')
    }
    
    if (urlInfo.port && !['5432', '6543'].includes(urlInfo.port)) {
      diagnostics.push(`⚠️ Unusual port number: ${urlInfo.port}`)
    }
    
    if (!urlInfo.protocol) {
      diagnostics.push('❌ Invalid DATABASE_URL format')
    }
    
    return NextResponse.json({
      success: diagnostics.length === 0,
      environment: envCheck,
      diagnostics,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to check environment',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}