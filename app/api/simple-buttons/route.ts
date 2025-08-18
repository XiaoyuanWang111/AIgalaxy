import { NextResponse } from 'next/server'

// 简化版本的反馈按钮API，用于测试基本功能
export async function GET() {
  try {
    // 返回硬编码的测试数据
    const buttons = [
      {
        id: 'test-1',
        title: '产品反馈',
        description: '对产品功能的建议',
        url: 'https://forms.gle/test1',
        icon: 'message',
        color: '#1890ff',
        order: 1,
        enabled: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'test-2',
        title: '问题反馈',
        description: '报告使用中遇到的问题',
        url: 'https://forms.gle/test2',
        icon: 'form',
        color: '#f56a00',
        order: 2,
        enabled: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
    
    return NextResponse.json({ buttons })
  } catch (error) {
    console.error('Simple buttons API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch buttons', details: String(error) },
      { status: 500 }
    )
  }
}