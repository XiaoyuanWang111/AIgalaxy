'use client'

import React from 'react'
import { Input, Select, Button, Typography, Space, Statistic, Card } from 'antd'
import { SearchOutlined, ToolOutlined, AppstoreOutlined, StarOutlined, SettingOutlined } from '@ant-design/icons'
import Link from 'next/link'

const { Title, Text } = Typography
const { Search } = Input
const { Option } = Select

interface GalaxyControlsProps {
  searchTerm: string
  selectedTag: string
  allTags: string[]
  agentCount: number
  enabledCount: number
  onSearchChange: (value: string) => void
  onTagChange: (value: string) => void
}

export const GalaxyControls: React.FC<GalaxyControlsProps> = ({
  searchTerm,
  selectedTag,
  allTags,
  agentCount,
  enabledCount,
  onSearchChange,
  onTagChange
}) => {
  return (
    <>
      {/* 顶部标题区域 */}
      <div style={{ 
        position: 'relative',
        textAlign: 'center', 
        marginBottom: 48,
        padding: '40px 20px 20px 20px'
      }}>
        {/* 管理员登录按钮 */}
        <div style={{ 
          position: 'absolute', 
          top: 20, 
          right: 20,
          zIndex: 100
        }}>
          <Link href="/admin/login">
            <Button 
              type="text" 
              size="small"
              icon={<SettingOutlined />}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                borderRadius: '8px',
              }}
            >
              管理员登录
            </Button>
          </Link>
        </div>

        {/* 主标题 */}
        <div style={{ marginBottom: 16 }}>
          <Title 
            level={1} 
            style={{ 
              color: 'white',
              fontSize: '48px',
              fontWeight: 'bold',
              margin: 0,
              textShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
              background: 'linear-gradient(45deg, #ffffff, #a8e6cf, #88d8c0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            <StarOutlined style={{ marginRight: 16, color: 'white' }} />
            AI Galaxy
          </Title>
        </div>
        
        <Text 
          style={{ 
            fontSize: 18,
            color: 'rgba(255, 255, 255, 0.8)',
            textShadow: '0 0 10px rgba(255, 255, 255, 0.3)'
          }}
        >
          奇绩AI产品统一管理与体验平台
        </Text>
      </div>

      {/* 搜索和筛选控制区域 */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '24px',
        marginBottom: 40,
        flexWrap: 'wrap',
        padding: '0 20px'
      }}>
        <Search
          placeholder="🔍 探索AI星球..."
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          style={{ 
            width: 400,
            maxWidth: '100%'
          }}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          styles={{
            input: {
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              backdropFilter: 'blur(10px)',
            },
          }}
        />
        
        <Select
          size="large"
          style={{ width: 200 }}
          value={selectedTag}
          onChange={onTagChange}
          placeholder="选择星系分类"
          dropdownStyle={{
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
          popupClassName="galaxy-select-dropdown"
        >
          <Option value="all">🌌 全部星系</Option>
          {allTags.map(tag => (
            <Option key={tag} value={tag}>⭐ {tag}</Option>
          ))}
        </Select>
      </div>

      {/* 统计信息卡片 */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '24px',
        marginBottom: 40,
        padding: '0 20px',
        flexWrap: 'wrap'
      }}>
        <Card 
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            minWidth: '140px'
          }}
        >
          <Statistic
            title={<span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>星球总数</span>}
            value={agentCount}
            prefix={<ToolOutlined style={{ color: '#4facfe' }} />}
            valueStyle={{ color: 'white' }}
          />
        </Card>
        
        <Card 
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            minWidth: '140px'
          }}
        >
          <Statistic
            title={<span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>星系分类</span>}
            value={allTags.length}
            prefix={<AppstoreOutlined style={{ color: '#00f2fe' }} />}
            valueStyle={{ color: 'white' }}
          />
        </Card>
        
        <Card 
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            minWidth: '140px'
          }}
        >
          <Statistic
            title={<span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>活跃星球</span>}
            value={enabledCount}
            prefix={<StarOutlined style={{ color: '#43e97b' }} />}
            valueStyle={{ color: 'white' }}
          />
        </Card>
      </div>
    </>
  )
}