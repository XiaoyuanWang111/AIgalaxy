'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ApplicationFormProps {
  agentId: string
  agentName: string
  onClose: () => void
}

export function ApplicationForm({ agentId, agentName, onClose }: ApplicationFormProps) {
  const [formData, setFormData] = useState({
    applicantName: '',
    email: '',
    reason: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentId,
          applicantName: formData.applicantName,
          email: formData.email,
          reason: formData.reason
        })
      })

      if (!response.ok) {
        throw new Error('Failed to submit application')
      }

      setIsSubmitted(true)
      
      // 3秒后自动关闭
      setTimeout(() => {
        onClose()
      }, 3000)
    } catch (error) {
      console.error('Error submitting application:', error)
      alert('提交申请失败，请稍后重试')
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">✅</span>
            </div>
            <CardTitle className="text-green-600">申请已提交！</CardTitle>
            <CardDescription>
              我们已收到您对 {agentName} 的申请，主理人会尽快与您联系。
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={onClose} className="w-full">
              确定
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>申请使用 {agentName}</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            请填写以下信息，主理人会尽快与您联系并提供使用权限。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="applicantName">姓名 *</Label>
              <Input
                id="applicantName"
                name="applicantName"
                value={formData.applicantName}
                onChange={handleChange}
                placeholder="请输入您的姓名"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">邮箱 *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="请输入您的邮箱地址"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reason">申请原因</Label>
              <Textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="请简述您的使用场景和需求..."
                rows={3}
              />
            </div>
            
            <div className="flex space-x-3">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                取消
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || !formData.applicantName || !formData.email}
                className="flex-1"
              >
                {isSubmitting ? '提交中...' : '提交申请'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}