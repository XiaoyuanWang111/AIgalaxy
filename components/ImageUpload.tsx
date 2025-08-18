'use client'

import { useState } from 'react'
import { Upload, Button, Image, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import type { UploadFile } from 'antd/es/upload'

interface ImageUploadProps {
  value?: string
  onChange?: (value: string) => void
  onUpload?: (url: string) => void
}

export function ImageUpload({ value, onChange, onUpload }: ImageUploadProps) {
  const [loading, setLoading] = useState(false)

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      message.error('只能上传图片文件！')
      return false
    }

    if (file.size > 5 * 1024 * 1024) {
      message.error('图片大小不能超过5MB！')
      return false
    }

    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        message.success('上传成功！')
        if (onChange) onChange(data.url)
        if (onUpload) onUpload(data.url)
      } else {
        message.error(data.error || '上传失败')
      }
    } catch (error) {
      message.error('上传失败')
    } finally {
      setLoading(false)
    }

    return false // 阻止自动上传
  }

  return (
    <div>
      <Upload
        accept="image/*"
        showUploadList={false}
        beforeUpload={handleUpload}
      >
        <Button icon={<UploadOutlined />} loading={loading}>
          上传图片
        </Button>
      </Upload>
      
      {value && (
        <div style={{ marginTop: 8 }}>
          <Image
            src={value}
            alt="预览"
            style={{ 
              width: '100%', 
              maxWidth: '200px', 
              height: '100px', 
              objectFit: 'cover',
              borderRadius: 8
            }}
          />
        </div>
      )}
    </div>
  )
}