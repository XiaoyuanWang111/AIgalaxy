'use client'

import { useState, useEffect } from 'react'
import { Table, Button, message, Space, Popconfirm, Tag, Modal, Tabs, Card, Form, Switch, InputNumber } from 'antd'
import { DeleteOutlined, ReloadOutlined, EyeOutlined, SettingOutlined } from '@ant-design/icons'

interface Danmaku {
  id: string
  text: string
  color: string
  ipAddress?: string
  userAgent?: string
  createdAt: string
}

interface DanmakuConfig {
  id: string
  enabled: boolean
  maxLength: number
  playSpeed: number
  batchSize: number
  createdAt: string
  updatedAt: string
}

export default function DanmakuManagePage() {
  const [danmakus, setDanmakus] = useState<Danmaku[]>([])
  const [loading, setLoading] = useState(false)
  const [configLoading, setConfigLoading] = useState(false)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0
  })
  const [selectedDanmaku, setSelectedDanmaku] = useState<Danmaku | null>(null)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [config, setConfig] = useState<DanmakuConfig | null>(null)
  const [activeTab, setActiveTab] = useState('danmakus')
  const [form] = Form.useForm()

  // 获取弹幕列表
  const fetchDanmakus = async (page = 1, limit = 20) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/danmaku?page=${page}&limit=${limit}`, {
        credentials: 'include'
      })
      const data = await response.json()
      
      if (data.success) {
        setDanmakus(data.danmakus)
        setPagination({
          current: data.pagination.page,
          pageSize: data.pagination.limit,
          total: data.pagination.total
        })
      } else {
        message.error('获取弹幕列表失败')
      }
    } catch (error) {
      message.error('获取弹幕列表失败')
      console.error('获取弹幕失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 删除弹幕
  const deleteDanmaku = async (id: string) => {
    try {
      const response = await fetch(`/api/danmaku?id=${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      
      const data = await response.json()
      if (data.success) {
        message.success('弹幕删除成功')
        fetchDanmakus(pagination.current, pagination.pageSize)
      } else {
        message.error(data.message || '删除失败')
      }
    } catch (error) {
      message.error('删除弹幕失败')
      console.error('删除弹幕失败:', error)
    }
  }

  // 查看详情
  const showDetail = (danmaku: Danmaku) => {
    setSelectedDanmaku(danmaku)
    setDetailModalVisible(true)
  }

  // 页面变化处理
  const handleTableChange = (page: number, pageSize: number) => {
    fetchDanmakus(page, pageSize)
  }

  // 获取弹幕配置
  const fetchConfig = async () => {
    try {
      setConfigLoading(true)
      const response = await fetch('/api/danmaku/config', {
        credentials: 'include'
      })
      const data = await response.json()
      
      if (data.success) {
        setConfig(data.config)
        form.setFieldsValue(data.config)
      } else {
        message.error('获取配置失败')
      }
    } catch (error) {
      message.error('获取配置失败')
      console.error('获取配置失败:', error)
    } finally {
      setConfigLoading(false)
    }
  }

  // 更新配置
  const updateConfig = async (values: any) => {
    try {
      setConfigLoading(true)
      const response = await fetch('/api/danmaku/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(values)
      })
      
      const data = await response.json()
      if (data.success) {
        setConfig(data.config)
        message.success('配置更新成功')
      } else {
        message.error(data.message || '配置更新失败')
      }
    } catch (error) {
      message.error('配置更新失败')
      console.error('配置更新失败:', error)
    } finally {
      setConfigLoading(false)
    }
  }

  useEffect(() => {
    fetchDanmakus()
    fetchConfig()
  }, [])

  const columns = [
    {
      title: '弹幕内容',
      dataIndex: 'text',
      key: 'text',
      width: 300,
      render: (text: string, record: Danmaku) => (
        <div style={{ 
          color: record.color, 
          fontWeight: 'bold',
          textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
        }}>
          {text}
        </div>
      )
    },
    {
      title: '颜色',
      dataIndex: 'color',
      key: 'color',
      width: 100,
      render: (color: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div 
            style={{
              width: '20px',
              height: '20px',
              backgroundColor: color,
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          />
          <span style={{ fontSize: '12px', color: '#666' }}>{color}</span>
        </div>
      )
    },
    {
      title: 'IP地址',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
      width: 150,
      render: (ip: string) => (
        <Tag color="blue">{ip || '未知'}</Tag>
      )
    },
    {
      title: '发送时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date: string) => new Date(date).toLocaleString('zh-CN')
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: Danmaku) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => showDetail(record)}
          >
            详情
          </Button>
          <Popconfirm
            title="确定要删除这条弹幕吗？"
            onConfirm={() => deleteDanmaku(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <div style={{ padding: 24 }}>
      <div style={{ 
        marginBottom: 16, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <h2>弹幕管理</h2>
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          onClick={() => {
            fetchDanmakus(pagination.current, pagination.pageSize)
            fetchConfig()
          }}
          loading={loading || configLoading}
        >
          刷新
        </Button>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <Tabs.TabPane 
          tab={`弹幕列表 (${pagination.total})`} 
          key="danmakus"
        >
          <Table
            columns={columns}
            dataSource={danmakus}
            rowKey="id"
            loading={loading}
            bordered
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `第 ${range[0]}-${range[1]} 条 / 共 ${total} 条`,
              onChange: handleTableChange,
              onShowSizeChange: handleTableChange
            }}
            style={{
              backgroundColor: '#fff'
            }}
          />
        </Tabs.TabPane>

        <Tabs.TabPane 
          tab="系统配置" 
          key="config"
          icon={<SettingOutlined />}
        >
          <Card title="弹幕系统配置" loading={configLoading}>
            <Form
              form={form}
              layout="vertical"
              onFinish={updateConfig}
              style={{ maxWidth: 600 }}
              className="admin-form-custom"
            >
              <Form.Item
                name="enabled"
                label="弹幕功能"
                valuePropName="checked"
              >
                <Switch 
                  checkedChildren="启用" 
                  unCheckedChildren="禁用"
                />
              </Form.Item>

              <Form.Item
                name="maxLength"
                label="最大字符数"
                rules={[{ required: true, message: '请输入最大字符数' }]}
              >
                <InputNumber
                  min={1}
                  max={100}
                  style={{ width: '200px' }}
                  addonAfter="字符"
                />
              </Form.Item>

              <Form.Item
                name="playSpeed"
                label="播放速度"
                rules={[{ required: true, message: '请输入播放速度' }]}
              >
                <InputNumber
                  min={0.1}
                  max={5.0}
                  step={0.1}
                  style={{ width: '200px' }}
                  addonAfter="倍速"
                />
              </Form.Item>

              <Form.Item
                name="batchSize"
                label="批量播放数量"
                rules={[{ required: true, message: '请输入批量播放数量' }]}
              >
                <InputNumber
                  min={1}
                  max={50}
                  style={{ width: '200px' }}
                  addonAfter="条/批"
                />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={configLoading}
                  >
                    保存配置
                  </Button>
                  <Button
                    onClick={() => {
                      form.setFieldsValue(config)
                    }}
                  >
                    重置
                  </Button>
                </Space>
              </Form.Item>
            </Form>

            {config && (
              <div style={{ 
                marginTop: 24, 
                padding: 16, 
                backgroundColor: '#f5f5f5', 
                borderRadius: 6 
              }}>
                <h4>当前配置状态</h4>
                <p><strong>弹幕功能：</strong>{config.enabled ? '已启用' : '已禁用'}</p>
                <p><strong>最大字符数：</strong>{config.maxLength} 字符</p>
                <p><strong>播放速度：</strong>{config.playSpeed} 倍速</p>
                <p><strong>批量播放：</strong>{config.batchSize} 条/批</p>
                <p><strong>更新时间：</strong>{new Date(config.updatedAt).toLocaleString('zh-CN')}</p>
              </div>
            )}
          </Card>
        </Tabs.TabPane>
      </Tabs>

      {/* 详情模态框 */}
      <Modal
        title="弹幕详情"
        open={detailModalVisible}
        onCancel={() => {
          setDetailModalVisible(false)
          setSelectedDanmaku(null)
        }}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={600}
      >
        {selectedDanmaku && (
          <div style={{ padding: '16px 0' }}>
            <div style={{ marginBottom: '16px' }}>
              <strong>弹幕内容：</strong>
              <div style={{ 
                marginTop: '8px',
                padding: '12px',
                background: '#f5f5f5',
                borderRadius: '6px',
                color: selectedDanmaku.color,
                fontSize: '16px',
                fontWeight: 'bold'
              }}>
                {selectedDanmaku.text}
              </div>
            </div>
            
            <div style={{ marginBottom: '12px' }}>
              <strong>颜色：</strong>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                marginTop: '4px'
              }}>
                <div 
                  style={{
                    width: '30px',
                    height: '30px',
                    backgroundColor: selectedDanmaku.color,
                    borderRadius: '6px',
                    border: '1px solid #ccc'
                  }}
                />
                <span>{selectedDanmaku.color}</span>
              </div>
            </div>
            
            <div style={{ marginBottom: '12px' }}>
              <strong>IP地址：</strong> {selectedDanmaku.ipAddress || '未知'}
            </div>
            
            <div style={{ marginBottom: '12px' }}>
              <strong>用户代理：</strong>
              <div style={{ 
                marginTop: '4px',
                padding: '8px',
                background: '#f9f9f9',
                borderRadius: '4px',
                fontSize: '12px',
                wordBreak: 'break-all'
              }}>
                {selectedDanmaku.userAgent || '未知'}
              </div>
            </div>
            
            <div style={{ marginBottom: '12px' }}>
              <strong>发送时间：</strong> {new Date(selectedDanmaku.createdAt).toLocaleString('zh-CN')}
            </div>
          </div>
        )}
      </Modal>

      {/* 样式修复 */}
      <style jsx global>{`
        /* 修复所有表单组件的样式 */
        .admin-form-custom .ant-input,
        .admin-form-custom .ant-input-textarea,
        .admin-form-custom .ant-select-selector,
        .admin-form-custom .ant-input-affix-wrapper,
        .admin-form-custom .ant-input-number,
        .admin-form-custom .ant-input-number-input {
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
        .admin-form-custom .ant-input-number:focus,
        .admin-form-custom .ant-select-focused .ant-select-selector {
          border-color: #000000 !important;
          box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1) !important;
        }
        
        .admin-form-custom .ant-form-item-label > label {
          color: #000000 !important;
          font-weight: 600 !important;
        }
        
        /* 添加表格边框 */
        .ant-table-thead > tr > th,
        .ant-table-tbody > tr > td {
          border: 1px solid #d9d9d9 !important;
        }
        
        .ant-table-thead > tr > th {
          background-color: #fafafa !important;
        }
        
        /* 确保表格边框完整 */
        .ant-table-container {
          border: 1px solid #d9d9d9;
          border-radius: 6px;
        }
      `}</style>
    </div>
  )
}