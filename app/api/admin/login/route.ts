import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { generateAdminToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ensureDatabase } from '@/lib/db-middleware'
import { ensureDefaultAdmin } from '@/lib/init-admin'

export async function POST(request: NextRequest) {
  try {
    console.log('=== Login attempt start ===')
    const { email, password } = await request.json()
    console.log('Login attempt for:', email)

    // 确保数据库已初始化
    await ensureDatabase()
    
    // 确保有默认管理员
    await ensureDefaultAdmin()

    const admin = await prisma.admin.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        role: true,
        canChangePassword: true,
        canManageAdmins: true
      }
    })
    
    console.log('Admin found:', !!admin)

    if (!admin) {
      console.log('Admin not found')
      return NextResponse.json({ error: '管理员不存在' }, { status: 401 })
    }

    console.log('Verifying password...')
    const isValid = await bcrypt.compare(password, admin.password)
    console.log('Password valid:', isValid)

    if (!isValid) {
      console.log('Password verification failed')
      return NextResponse.json({ error: '密码错误' }, { status: 401 })
    }

    // 生成JWT Token
    console.log('Generating token...')
    const token = generateAdminToken(admin.id)
    console.log('Token generated successfully')
    
    const response = NextResponse.json({ 
      success: true, 
      admin: { 
        id: admin.id, 
        email: admin.email, 
        name: admin.name,
        role: admin.role,
        canChangePassword: admin.canChangePassword,
        canManageAdmins: admin.canManageAdmins
      } 
    })

    // 设置cookie
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7天
    })

    console.log('Login successful, returning response')
    return response
  } catch (error) {
    console.error('=== Login Error ===')
    console.error('Error message:', error instanceof Error ? error.message : String(error))
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    console.error('Error object:', error)
    return NextResponse.json({ 
      error: '登录失败',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const response = NextResponse.json({ success: true })
  response.cookies.delete('admin-token')
  return response
}

export async function GET(request: NextRequest) {
  try {
    const { getAdminFromToken } = await import('@/lib/auth')
    const admin = await getAdminFromToken(request)
    
    if (admin) {
      return NextResponse.json({ 
        isAuthenticated: true,
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
          canChangePassword: admin.canChangePassword,
          canManageAdmins: admin.canManageAdmins
        }
      })
    } else {
      return NextResponse.json({ isAuthenticated: false })
    }
  } catch (error) {
    return NextResponse.json({ isAuthenticated: false })
  }
}