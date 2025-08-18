'use client'

import React from 'react'
import { Input } from 'antd'

const { TextArea } = Input

interface RichTextEditorProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  style?: React.CSSProperties
  height?: number
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "请输入内容...",
  style,
  height = 200
}) => {
  return (
    <TextArea
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      rows={8}
      style={{ minHeight: height, ...style }}
    />
  )
}

export default RichTextEditor