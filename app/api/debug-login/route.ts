import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('=== Debug Login Start ===')
    
    // 1. 检查数据库连接
    console.log('Testing database connection...')
    const testQuery = await prisma.$queryRaw`SELECT 1 as test`
    console.log('Database connection OK:', testQuery)
    
    // 2. 检查admins表
    console.log('Checking admins table...')
    const adminCount = await prisma.admin.count()
    console.log('Admin count:', adminCount)
    
    // 3. 如果没有管理员，创建一个
    if (adminCount === 0) {
      console.log('Creating admin using raw SQL...')
      const bcrypt = await import('bcryptjs')
      const hashedPassword = await bcrypt.hash('admin123', 10)
      console.log('Password hashed successfully')
      
      await prisma.$executeRaw`INSERT INTO admins (
        id, email, password, name, role, can_change_password, can_manage_admins, created_at, updated_at
      ) VALUES (
        'debug-admin', 'admin@example.com', ${hashedPassword}, 'Debug Admin', 'SUPER_ADMIN', true, true, NOW(), NOW()
      )`
      console.log('Admin created with raw SQL')
    }
    
    // 4. 查询管理员
    console.log('Querying admin...')
    const admin = await prisma.admin.findUnique({
      where: { email: 'admin@example.com' }
    })
    console.log('Admin found:', admin ? 'YES' : 'NO')
    
    // 5. 测试密码验证
    if (admin) {
      console.log('Testing password verification...')
      const bcrypt = await import('bcryptjs')
      const isValid = await bcrypt.compare('admin123', admin.password)
      console.log('Password valid:', isValid)
    }
    
    return NextResponse.json({
      success: true,
      debug: {
        databaseConnected: true,
        adminCount: await prisma.admin.count(),
        adminExists: !!admin,
        passwordTest: admin ? 'tested' : 'skipped'
      }
    })
    
  } catch (error) {
    console.error('Debug login error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}