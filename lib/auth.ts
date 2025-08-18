import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from './prisma'
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export interface AdminUser {
  id: string
  email: string
  name: string
  role: string
  canChangePassword: boolean
  canManageAdmins: boolean
}

// 从请求中获取管理员信息
export async function getAdminFromToken(request: NextRequest): Promise<AdminUser | null> {
  try {
    const token = request.cookies.get('admin-token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { adminId: string }
    
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.adminId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        canChangePassword: true,
        canManageAdmins: true
      }
    })

    return admin
  } catch (error) {
    console.error('Token验证失败:', error)
    return null
  }
}

// 生成JWT Token
export function generateAdminToken(adminId: string): string {
  return jwt.sign({ adminId }, JWT_SECRET, { expiresIn: '7d' })
}

// 验证管理员权限
export function hasPermission(admin: AdminUser | null, permission: 'changePassword' | 'manageAdmins'): boolean {
  if (!admin) return false
  
  switch (permission) {
    case 'changePassword':
      return admin.canChangePassword || admin.role === 'SUPER_ADMIN'
    case 'manageAdmins':
      return admin.canManageAdmins || admin.role === 'SUPER_ADMIN'
    default:
      return false
  }
}