'use client'

import { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, Select, Switch, message, Space, Popconfirm, Tag } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, KeyOutlined } from '@ant-design/icons'

interface Admin {
  id: string
  email: string
  name: string
  role: string
  canChangePassword: boolean
  canManageAdmins: boolean
  createdBy?: string
  createdAt: string
  updatedAt: string
}

interface CurrentAdmin {
  id: string
  email: string
  name: string
  role: string
  canChangePassword: boolean
  canManageAdmins: boolean
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [currentAdmin, setCurrentAdmin] = useState<CurrentAdmin | null>(null)
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [passwordModalVisible, setPasswordModalVisible] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null)
  const [form] = Form.useForm()
  const [passwordForm] = Form.useForm()

  // 获取当前登录的管理员信息
  useEffect(() => {
    fetchCurrentAdmin()
  }, [])

  // 获取管理员列表
  useEffect(() => {
    if (currentAdmin?.canManageAdmins) {
      fetchAdmins()
    }
  }, [currentAdmin])

  const fetchCurrentAdmin = async () => {
    try {
      const response = await fetch('/api/admin/login', {
        credentials: 'include'
      })
      const data = await response.json()
      if (data.isAuthenticated) {
        setCurrentAdmin(data.admin)
      }
    } catch (error) {
      console.error('获取当前用户信息失败:', error)
    }
  }

  const fetchAdmins = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/admins', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setAdmins(data)
      } else {
        message.error('获取管理员列表失败')
      }
    } catch (error) {
      message.error('获取管理员列表失败')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (values: any) => {
    try {
      const response = await fetch('/api/admin/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(values)
      })

      if (response.ok) {
        message.success('创建管理员成功')
        setModalVisible(false)
        form.resetFields()
        fetchAdmins()
      } else {
        const error = await response.json()
        message.error(error.error || '创建管理员失败')
      }
    } catch (error) {
      message.error('创建管理员失败')
    }
  }

  const handleUpdate = async (values: any) => {
    if (!editingAdmin) return

    try {
      const response = await fetch(`/api/admin/admins/${editingAdmin.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(values)
      })

      if (response.ok) {
        message.success('更新管理员成功')
        setModalVisible(false)
        form.resetFields()
        setEditingAdmin(null)
        fetchAdmins()
      } else {
        const error = await response.json()
        message.error(error.error || '更新管理员失败')
      }
    } catch (error) {
      message.error('更新管理员失败')
    }
  }

  const handleChangePassword = async (values: any) => {
    if (!editingAdmin) return

    try {
      const response = await fetch(`/api/admin/admins/${editingAdmin.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password: values.password })
      })

      if (response.ok) {
        message.success('密码修改成功')
        setPasswordModalVisible(false)
        passwordForm.resetFields()
        setEditingAdmin(null)
      } else {
        const error = await response.json()
        message.error(error.error || '密码修改失败')
      }
    } catch (error) {
      message.error('密码修改失败')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/admins/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        message.success('删除管理员成功')
        fetchAdmins()
      } else {
        const error = await response.json()
        message.error(error.error || '删除管理员失败')
      }
    } catch (error) {
      message.error('删除管理员失败')
    }
  }

  const openCreateModal = () => {
    setEditingAdmin(null)
    form.resetFields()
    setModalVisible(true)
  }

  const openEditModal = (admin: Admin) => {
    setEditingAdmin(admin)
    form.setFieldsValue({
      email: admin.email,
      name: admin.name,
      role: admin.role,
      canChangePassword: admin.canChangePassword,
      canManageAdmins: admin.canManageAdmins
    })
    setModalVisible(true)
  }

  const openPasswordModal = (admin: Admin) => {
    setEditingAdmin(admin)
    passwordForm.resetFields()
    setPasswordModalVisible(true)
  }

  // 检查权限
  const canManage = currentAdmin?.canManageAdmins || false
  const canChangePassword = currentAdmin?.canChangePassword || currentAdmin?.role === 'super_admin' || false

  if (!canManage) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <h2>权限不足</h2>
        <p>您没有管理员管理权限</p>
      </div>
    )
  }

  const columns = [
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'super_admin' ? 'red' : 'blue'}>
          {role === 'super_admin' ? '超级管理员' : '管理员'}
        </Tag>
      )
    },
    {
      title: '密码权限',
      dataIndex: 'canChangePassword',
      key: 'canChangePassword',
      render: (canChangePassword: boolean) => (
        <Tag color={canChangePassword ? 'green' : 'default'}>
          {canChangePassword ? '可修改' : '不可修改'}
        </Tag>
      )
    },
    {
      title: '管理权限',
      dataIndex: 'canManageAdmins',
      key: 'canManageAdmins',
      render: (canManageAdmins: boolean) => (
        <Tag color={canManageAdmins ? 'green' : 'default'}>
          {canManageAdmins ? '可管理' : '不可管理'}
        </Tag>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString()
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Admin) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
          >
            编辑
          </Button>
          {canChangePassword && (
            <Button
              type="link"
              icon={<KeyOutlined />}
              onClick={() => openPasswordModal(record)}
            >
              改密码
            </Button>
          )}
          {record.role !== 'super_admin' && record.id !== currentAdmin?.id && (
            <Popconfirm
              title="确定要删除这个管理员吗？"
              onConfirm={() => handleDelete(record.id)}
            >
              <Button
                type="link"
                danger
                icon={<DeleteOutlined />}
              >
                删除
              </Button>
            </Popconfirm>
          )}
        </Space>
      )
    }
  ]

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>管理员管理</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openCreateModal}
        >
          新增管理员
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={admins}
        rowKey="id"
        loading={loading}
        bordered
        style={{
          backgroundColor: '#fff'
        }}
      />

      {/* 创建/编辑管理员模态框 */}
      <Modal
        title={editingAdmin ? '编辑管理员' : '新增管理员'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          setEditingAdmin(null)
          form.resetFields()
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={editingAdmin ? handleUpdate : handleCreate}
          className="admin-form-custom"
        >
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input />
          </Form.Item>

          {!editingAdmin && (
            <Form.Item
              name="password"
              label="密码"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password />
            </Form.Item>
          )}

          <Form.Item
            name="role"
            label="角色"
            initialValue="admin"
          >
            <Select>
              <Select.Option value="admin">管理员</Select.Option>
              {currentAdmin?.role === 'super_admin' && (
                <Select.Option value="super_admin">超级管理员</Select.Option>
              )}
            </Select>
          </Form.Item>

          <Form.Item
            name="canChangePassword"
            label="密码管理权限"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch checkedChildren="可修改" unCheckedChildren="不可修改" />
          </Form.Item>

          <Form.Item
            name="canManageAdmins"
            label="管理员管理权限"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch checkedChildren="可管理" unCheckedChildren="不可管理" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingAdmin ? '更新' : '创建'}
              </Button>
              <Button onClick={() => setModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 修改密码模态框 */}
      <Modal
        title="修改密码"
        open={passwordModalVisible}
        onCancel={() => {
          setPasswordModalVisible(false)
          setEditingAdmin(null)
          passwordForm.resetFields()
        }}
        footer={null}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handleChangePassword}
          className="admin-form-custom"
        >
          <Form.Item
            name="password"
            label="新密码"
            rules={[{ required: true, message: '请输入新密码' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="确认密码"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'))
                }
              })
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                修改密码
              </Button>
              <Button onClick={() => setPasswordModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 样式修复 */}
      <style jsx global>{`
        /* 修复所有表单组件的样式 */
        .admin-form-custom .ant-input,
        .admin-form-custom .ant-input-textarea,
        .admin-form-custom .ant-select-selector,
        .admin-form-custom .ant-input-affix-wrapper,
        .admin-form-custom .ant-input-password {
          background-color: #ffffff !important;
          color: #000000 !important;
          border: 2px solid #000000 !important;
          border-radius: 4px !important;
          font-weight: 500 !important;
        }
        
        .admin-form-custom .ant-input::placeholder,
        .admin-form-custom .ant-input-textarea::placeholder,
        .admin-form-custom .ant-input-password::placeholder {
          color: #666666 !important;
        }
        
        .admin-form-custom .ant-input:focus,
        .admin-form-custom .ant-input-textarea:focus,
        .admin-form-custom .ant-input-password:focus,
        .admin-form-custom .ant-select-focused .ant-select-selector {
          border-color: #000000 !important;
          box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1) !important;
        }
        
        .admin-form-custom .ant-form-item-label > label {
          color: #000000 !important;
          font-weight: 600 !important;
        }
        
        .admin-form-custom .ant-select-selection-item {
          color: #000000 !important;
        }
        
        .ant-select-dropdown .ant-select-item-option-content {
          color: #000 !important;
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