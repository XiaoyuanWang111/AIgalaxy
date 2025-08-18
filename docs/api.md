# 🔌 API 文档

AI Agent 体验台提供了完整的 RESTful API，支持所有核心功能的操作。

## 🌐 基础信息

- **基础URL**: `http://localhost:3000/api`
- **认证方式**: Cookie-based Session
- **数据格式**: JSON
- **字符编码**: UTF-8

## 🔐 认证系统

### 管理员登录
```http
POST /api/admin/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**响应**:
```json
{
  "success": true,
  "admin": {
    "id": "admin_id",
    "email": "admin@example.com", 
    "name": "系统管理员"
  }
}
```

### 检查登录状态
```http
GET /api/admin/login
```

**响应**:
```json
{
  "isAuthenticated": true
}
```

### 管理员登出
```http
DELETE /api/admin/login
```

## 🛠️ AI工具管理

### 获取工具列表
```http
GET /api/agents
```

**响应**:
```json
{
  "agents": [
    {
      "id": "agent_id",
      "name": "Claude Code",
      "description": "用于代码生成、调试、数据处理任务",
      "tags": "编程,调试,AI助手",
      "manager": "张三",
      "homepage": "https://claude.ai",
      "icon": "🤖",
      "coverImage": "https://example.com/image.jpg",
      "guideContent": "# 使用指南...",
      "enabled": true,
      "createdAt": "2025-07-18T00:00:00.000Z",
      "updatedAt": "2025-07-18T00:00:00.000Z"
    }
  ]
}
```

### 获取单个工具
```http
GET /api/agents/{id}
```

### 创建工具 🔒
```http
POST /api/agents
Content-Type: application/json
Authorization: 需要管理员登录

{
  "name": "新AI工具",
  "description": "工具描述",
  "tags": "标签1,标签2",
  "manager": "负责人",
  "homepage": "https://example.com",
  "icon": "🤖",
  "coverImage": "https://example.com/cover.jpg",
  "guideContent": "# 详细使用指南",
  "enabled": true
}
```

### 更新工具 🔒
```http
PUT /api/agents/{id}
Content-Type: application/json
Authorization: 需要管理员登录

{
  "name": "更新后的名称",
  "description": "更新后的描述"
}
```

### 删除工具 🔒
```http
DELETE /api/agents/{id}
Authorization: 需要管理员登录
```

## 💬 反馈按钮管理

### 获取反馈按钮列表
```http
GET /api/feedback-buttons
```

**响应**:
```json
{
  "buttons": [
    {
      "id": "button_id",
      "title": "AI产品反馈",
      "description": "对具体AI工具的使用反馈",
      "url": "https://forms.gle/example",
      "icon": "message",
      "color": "#1890ff",
      "order": 1,
      "enabled": true,
      "createdAt": "2025-07-18T00:00:00.000Z",
      "updatedAt": "2025-07-18T00:00:00.000Z"
    }
  ]
}
```

### 创建反馈按钮 🔒
```http
POST /api/feedback-buttons
Content-Type: application/json
Authorization: 需要管理员登录

{
  "title": "新反馈按钮",
  "description": "按钮描述",
  "url": "https://forms.gle/example",
  "icon": "message",
  "color": "#1890ff",
  "order": 1,
  "enabled": true
}
```

### 更新反馈按钮 🔒
```http
PUT /api/feedback-buttons/{id}
Content-Type: application/json
Authorization: 需要管理员登录

{
  "title": "更新后的标题",
  "enabled": false
}
```

### 删除反馈按钮 🔒
```http
DELETE /api/feedback-buttons/{id}
Authorization: 需要管理员登录
```

## 📝 申请管理

### 获取申请列表 🔒
```http
GET /api/applications
Authorization: 需要管理员登录
```

**响应**:
```json
{
  "applications": [
    {
      "id": "app_id",
      "agentId": "agent_id",
      "agentName": "Claude Code",
      "applicantName": "申请人姓名",
      "email": "user@example.com",
      "reason": "申请原因",
      "status": "PENDING",
      "createdAt": "2025-07-18T00:00:00.000Z"
    }
  ]
}
```

### 更新申请状态 🔒
```http
PATCH /api/applications/{id}
Content-Type: application/json
Authorization: 需要管理员登录

{
  "status": "APPROVED"
}
```

## 📊 用户反馈

### 获取反馈列表 🔒
```http
GET /api/feedback
Authorization: 需要管理员登录
```

**响应**:
```json
{
  "feedback": [
    {
      "id": "feedback_id",
      "agentId": "agent_id", 
      "agentName": "Claude Code",
      "userName": "用户姓名",
      "email": "user@example.com",
      "score": 5,
      "comment": "很好用的工具",
      "createdAt": "2025-07-18T00:00:00.000Z"
    }
  ]
}
```

## ⚙️ 反馈配置

### 获取反馈配置
```http
GET /api/feedback-config
```

### 更新反馈配置 🔒
```http
PUT /api/feedback-config
Content-Type: application/json
Authorization: 需要管理员登录

{
  "productFeedbackUrl": "https://forms.gle/product",
  "platformFeedbackUrl": "https://forms.gle/platform"
}
```

## 📁 文件上传

### 上传图片 🔒
```http
POST /api/upload
Content-Type: multipart/form-data
Authorization: 需要管理员登录

file: [图片文件]
```

**响应**:
```json
{
  "url": "/uploads/filename.jpg"
}
```

## 📋 状态码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未授权（需要登录） |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

## 🔧 错误响应格式

```json
{
  "error": "错误描述信息",
  "code": "ERROR_CODE",
  "details": "详细错误信息"
}
```

## 📚 使用示例

### JavaScript/TypeScript
```typescript
// 获取工具列表
const response = await fetch('/api/agents');
const data = await response.json();
console.log(data.agents);

// 创建新工具（需要登录）
const newAgent = await fetch('/api/agents', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: '新工具',
    description: '工具描述',
    tags: '标签1,标签2',
    manager: '负责人'
  })
});
```

### cURL
```bash
# 获取工具列表
curl -X GET http://localhost:3000/api/agents

# 管理员登录
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}' \
  -c cookies.txt

# 创建工具（使用登录cookie）
curl -X POST http://localhost:3000/api/agents \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"name":"新工具","description":"描述"}'
```

## 🧪 API 测试

推荐使用以下工具测试API：
- **Postman** - 图形化接口测试工具
- **Insomnia** - 轻量级API客户端
- **curl** - 命令行工具
- **VS Code REST Client** - VS Code插件

## 📝 API 版本控制

当前API版本：`v1`

未来版本变更将通过以下方式管理：
- 主要版本：`/api/v2/agents`
- 向后兼容：保持v1接口可用
- 废弃通知：提前通知接口变更

---

*最后更新: 2025-07-18*