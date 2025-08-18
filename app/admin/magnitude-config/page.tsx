'use client'

import React, { useState, useEffect } from 'react'
import { Card, Form, Input, Button, Space, message, Table, Modal, Switch } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

interface StarMagnitudeConfig {
  id: string
  magnitude: number
  minClicks: number
  maxClicks?: number
  size: number
  brightness: number
  glow: number
  color: string
  label: string
  description?: string
  isEnabled: boolean
  orderIndex: number
}

export default function MagnitudeConfigPage() {
  const [configs, setConfigs] = useState<StarMagnitudeConfig[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingConfig, setEditingConfig] = useState<StarMagnitudeConfig | null>(null)
  const [form] = Form.useForm()

  useEffect(() => {
    fetchConfigs()
  }, [])

  const fetchConfigs = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/magnitude-config', {
        credentials: 'include'
      })
      const data = await response.json()
      if (data.success) {
        setConfigs(data.data)
      }
    } catch (error) {
      message.error('获取配置失败')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingConfig(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (config: StarMagnitudeConfig) => {
    setEditingConfig(config)
    form.setFieldsValue(config)
    setModalVisible(true)
  }

  const handleDelete = async (magnitude: number) => {
    try {
      const response = await fetch(`/api/magnitude-config/${magnitude}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      const data = await response.json()
      if (data.success) {
        message.success('删除成功')
        fetchConfigs()
      } else {
        message.error(data.message)
      }
    } catch (error) {
      message.error('删除失败')
    }
  }

  const handleSubmit = async (values: any) => {
    try {
      const response = await fetch('/api/magnitude-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(values)
      })
      const data = await response.json()
      if (data.success) {
        message.success(editingConfig ? '更新成功' : '创建成功')
        setModalVisible(false)
        fetchConfigs()
      } else {
        message.error(data.message)
      }
    } catch (error) {
      message.error('操作失败')
    }
  }

  const columns = [
    {
      title: '星等',
      dataIndex: 'magnitude',
      key: 'magnitude',
      width: 80,
      render: (magnitude: number) => <span style={{ fontWeight: 'bold' }}>{magnitude}等星</span>
    },
    {
      title: '点击次数',
      dataIndex: 'minClicks',
      key: 'clicks',
      width: 120,
      render: (minClicks: number, record: StarMagnitudeConfig) => (
        <span>
          {minClicks}{record.maxClicks ? `-${record.maxClicks}` : '+'}
        </span>
      )
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
      width: 80,
      render: (size: number) => `${size}px`
    },
    {
      title: '亮度',
      dataIndex: 'brightness',
      key: 'brightness',
      width: 80,
      render: (brightness: number) => `${(brightness * 100).toFixed(0)}%`
    },
    {
      title: '光晕',
      dataIndex: 'glow',
      key: 'glow',
      width: 80,
      render: (glow: number) => `${glow}px`
    },
    {
      title: '颜色',
      dataIndex: 'color',
      key: 'color',
      width: 100,
      render: (color: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 20, height: 20, backgroundColor: color, borderRadius: '50%' }} />
          <span>{color}</span>
        </div>
      )
    },
    {
      title: '标签',
      dataIndex: 'label',
      key: 'label'
    },
    {
      title: '状态',
      dataIndex: 'isEnabled',
      key: 'isEnabled',
      width: 80,
      render: (isEnabled: boolean) => (
        <span style={{ color: isEnabled ? 'green' : 'red' }}>
          {isEnabled ? '启用' : '禁用'}
        </span>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: StarMagnitudeConfig) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.magnitude)}
          />
        </Space>
      )
    }
  ]

  return (
    <div style={{ padding: '24px' }}>
      <Card title="星等配置管理" extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加配置
        </Button>
      }>
        <Table
          columns={columns}
          dataSource={configs}
          loading={loading}
          rowKey="magnitude"
          pagination={false}
          scroll={{ x: 'max-content' }}
        />
      </Card>

      <Modal
        title={editingConfig ? '编辑星等配置' : '添加星等配置'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            isEnabled: true,
            color: '#FFFFFF',
            size: 4,
            brightness: 0.7,
            glow: 10
          }}
        >
          <Form.Item
            label="星等"
            name="magnitude"
            rules={[{ required: true, message: '请输入星等' }]}
          >
            <Input type="number" min={1} max={7} placeholder="1-7" />
          </Form.Item>

          <Form.Item
            label="最小点击次数"
            name="minClicks"
            rules={[{ required: true, message: '请输入最小点击次数' }]}
          >
            <Input type="number" min={0} placeholder="达到此星等的最小点击次数" />
          </Form.Item>

          <Form.Item
            label="最大点击次数"
            name="maxClicks"
            rules={[{ type: 'number', min: 0 }]}
          >
            <Input type="number" placeholder="可选，达到此星等的最大点击次数" />
          </Form.Item>

          <Form.Item
            label="星星大小 (像素)"
            name="size"
            rules={[{ required: true, message: '请输入星星大小' }]}
          >
            <Input type="number" min={1} max={20} step={0.5} />
          </Form.Item>

          <Form.Item
            label="亮度 (0-1)"
            name="brightness"
            rules={[{ required: true, message: '请输入亮度值' }]}
          >
            <Input type="number" min={0.1} max={1} step={0.1} />
          </Form.Item>

          <Form.Item
            label="光晕大小 (像素)"
            name="glow"
            rules={[{ required: true, message: '请输入光晕大小' }]}
          >
            <Input type="number" min={1} max={50} />
          </Form.Item>

          <Form.Item
            label="颜色"
            name="color"
            rules={[{ required: true, message: '请输入颜色' }]}
          >
            <Input type="color" />
          </Form.Item>

          <Form.Item
            label="标签"
            name="label"
            rules={[{ required: true, message: '请输入标签' }]}
          >
            <Input placeholder="如：超亮星、一等星、二等星等" />
          </Form.Item>

          <Form.Item
            label="描述"
            name="description"
          >
            <Input.TextArea placeholder="可选，对此星等的描述" />
          </Form.Item>

          <Form.Item
            label="启用"
            name="isEnabled"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingConfig ? '更新' : '创建'}
              </Button>
              <Button onClick={() => setModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}