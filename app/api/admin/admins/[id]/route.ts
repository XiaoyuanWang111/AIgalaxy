import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ensureDatabase } from '@/lib/db-middleware'
import bcrypt from 'bcryptjs'
import { getAdminFromToken } from '@/lib/auth'

// 更新管理员信息
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 确保数据库已初始化
    await ensureDatabase()
    
    const admin = await getAdminFromToken(request)
    if (!admin) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const { id } = params
    const { email, password, name, role, canChangePassword, canManageAdmins } = await request.json()

    // 检查权限：只有超级管理员可以修改其他管理员，或者管理员修改自己的信息
    const targetAdmin = await prisma.admin.findUnique({
      where: { id }
    })

    if (!targetAdmin) {
      return NextResponse.json({ error: '管理员不存在' }, { status: 404 })
    }

    // 权限检查
    const isSelf = admin.id === id
    const canManageOthers = admin.canManageAdmins
    
    if (!isSelf && !canManageOthers) {
      return NextResponse.json({ error: '权限不足' }, { status: 403 })
    }

    // 如果要修改密码，检查权限
    if (password && !isSelf && !admin.canChangePassword) {
      return NextResponse.json({ error: '无权修改密码' }, { status: 403 })
    }

    // 如果是自己修改自己的信息，不能修改权限相关字段
    const updateData: any = {}
    
    if (email) updateData.email = email
    if (name) updateData.name = name
    if (password) updateData.password = await bcrypt.hash(password, 10)
    
    // 只有有管理权限的用户才能修改角色和权限
    if (canManageOthers && !isSelf) {
      if (role !== undefined) updateData.role = role
      if (canChangePassword !== undefined) updateData.canChangePassword = canChangePassword
      if (canManageAdmins !== undefined) updateData.canManageAdmins = canManageAdmins
    }

    const updatedAdmin = await prisma.admin.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        canChangePassword: true,
        canManageAdmins: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json(updatedAdmin)
  } catch (error) {
    console.error('更新管理员失败:', error)
    return NextResponse.json({ error: '更新管理员失败' }, { status: 500 })
  }
}

// 删除管理员
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 确保数据库已初始化
    await ensureDatabase()
    
    const admin = await getAdminFromToken(request)
    if (!admin || !admin.canManageAdmins) {
      return NextResponse.json({ error: '权限不足' }, { status: 403 })
    }

    const { id } = params

    // 不能删除自己
    if (admin.id === id) {
      return NextResponse.json({ error: '不能删除自己的账号' }, { status: 400 })
    }

    // 检查要删除的管理员是否存在
    const targetAdmin = await prisma.admin.findUnique({
      where: { id }
    })

    if (!targetAdmin) {
      return NextResponse.json({ error: '管理员不存在' }, { status: 404 })
    }

    // 不能删除超级管理员
    if (targetAdmin.role === 'SUPER_ADMIN') {
      return NextResponse.json({ error: '不能删除超级管理员' }, { status: 400 })
    }

    await prisma.admin.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除管理员失败:', error)
    return NextResponse.json({ error: '删除管理员失败' }, { status: 500 })
  }
}