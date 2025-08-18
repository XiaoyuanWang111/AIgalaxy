import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ensureDatabase } from '@/lib/db-middleware'
import bcrypt from 'bcryptjs'
import { getAdminFromToken } from '@/lib/auth'

// 获取所有管理员列表
export async function GET(request: NextRequest) {
  try {
    // 确保数据库已初始化
    await ensureDatabase()
    
    const admin = await getAdminFromToken(request)
    if (!admin || !admin.canManageAdmins) {
      return NextResponse.json({ error: '权限不足' }, { status: 403 })
    }

    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        canChangePassword: true,
        canManageAdmins: true,
        createdBy: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(admins)
  } catch (error) {
    console.error('获取管理员列表失败:', error)
    return NextResponse.json({ error: '获取管理员列表失败' }, { status: 500 })
  }
}

// 创建新管理员
export async function POST(request: NextRequest) {
  try {
    // 确保数据库已初始化
    await ensureDatabase()
    
    const admin = await getAdminFromToken(request)
    if (!admin || !admin.canManageAdmins) {
      return NextResponse.json({ error: '权限不足' }, { status: 403 })
    }

    const { email, password, name, role, canChangePassword, canManageAdmins } = await request.json()

    // 验证必要字段
    if (!email || !password || !name) {
      return NextResponse.json({ error: '邮箱、密码和姓名为必填项' }, { status: 400 })
    }

    // 检查邮箱是否已存在
    const existingAdmin = await prisma.admin.findUnique({
      where: { email }
    })

    if (existingAdmin) {
      return NextResponse.json({ error: '该邮箱已被使用' }, { status: 400 })
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10)

    // 创建新管理员
    const newAdmin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || 'ADMIN',
        canChangePassword: canChangePassword || false,
        canManageAdmins: canManageAdmins || false,
        createdBy: admin.id
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        canChangePassword: true,
        canManageAdmins: true,
        createdAt: true
      }
    })

    return NextResponse.json(newAdmin)
  } catch (error) {
    console.error('创建管理员失败:', error)
    return NextResponse.json({ error: '创建管理员失败' }, { status: 500 })
  }
}