'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Card, Table, Button, Space, Tag, Modal, Form, Input, Select, Switch, message, Typography, Row, Col, Statistic, Upload, Image, Tabs, Rate, Divider } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, ToolOutlined, MessageOutlined, StarOutlined, UploadOutlined, SettingOutlined, EyeOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { ImageUpload } from '@/components/ImageUpload'
import MarkdownRenderer from '@/components/MarkdownRenderer'

const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), {
  ssr: false,
  loading: () => <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #d9d9d9', borderRadius: 6 }}>加载编辑器中...</div>
})

const { Title, Text } = Typography
const { TextArea } = Input
const { Option } = Select
const { TabPane } = Tabs

interface Agent {
  id: string
  name: string
  description: string
  tags: string[]
  manager: string
  homepage?: string
  icon?: string
  coverImage?: string
  guideContent?: string
  enabled: boolean
  themeColor?: string
  createdAt: string
  applications: any[]
  feedback: any[]
}

interface Application {
  id: string
  agentId: string
  agentName: string
  applicantName: string
  email: string
  reason: string
  status: string
  createdAt: string
}

interface Feedback {
  id: string
  agentId: string
  agentName: string
  userName: string
  email?: string
  score: number
  comment: string
  createdAt: string
}

interface FeedbackButton {
  id: string
  title: string
  description?: string
  url: string
  icon?: string
  color?: string
  order: number
  enabled: boolean
  createdAt: string
  updatedAt: string
}

