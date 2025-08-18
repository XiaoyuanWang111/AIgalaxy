'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, Form, Input, Button, Typography, message, Space } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'

const { Title } = Typography

export default function AdminLogin() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(values),
      })

      const result = await response.json()

      if (response.ok) {
        message.success('登录成功')
        // 延迟跳转，确保Cookie设置完成
        setTimeout(() => {
          router.push('/admin')
        }, 100)
      } else {
        message.error(result.error || '登录失败')
      }
    } catch (error) {
      message.error('登录失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Card style={{ width: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2}>管理员登录</Title>
        </div>
        <Form
          name="admin_login"
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            name="email"
            label="邮箱"
            rules={[{ required: true, message: '请输入邮箱' }]}
          >
            <Input 
              id="admin-email"
              prefix={<UserOutlined />} 
              placeholder="admin@example.com"
              style={{
                color: '#000000 !important',
                backgroundColor: '#ffffff !important'
              }}
              styles={{
                input: {
                  color: '#000000 !important',
                  backgroundColor: '#ffffff !important'
                }
              }}
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password 
              id="admin-password"
              prefix={<LockOutlined />} 
              placeholder="请输入密码"
              style={{
                color: '#000000 !important',
                backgroundColor: '#ffffff !important'
              }}
              styles={{
                input: {
                  color: '#000000 !important',
                  backgroundColor: '#ffffff !important'
                }
              }}
            />
          </Form.Item>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              style={{ width: '100%' }}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}