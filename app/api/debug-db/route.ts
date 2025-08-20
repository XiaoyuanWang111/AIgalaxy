import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // 获取所有数据库相关的环境变量
    const dbUrl = process.env.DATABASE_URL || ''
    const postgresUrl = process.env.POSTGRES_URL || ''
    const postgresPrismaUrl = process.env.POSTGRES_PRISMA_URL || ''
    
    // 详细分析 DATABASE_URL
    const analysis = {
      raw: {
        length: dbUrl.length,
        hasValue: !!dbUrl,
        firstChar: dbUrl.charAt(0),
        lastChar: dbUrl.charAt(dbUrl.length - 1),
        hasLeadingSpace: dbUrl.startsWith(' '),
        hasTrailingSpace: dbUrl.endsWith(' '),
        hasNewline: dbUrl.includes('\n'),
        hasCarriageReturn: dbUrl.includes('\r'),
        hasTab: dbUrl.includes('\t')
      },
      encoded: {
        hasPercentEncoding: dbUrl.includes('%'),
        percentMatches: (dbUrl.match(/%/g) || []).length,
        hasHashSymbol: dbUrl.includes('#'),
        hasAtSymbol: dbUrl.includes('@'),
        atSymbolCount: (dbUrl.match(/@/g) || []).length
      }
    }
    
    // 尝试手动解析 URL
    const parseResult = { success: false, error: '', components: {} as any }
    try {
      // 使用更宽松的正则表达式
      const regex = /^(postgresql|postgres):\/\/([^\/]+)\/(.+)$/
      const match = dbUrl.match(regex)
      
      if (match) {
        const [, protocol, authAndHost, pathAndQuery] = match
        
        // 进一步解析 auth 和 host
        const authHostRegex = /^([^@]+)@(.+)$/
        const authHostMatch = authAndHost.match(authHostRegex)
        
        if (authHostMatch) {
          const [, auth, hostPort] = authHostMatch
          const [username, password] = auth.split(':')
          const [host, port] = hostPort.split(':')
          
          parseResult.success = true
          parseResult.components = {
            protocol,
            username,
            passwordLength: password ? password.length : 0,
            passwordPreview: password ? `${password.substring(0, 3)}...${password.substring(password.length - 3)}` : '',
            host,
            port,
            database: pathAndQuery.split('?')[0],
            hasQueryParams: pathAndQuery.includes('?')
          }
        }
      }
    } catch (e) {
      parseResult.error = e instanceof Error ? e.message : 'Parse failed'
    }
    
    // 尝试使用 URL 构造函数
    const urlConstructorResult = { success: false, error: '', parsed: {} as any }
    try {
      // 替换 postgresql:// 为 https:// 以使用 URL 构造函数
      const testUrl = dbUrl.replace(/^postgresql:\/\//, 'https://')
      const parsed = new URL(testUrl)
      urlConstructorResult.success = true
      urlConstructorResult.parsed = {
        protocol: parsed.protocol,
        username: parsed.username,
        passwordLength: parsed.password.length,
        hostname: parsed.hostname,
        port: parsed.port,
        pathname: parsed.pathname
      }
    } catch (e) {
      urlConstructorResult.error = e instanceof Error ? e.message : 'URL constructor failed'
    }
    
    // 检查 Prisma 能否解析
    const prismaCheck = { success: false, error: '', version: '' }
    try {
      const { PrismaClient } = await import('@prisma/client')
      prismaCheck.version = require('@prisma/client/package.json').version
      
      // 尝试创建客户端（不连接）
      const testClient = new PrismaClient({
        datasources: {
          db: {
            url: dbUrl
          }
        }
      })
      prismaCheck.success = true
    } catch (e) {
      prismaCheck.error = e instanceof Error ? e.message : 'Prisma check failed'
    }
    
    // 返回综合调试信息
    return NextResponse.json({
      success: true,
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL: !!process.env.VERCEL,
        VERCEL_ENV: process.env.VERCEL_ENV
      },
      databaseUrls: {
        DATABASE_URL: analysis,
        POSTGRES_URL: { hasValue: !!postgresUrl, length: postgresUrl.length },
        POSTGRES_PRISMA_URL: { hasValue: !!postgresPrismaUrl, length: postgresPrismaUrl.length }
      },
      parsing: {
        manual: parseResult,
        urlConstructor: urlConstructorResult,
        prisma: prismaCheck
      },
      recommendations: generateRecommendations(analysis, parseResult, prismaCheck),
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Debug API error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

function generateRecommendations(analysis: any, parseResult: any, prismaCheck: any): string[] {
  const recommendations = []
  
  if (!analysis.raw.hasValue) {
    recommendations.push('❌ DATABASE_URL is not set')
  }
  
  if (analysis.raw.hasLeadingSpace || analysis.raw.hasTrailingSpace) {
    recommendations.push('⚠️ Remove leading/trailing spaces from DATABASE_URL')
  }
  
  if (analysis.raw.hasNewline || analysis.raw.hasCarriageReturn) {
    recommendations.push('⚠️ Remove line breaks from DATABASE_URL')
  }
  
  if (analysis.encoded.hasHashSymbol) {
    recommendations.push('⚠️ Raw # symbol found - should be encoded as %23')
  }
  
  if (!analysis.encoded.hasPercentEncoding && analysis.encoded.hasHashSymbol) {
    recommendations.push('❌ Special characters not encoded properly')
  }
  
  if (analysis.encoded.atSymbolCount !== 1) {
    recommendations.push('❌ Invalid URL format - should have exactly one @ symbol')
  }
  
  if (!parseResult.success) {
    recommendations.push('❌ URL format is invalid for PostgreSQL')
  }
  
  if (prismaCheck.error.includes('invalid domain character')) {
    recommendations.push('❌ Prisma cannot parse the URL - check for hidden characters')
    recommendations.push('💡 Try copying the URL from the encoder script output')
  }
  
  return recommendations
}