export default function AdminDashboard() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [feedbackButtons, setFeedbackButtons] = useState<FeedbackButton[]>([])
  const [tutorialConfig, setTutorialConfig] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null)
  const [form] = Form.useForm()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [buttonModalVisible, setButtonModalVisible] = useState(false)
  const [editingButton, setEditingButton] = useState<FeedbackButton | null>(null)
  const [buttonForm] = Form.useForm()
  const [tutorialModalVisible, setTutorialModalVisible] = useState(false)
  const [tutorialForm] = Form.useForm()
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewContent, setPreviewContent] = useState('')
  const router = useRouter()

  const [activeTab, setActiveTab] = useState('agents')

  useEffect(() => {
    checkAuth()
  }, [])
  
  useEffect(() => {
    if (isAuthenticated) {
      fetchData()
      fetchFeedbackButtons()
      fetchTutorialConfig()
    }
  }, [isAuthenticated])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/login', {
        credentials: 'include'
      })
      const data = await response.json()
      if (!data.isAuthenticated) {
        router.push('/admin/login')
      } else {
        setIsAuthenticated(true)
      }
    } catch (error) {
      router.push('/admin/login')
    }
  }


  const fetchFeedbackButtons = async () => {
    try {
      const response = await fetch('/api/feedback-buttons')
      const data = await response.json()
      setFeedbackButtons(data.buttons || [])
    } catch (error) {
      message.error('获取按钮配置失败')
    }
  }

  const fetchTutorialConfig = async () => {
    try {
      const response = await fetch('/api/tutorial-config')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setTutorialConfig(data.data)
          tutorialForm.setFieldsValue(data.data)
        }
      }
    } catch (error) {
      console.error('获取教程配置失败:', error)
    }
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      const [agentsRes, applicationsRes, feedbackRes] = await Promise.all([
        fetch('/api/admin/agents', { credentials: 'include' }),
        fetch('/api/applications', { credentials: 'include' }),
        fetch('/api/feedback', { credentials: 'include' })
      ])

      const agentsData = await agentsRes.json()
      const applicationsData = await applicationsRes.json()
      const feedbackData = await feedbackRes.json()

      setAgents(agentsData.agents || [])
      setApplications(applicationsData.applications || [])
      setFeedback(feedbackData.feedback || [])
    } catch (error) {
      message.error('数据加载失败')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (values: any) => {
    try {
      console.log('[Admin] Starting submit - values:', values)
      console.log('[Admin] Editing agent:', editingAgent)
      
      // Convert tags string to array
      const processedValues = {
        ...values,
        tags: values.tags ? values.tags.split(',').map((tag: string) => tag.trim()) : []
      }
      
      const url = editingAgent ? `/api/agents/${editingAgent.id}` : '/api/agents'
      const method = editingAgent ? 'PUT' : 'POST'
      
      console.log('[Admin] Request URL:', url)
      console.log('[Admin] Request method:', method)
      console.log('[Admin] Request body:', JSON.stringify(processedValues))

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 确保包含cookies
        body: JSON.stringify(processedValues),
      })

      console.log('[Admin] Response status:', response.status)
      const responseData = await response.json()
      console.log('[Admin] Response data:', responseData)

      if (!response.ok) {
        throw new Error(responseData.error || `操作失败 (${response.status})`)
      }

      message.success(editingAgent ? '更新成功' : '创建成功')
      setModalVisible(false)
      form.resetFields()
      setEditingAgent(null)
      
      // 立即刷新数据
      console.log('[Admin] Fetching updated data...')
      await fetchData()
      console.log('[Admin] Data refresh complete')
    } catch (error) {
      console.error('[Admin] Submit error:', error)
      message.error(error instanceof Error ? error.message : '操作失败')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/agents/${id}`, {
        method: 'DELETE',
        credentials: 'include', // 确保包含cookies进行认证
      })

      if (!response.ok) throw new Error('删除失败')
      message.success('删除成功')
      fetchData()
    } catch (error) {
      message.error('删除失败')
    }
  }

  const handleStatusUpdate = async (id: string, status: string, type: 'application' | 'feedback') => {
    try {
      const url = type === 'application' 
        ? `/api/applications/${id}`
        : `/api/feedback/${id}`

      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) throw new Error('更新失败')
      message.success('状态更新成功')
      fetchData()
    } catch (error) {
      message.error('更新失败')
    }
  }

  const handleButtonSubmit = async (values: any) => {
    try {
      const url = editingButton ? `/api/feedback-buttons/${editingButton.id}` : '/api/feedback-buttons'
      const method = editingButton ? 'PUT' : 'POST'

      // 确保order字段是数字类型
      const submitData = {
        ...values,
        order: parseInt(values.order) || 0
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('API Error:', errorData)
        throw new Error(errorData.error || '操作失败')
      }

      message.success(editingButton ? '更新成功' : '创建成功')
      setButtonModalVisible(false)
      buttonForm.resetFields()
      setEditingButton(null)
      fetchFeedbackButtons()
    } catch (error) {
      console.error('Button submit error:', error)
      message.error(error instanceof Error ? error.message : '操作失败')
    }
  }

  const handleButtonDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/feedback-buttons/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('删除失败')
      message.success('删除成功')
      fetchFeedbackButtons()
    } catch (error) {
      message.error('删除失败')
    }
  }

  const handleTutorialSubmit = async (values: any) => {
    try {
      const response = await fetch('/api/tutorial-config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '更新失败')
      }

      message.success('教程配置更新成功')
      setTutorialModalVisible(false)
      fetchTutorialConfig()
    } catch (error) {
      console.error('Tutorial config update error:', error)
      message.error(error instanceof Error ? error.message : '更新失败')
    }
  }


  const handleVisibilityToggle = async (id: string, enabled: boolean) => {
    try {
      const response = await fetch(`/api/agents/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 确保包含cookies进行认证
        body: JSON.stringify({ enabled }),
      })

      if (!response.ok) throw new Error('更新失败')
      message.success(enabled ? '已显示' : '已隐藏')
      fetchData()
    } catch (error) {
      message.error('操作失败')
    }
  }

  const handleButtonVisibilityToggle = async (id: string, enabled: boolean) => {
    try {
      const response = await fetch(`/api/feedback-buttons/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enabled }),
      })

      if (!response.ok) throw new Error('更新失败')
      message.success(enabled ? '已显示' : '已隐藏')
      fetchFeedbackButtons()
    } catch (error) {
      message.error('操作失败')
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/login', { 
        method: 'DELETE',
        credentials: 'include'
      })
      router.push('/admin/login')
    } catch (error) {
      message.error('登出失败')
    }
  }

  const agentColumns = [
    {
      title: '工具信息',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text: string, record: Agent) => (
        <Space>
          {record.coverImage ? (
            <Image
              src={record.coverImage}
              alt={record.name}
              width={50}
              height={50}
              style={{ borderRadius: 8, objectFit: 'cover' }}
            />
          ) : (
            <div style={{
              width: 50,
              height: 50,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 24
            }}>
              {record.icon || '🤖'}
            </div>
          )}
          <div>
            <Link href={`/agents/${record.id}`}>{text}</Link>
            <div style={{ fontSize: 12, color: '#666' }}>
              {record.description.length > 30 
                ? `${record.description.substring(0, 30)}...` 
                : record.description}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: '配置',
      key: 'config',
      render: (_: any, record: Agent) => (
        <Space direction="vertical" size={0}>
          <Text style={{ fontSize: 12 }}>链接: {record.homepage || '未设置'}</Text>
          <Text style={{ fontSize: 12 }}>图标: {record.icon || '默认'}</Text>
          <Text style={{ fontSize: 12 }}>主理人: {record.manager}</Text>
        </Space>
      ),
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string | string[]) => {
        const tagArray = Array.isArray(tags) ? tags : tags.split(',')
        return (
          <Space wrap>
            {tagArray.map(tag => (
              <Tag key={tag.trim()} color="blue">{tag.trim()}</Tag>
            ))}
          </Space>
        )
      },
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean, record: Agent) => (
        <Space>
          <Tag color={enabled ? 'green' : 'red'}>{enabled ? '可见' : '隐藏'}</Tag>
          <Button
            type="text"
            icon={<EyeOutlined />}
            size="small"
            style={{ color: enabled ? '#52c41a' : '#8c8c8c' }}
            onClick={() => handleVisibilityToggle(record.id, !enabled)}
            title={enabled ? '隐藏' : '显示'}
          />
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Agent) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingAgent(record)
              // Convert tags array back to string for form
              const formValues = {
                ...record,
                tags: Array.isArray(record.tags) ? record.tags.join(', ') : record.tags
              }
              form.setFieldsValue(formValues)
              setModalVisible(true)
            }}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ]

  const applicationColumns = [
    {
      title: '申请人',
      dataIndex: 'applicantName',
      key: 'applicantName',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '工具',
      dataIndex: 'agentName',
      key: 'agentName',
    },
    {
      title: '原因',
      dataIndex: 'reason',
      key: 'reason',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: Application) => (
        <Select
          value={status}
          onChange={(value) => handleStatusUpdate(record.id, value, 'application')}
          style={{ width: 100 }}
          size="small"
        >
          <Option value="PENDING">待审核</Option>
          <Option value="APPROVED">已批准</Option>
          <Option value="REJECTED">已拒绝</Option>
        </Select>
      ),
    },
    {
      title: '申请时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ]

  const feedbackColumns = [
    {
      title: '用户',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: '工具',
      dataIndex: 'agentName',
      key: 'agentName',
    },
    {
      title: '评分',
      dataIndex: 'score',
      key: 'score',
      render: (score: number) => <Rate disabled defaultValue={score} />,
    },
    {
      title: '反馈',
      dataIndex: 'comment',
      key: 'comment',
      ellipsis: true,
    },
    {
      title: '时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ]

  const buttonColumns = [
    {
      title: '按钮标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '链接',
      dataIndex: 'url',
      key: 'url',
      ellipsis: true,
      render: (url: string) => (
        <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
      ),
    },
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
    },
    {
      title: '颜色',
      dataIndex: 'color',
      key: 'color',
      render: (color: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 20, height: 20, backgroundColor: color, borderRadius: 4 }} />
          {color}
        </div>
      ),
    },
    {
      title: '排序',
      dataIndex: 'order',
      key: 'order',
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean, record: FeedbackButton) => (
        <Space>
          <Tag color={enabled ? 'success' : 'default'}>
            {enabled ? '可见' : '隐藏'}
          </Tag>
          <Button
            type="text"
            icon={<EyeOutlined />}
            size="small"
            style={{ color: enabled ? '#52c41a' : '#8c8c8c' }}
            onClick={() => handleButtonVisibilityToggle(record.id, !enabled)}
            title={enabled ? '隐藏' : '显示'}
          />
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      render: (_: any, record: FeedbackButton) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingButton(record)
              buttonForm.setFieldsValue(record)
              setButtonModalVisible(true)
            }}
          >
            编辑
          </Button>
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              Modal.confirm({
                title: '确认删除',
                content: '确定要删除这个按钮吗？',
                onOk: () => handleButtonDelete(record.id),
              })
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]

  const stats = {
    totalAgents: agents.length,
    activeAgents: agents.filter(a => a.enabled).length,
    totalApplications: applications.length,
    pendingApplications: applications.filter(a => a.status === 'PENDING').length,
    totalFeedback: feedback.length,
    averageRating: feedback.length > 0 
      ? (feedback.reduce((sum, f) => sum + f.score, 0) / feedback.length).toFixed(1)
      : 0,
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={2} style={{ textAlign: 'center' }}>
          <ToolOutlined /> 管理后台
        </Title>

        {/* Stats */}
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <Statistic title="总工具数" value={stats.totalAgents} prefix={<ToolOutlined />} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="活跃工具" value={stats.activeAgents} prefix={<ToolOutlined />} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="申请数" value={stats.totalApplications} prefix={<UserOutlined />} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="平均分" value={stats.averageRating} prefix={<StarOutlined />} />
            </Card>
          </Col>
        </Row>

        {/* Navigation and Add Tool Button */}
        <Space style={{ marginBottom: 16, justifyContent: 'space-between', width: '100%' }}>
          <Space>
            <Link href="/admin/admins">
              <Button type="default" icon={<UserOutlined />}>
                管理员管理
              </Button>
            </Link>
            <Link href="/admin/danmaku">
              <Button type="default" icon={<MessageOutlined />}>
                弹幕管理
              </Button>
            </Link>
          </Space>
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingAgent(null)
                form.resetFields()
                setModalVisible(true)
              }}
            >
              添加新工具
            </Button>
            <Button
              onClick={handleLogout}
            >
              登出
            </Button>
            <Link href="/" legacyBehavior>
              <Button>返回前台</Button>
            </Link>
          </Space>
        </Space>

        {/* Tabs */}
        <Card loading={loading}>
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab={`工具管理 (${agents.length})`} key="agents">
              <Table
                columns={agentColumns}
                dataSource={agents}
                rowKey="id"
                pagination={{ pageSize: 10 }}
              />
            </TabPane>
            <TabPane tab={`申请审核 (${applications.filter(a => a.status === 'PENDING').length})`} key="applications">
              <Table
                columns={applicationColumns}
                dataSource={applications}
                rowKey="id"
                pagination={{ pageSize: 10 }}
              />
            </TabPane>
            <TabPane tab={`用户反馈 (${feedback.length})`} key="feedback">
              <Table
                columns={feedbackColumns}
                dataSource={feedback}
                rowKey="id"
                pagination={{ pageSize: 10 }}
              />
            </TabPane>
            <TabPane tab={`按钮配置 (${feedbackButtons.length})`} key="buttons">
              <Space style={{ marginBottom: 16 }}>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setEditingButton(null)
                    buttonForm.resetFields()
                    setButtonModalVisible(true)
                  }}
                >
                  添加按钮
                </Button>
              </Space>
              <Table
                columns={buttonColumns}
                dataSource={feedbackButtons}
                rowKey="id"
                pagination={{ pageSize: 10 }}
              />
            </TabPane>
            <TabPane tab="奇绩教程配置" key="tutorial">
              <Space style={{ marginBottom: 16 }}>
                <Button
                  type="primary"
                  icon={<SettingOutlined />}
                  onClick={() => {
                    if (tutorialConfig) {
                      tutorialForm.setFieldsValue({
                        miracleTutorialUrl: tutorialConfig.miracle_tutorial_url,
                        enabled: tutorialConfig.enabled,
                        title: tutorialConfig.title,
                        description: tutorialConfig.description
                      })
                    }
                    setTutorialModalVisible(true)
                  }}
                >
                  配置教程链接
                </Button>
              </Space>
              
              {tutorialConfig && (
                <Card title="当前配置" style={{ marginTop: 16 }}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <div style={{ marginBottom: 16 }}>
                        <Text strong>按钮标题：</Text>
                        <div>{tutorialConfig.title || '奇绩教程'}</div>
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <Text strong>教程链接：</Text>
                        <div>
                          <a href={tutorialConfig.miracle_tutorial_url} target="_blank" rel="noopener noreferrer">
                            {tutorialConfig.miracle_tutorial_url}
                          </a>
                        </div>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ marginBottom: 16 }}>
                        <Text strong>启用状态：</Text>
                        <div>
                          <Tag color={tutorialConfig.enabled ? 'success' : 'default'}>
                            {tutorialConfig.enabled ? '已启用' : '已禁用'}
                          </Tag>
                        </div>
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <Text strong>描述：</Text>
                        <div>{tutorialConfig.description || '无描述'}</div>
                      </div>
                    </Col>
                  </Row>
                </Card>
              )}
            </TabPane>
          </Tabs>
        </Card>

        {/* Add/Edit Modal */}
        <Modal
          title={editingAgent ? '编辑工具' : '添加新工具'}
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false)
            form.resetFields()
          }}
          onOk={() => form.submit()}
          okText={editingAgent ? '更新' : '添加'}
          cancelText="取消"
          width={800}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="admin-form-custom"
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="工具名称" name="name" rules={[{ required: true }]}>
                  <Input 
                    id="tool-name"
                    placeholder="例如：Claude Code" 
                    style={{ 
                      backgroundColor: '#fff', 
                      color: '#000',
                      border: '2px solid #000',
                      borderRadius: '4px'
                    }} 
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="主理人" name="manager" rules={[{ required: true }]}>
                  <Input 
                    id="tool-manager"
                    placeholder="张三" 
                    style={{ 
                      backgroundColor: '#fff', 
                      color: '#000',
                      border: '2px solid #000',
                      borderRadius: '4px'
                    }} 
                  />
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item label="产品介绍" name="description" rules={[{ required: true }]}>
              <TextArea 
                id="tool-description"
                rows={2} 
                placeholder="用几句话简要介绍这个AI工具..." 
                style={{ 
                  backgroundColor: '#fff', 
                  color: '#000',
                  border: '2px solid #000',
                  borderRadius: '4px',
                  fontSize: '14px'
                }} 
              />
            </Form.Item>

            <Form.Item label="详细介绍" name="guideContent" >
              <div style={{ border: '1px solid #d9d9d9', borderRadius: 6 }}>
                <RichTextEditor
                  value={form.getFieldValue('guideContent') || ''}
                  onChange={(content) => form.setFieldsValue({ guideContent: content })}
                  height={400}
                  placeholder="详细的使用指南和介绍内容（支持富文本格式）"
                />
              </div>
            </Form.Item>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="标签" name="tags" rules={[{ required: true }]}>
                  <Input 
                    id="tool-tags"
                    placeholder="编程,调试,AI助手" 
                    style={{ 
                      backgroundColor: '#fff', 
                      color: '#000',
                      border: '2px solid #000',
                      borderRadius: '4px'
                    }} 
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="图标" name="icon">
                  <div style={{ marginBottom: 8 }}>
                    <Input 
                      id="tool-icon"
                      placeholder="🤖 输入emoji或图标URL" 
                      style={{ 
                        backgroundColor: '#fff', 
                        color: '#000',
                        border: '2px solid #000',
                        borderRadius: '4px'
                      }} 
                    />
                  </div>
                  <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>支持emoji或图标URL</div>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="官网链接" name="homepage">
                  <Input 
                    id="tool-homepage"
                    placeholder="https://example.com" 
                    style={{ 
                      backgroundColor: '#fff', 
                      color: '#000',
                      border: '2px solid #000',
                      borderRadius: '4px'
                    }} 
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="封面图片" name="coverImage" >
                  <ImageUpload
                    value={form.getFieldValue('coverImage')}
                    onChange={(url) => form.setFieldsValue({ coverImage: url })}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="主题颜色" name="themeColor" initialValue="#FFFFFF">
                  <Input 
                    id="tool-theme-color"
                    type="color" 
                    style={{ 
                      width: '100%',
                      height: 40,
                      backgroundColor: '#fff', 
                      border: '2px solid #000',
                      borderRadius: '4px'
                    }} 
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="可见状态" name="enabled" valuePropName="checked" initialValue={true}>
                  <Switch checkedChildren="可见" unCheckedChildren="隐藏" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={12}>
                <Form.Item label="使用指南链接" name="guideUrl">
                  <Input 
                    id="tool-guide-url"
                    placeholder="/guides/claude-code 或 https://example.com/guide" 
                    style={{ 
                      backgroundColor: '#fff', 
                      color: '#000',
                      border: '2px solid #000',
                      borderRadius: '4px'
                    }} 
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Space>
                  <Button
                    type="default"
                    icon={<EyeOutlined />}
                    onClick={() => {
                      const content = form.getFieldValue('guideContent') || ''
                      setPreviewContent(content)
                      setPreviewVisible(true)
                    }}
                  >
                    预览指南
                  </Button>
                </Space>
              </Col>
            </Row>
          </Form>
        </Modal>

        {/* 预览模态框 */}
        <style jsx global>{`
          .admin-form-custom .ant-input,
          .admin-form-custom .ant-input-textarea,
          .admin-form-custom .ant-select-selector,
          .admin-form-custom .ant-input-affix-wrapper {
            background-color: #ffffff !important;
            color: #000000 !important;
            border: 2px solid #000000 !important;
            border-radius: 4px !important;
            font-weight: 500 !important;
          }
          
          .admin-form-custom .ant-input::placeholder,
          .admin-form-custom .ant-input-textarea::placeholder {
            color: #666666 !important;
          }
          
          .admin-form-custom .ant-input:focus,
          .admin-form-custom .ant-input-textarea:focus,
          .admin-form-custom .ant-select-focused .ant-select-selector {
            border-color: #000000 !important;
            box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1) !important;
          }
          
          .admin-form-custom .ant-form-item-label > label {
            color: #000000 !important;
            font-weight: 600 !important;
          }
        `}</style>
        <Modal
          title="使用指南预览"
          open={previewVisible}
          onCancel={() => setPreviewVisible(false)}
          footer={[
            <Button key="close" onClick={() => setPreviewVisible(false)}>
              关闭
            </Button>
          ]}
          width={800}
        >
          <div style={{ maxHeight: '70vh', overflow: 'auto', padding: 16 }}>
            <MarkdownRenderer content={previewContent} />
          </div>
        </Modal>


        {/* Tutorial Config Modal */}
        <Modal
          title="奇绩教程配置"
          open={tutorialModalVisible}
          onCancel={() => {
            setTutorialModalVisible(false)
            tutorialForm.resetFields()
          }}
          onOk={() => tutorialForm.submit()}
          okText="保存配置"
          cancelText="取消"
          width={600}
        >
          <Form
            form={tutorialForm}
            layout="vertical"
            onFinish={handleTutorialSubmit}
            className="admin-form-custom"
          >
            <Form.Item
              label="按钮标题"
              name="title"
              rules={[{ required: true, message: '请输入按钮标题' }]}
              initialValue="奇绩教程"
            >
              <Input placeholder="奇绩教程" />
            </Form.Item>
            <Form.Item
              label="教程链接"
              name="miracleTutorialUrl"
              rules={[
                { required: true, message: '请输入教程链接' },
                { type: 'url', message: '请输入有效的URL' }
              ]}
            >
              <Input placeholder="https://example.com/miracle-tutorial" />
            </Form.Item>
            <Form.Item
              label="描述"
              name="description"
            >
              <TextArea 
                rows={3} 
                placeholder="奇绩教程相关描述，会在使用指南页面显示"
              />
            </Form.Item>
            <Form.Item
              label="启用状态"
              name="enabled"
              valuePropName="checked"
              initialValue={true}
            >
              <Switch checkedChildren="启用" unCheckedChildren="禁用" />
            </Form.Item>
          </Form>
        </Modal>

        {/* Feedback Button Modal */}
        <Modal
          title={editingButton ? '编辑按钮' : '添加按钮'}
          open={buttonModalVisible}
          onCancel={() => {
            setButtonModalVisible(false)
            buttonForm.resetFields()
            setEditingButton(null)
          }}
          onOk={() => buttonForm.submit()}
          okText={editingButton ? '更新' : '添加'}
          cancelText="取消"
          width={600}
        >
          <Form
            form={buttonForm}
            layout="vertical"
            onFinish={handleButtonSubmit}
            className="admin-form-custom"
          >
            <Form.Item
              label="按钮标题"
              name="title"
              rules={[{ required: true, message: '请输入按钮标题' }]}
            >
              <Input id="button-title" placeholder="例如：AI产品反馈" />
            </Form.Item>
            <Form.Item
              label="描述"
              name="description"
            >
              <TextArea id="button-description" rows={2} placeholder="按钮的描述信息（鼠标悬停时显示）" />
            </Form.Item>
            <Form.Item
              label="链接地址"
              name="url"
              rules={[{ required: true, message: '请输入链接地址' }]}
            >
              <Input id="button-url" placeholder="https://forms.gle/xxx" />
            </Form.Item>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label="图标"
                  name="icon"
                  initialValue="message"
                >
                  <Select id="button-icon">
                    <Option value="message">message（消息）</Option>
                    <Option value="form">form（表单）</Option>
                    <Option value="file">file（文件）</Option>
                    <Option value="bulb">bulb（灯泡）</Option>
                    <Option value="comment">comment（评论）</Option>
                    <Option value="question">question（问题）</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="颜色"
                  name="color"
                  initialValue="#1890ff"
                >
                  <Input id="button-color" type="color" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="排序"
                  name="order"
                  initialValue={0}
                >
                  <Input id="button-order" type="number" placeholder="数字越小越靠前" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              label="可见状态"
              name="enabled"
              valuePropName="checked"
              initialValue={true}
            >
              <Switch checkedChildren="可见" unCheckedChildren="隐藏" />
            </Form.Item>
          </Form>
        </Modal>
      </Space>
    </div>
  )
}