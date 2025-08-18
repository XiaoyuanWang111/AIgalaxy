# 📊 AI Agent Platform 数据库结构文档

## 数据库概览
- **数据库文件**: `prisma/dev.db`
- **数据库类型**: SQLite
- **总表数**: 8个
- **总字段数**: 57个字段
- **ORM**: Prisma

## 数据表结构详解

### 1. agents - AI代理主表
| 字段名 | 类型 | 描述 |
|--------|------|------|
| id | String (CUID) | 主键 |
| name | String | 代理名称 |
| description | String | 代理描述 |
| tags | String | 标签（逗号分隔） |
| manager | String | 管理员 |
| guideUrl | String? | 使用指南URL |
| homepage | String? | 官网地址 |
| icon | String? | 图标URL |
| coverImage | String? | 封面图片URL |
| guideContent | String? | 使用指南内容（富文本） |
| enabled | Boolean | 是否启用（默认true） |
| clickCount | Int | 点击次数（默认0） |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |

### 2. agent_applications - 代理申请
| 字段名 | 类型 | 描述 |
|--------|------|------|
| id | String (CUID) | 主键 |
| agentId | String | 关联代理ID（外键） |
| applicantName | String | 申请人姓名 |
| email | String | 邮箱 |
| reason | String? | 申请原因 |
| status | String | 状态（默认"PENDING"） |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |

### 3. agent_feedback - 代理反馈
| 字段名 | 类型 | 描述 |
|--------|------|------|
| id | String (CUID) | 主键 |
| agentId | String | 关联代理ID（外键） |
| userName | String | 用户名 |
| email | String? | 邮箱 |
| score | Int | 评分（1-5，默认5） |
| comment | String? | 评论内容 |
| createdAt | DateTime | 创建时间 |

### 4. star_magnitude_configs - 星等配置系统
| 字段名 | 类型 | 描述 |
|--------|------|------|
| id | String (CUID) | 主键 |
| magnitude | Int | 星等值（1-7） |
| minClicks | Int | 最小点击次数门槛 |
| maxClicks | Int? | 最大点击次数门槛 |
| size | Float | 星星大小 |
| brightness | Float | 亮度值（0-1） |
| glow | Float | 光晕大小 |
| color | String | 默认颜色 |
| label | String | 显示标签 |
| description | String? | 描述 |
| isEnabled | Boolean | 是否启用（默认true） |
| orderIndex | Int | 排序索引 |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |

### 5. users - 用户表
| 字段名 | 类型 | 描述 |
|--------|------|------|
| id | String (CUID) | 主键 |
| email | String | 邮箱（唯一） |
| name | String? | 姓名 |
| role | String | 角色（默认"USER"） |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |

### 6. admins - 管理员表
| 字段名 | 类型 | 描述 |
|--------|------|------|
| id | String (CUID) | 主键 |
| email | String | 邮箱（唯一） |
| password | String | 密码（加密） |
| name | String | 姓名 |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |

### 7. feedback_config - 反馈配置
| 字段名 | 类型 | 描述 |
|--------|------|------|
| id | String (CUID) | 主键 |
| productFeedbackUrl | String | 产品反馈URL |
| platformFeedbackUrl | String | 平台反馈URL |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |

### 8. feedback_buttons - 反馈按钮
| 字段名 | 类型 | 描述 |
|--------|------|------|
| id | String (CUID) | 主键 |
| title | String | 按钮标题 |
| description | String? | 描述 |
| url | String | 链接地址 |
| icon | String? | 图标类型 |
| color | String? | 按钮颜色 |
| order | Int | 排序顺序（默认0） |
| enabled | Boolean | 是否启用（默认true） |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |

## 数据库关系图

```
agents
├── agent_applications (一对多)
├── agent_feedback (一对多)
└── star_magnitude_configs (无直接关系，通过clickCount关联)

users
└── (独立表，暂无关联)

admins
└── (独立表，管理用)

feedback_config
└── (全局配置表)

feedback_buttons
└── (独立表，UI配置)
```

## 星等配置示例

| 星等 | 最小点击 | 最大点击 | 大小 | 亮度 | 光晕 | 颜色 | 标签 |
|------|----------|----------|------|------|------|------|------|
| 1 | 1000 | null | 3.0 | 1.0 | 2.0 | #FFD700 | 超新星 |
| 2 | 500 | 999 | 2.5 | 0.9 | 1.8 | #FFA500 | 巨星 |
| 3 | 200 | 499 | 2.0 | 0.8 | 1.5 | #FF6347 | 亮星 |
| 4 | 100 | 199 | 1.5 | 0.7 | 1.2 | #4169E1 | 中星 |
| 5 | 50 | 99 | 1.2 | 0.6 | 1.0 | #9370DB | 次星 |
| 6 | 20 | 49 | 1.0 | 0.5 | 0.8 | #20B2AA | 暗星 |
| 7 | 0 | 19 | 0.8 | 0.4 | 0.6 | #708090 | 微星 |

## 常用数据库操作

### 查看所有表
```bash
sqlite3 prisma/dev.db ".tables"
```

### 查看agents数据
```bash
sqlite3 prisma/dev.db "SELECT id, name, clickCount, enabled FROM agents LIMIT 10;"
```

### 查看星等配置
```bash
sqlite3 prisma/dev.db "SELECT magnitude, label, minClicks, brightness, size FROM star_magnitude_configs ORDER BY magnitude;"
```

### 备份数据库
```bash
cp prisma/dev.db prisma/dev.db.backup
```

### 重置数据库
```bash
rm prisma/dev.db
npx prisma db push
npx prisma db seed
```

## 数据库文件位置
- **开发环境**: `prisma/dev.db`
- **生产环境**: `prisma/production.db`

## Prisma命令
```bash
# 生成客户端
npx prisma generate

# 数据库迁移
npx prisma db push

# 数据库种子
npx prisma db seed

# 数据库浏览器
npx prisma studio
```

---
*最后更新: 2025-07-18*
*数据库版本: Prisma 5.x*
*SQLite版本: 3.x*