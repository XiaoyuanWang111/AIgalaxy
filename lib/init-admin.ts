import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export async function ensureDefaultAdmin() {
  try {
    // 检查是否已有管理员
    const adminCount = await prisma.admin.count()
    
    if (adminCount === 0) {
      console.log('[Init] No admin found, creating default admin...')
      
      // 创建默认管理员
      const hashedPassword = await bcrypt.hash('miracleplus666,.', 10)
      
      await prisma.admin.create({
        data: {
          email: 'admin@example.com',
          password: hashedPassword,
          name: '超级管理员',
          role: 'SUPER_ADMIN',
          canChangePassword: true,
          canManageAdmins: true
        }
      })
      
      console.log('[Init] Default admin created successfully')
      console.log('[Init] Email: admin@example.com')
      console.log('[Init] Password: miracleplus666,.')
    }
  } catch (error) {
    console.error('[Init] Error creating default admin:', error)
    // 不抛出错误，避免影响应用启动
  }
}