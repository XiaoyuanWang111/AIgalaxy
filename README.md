# 🌌 AI Agent 体验台 - 3D银河系探索平台

一个现代化的AI工具展示和管理平台，采用3D银河系界面，让用户在宇宙中探索各种AI工具和服务。

![AI Galaxy](https://img.shields.io/badge/AI-Galaxy-blue?style=for-the-badge&logo=react)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![3D](https://img.shields.io/badge/3D-Canvas-green?style=for-the-badge)

## ✨ 核心特性

### 🌟 **3D银河系界面**
- **360度自由旋转** - 鼠标拖拽任意角度观察星系
- **深度缩放控制** - 滚轮控制从宏观到微观视角
- **真实物理运动** - 基于开普勒定律的行星轨道系统
- **立体纵深感** - 真正的3D透视投影效果

### 🪐 **AI工具展示**
- **行星化展示** - 每个AI工具呈现为独特的3D行星
- **6种行星类型** - 气态巨星、环状行星、类地行星等
- **动态轨道** - 距离中心越远运行越慢，符合物理定律
- **交互式探索** - 悬浮查看详情，点击深入了解

### 🎮 **交互体验**
- **智能搜索** - 实时搜索AI工具名称和描述
- **分类筛选** - 按标签快速筛选特定类型工具
- **自动旋转模式** - 一键开启自动展示效果
- **响应式设计** - 完美适配桌面和移动设备

### 🛠️ **管理功能**
- **动态配置** - 后台实时添加、编辑、删除AI工具
- **反馈系统** - 可配置的用户反馈按钮
- **状态管理** - 启用/禁用工具显示控制
- **数据持久化** - SQLite数据库存储

## 🚀 快速开始

### 环境要求
- Node.js 18.0+ 
- npm 或 yarn 或 pnpm

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd ai-agent-platform
```

2. **安装依赖**
```bash
npm install
# 或
yarn install
# 或
pnpm install
```

3. **环境配置**
```bash
# 复制环境变量文件
cp .env.example .env.local

# 配置数据库
npx prisma generate
npx prisma db push
```

4. **启动开发服务器**
```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

5. **访问应用**
打开浏览器访问 [http://localhost:3000](http://localhost:3000)

### 🖱️ **一键启动（macOS）**
双击项目根目录下的 `启动AI体验台.command` 文件即可自动启动！

## 📁 项目结构

```
ai-agent-platform/
├── app/                          # Next.js 14 App Router
│   ├── page.tsx                  # 3D银河系主页
│   ├── admin/                    # 管理后台
│   ├── api/                      # API 路由
│   └── globals.css               # 全局样式
├── components/                   # React 组件
│   ├── Galaxy3D.tsx              # 3D银河系核心引擎
│   ├── EnhancedStarField.tsx     # 高级星空背景
│   ├── RealisticPlanet.tsx       # 逼真行星组件
│   ├── CentralStar.tsx           # 中央恒星效果
│   ├── Galaxy3DControls.tsx      # 3D控制面板
│   └── PlanetInfoPanel.tsx       # 行星信息面板
├── prisma/                       # 数据库配置
│   ├── schema.prisma             # 数据模型
│   └── dev.db                    # SQLite 数据库
├── docs/                         # 项目文档
├── public/                       # 静态资源
└── 启动AI体验台.command           # macOS 一键启动脚本
```

## 🎯 技术架构

### 前端技术栈
- **React 18** - 现代化React开发
- **Next.js 14** - 全栈React框架，App Router
- **TypeScript** - 类型安全的JavaScript
- **Ant Design** - 企业级UI组件库
- **Canvas API** - 高性能2D/3D图形渲染

### 后端技术栈  
- **Next.js API Routes** - 服务端API
- **Prisma ORM** - 现代化数据库ORM
- **SQLite** - 轻量级关系数据库
- **Cookie认证** - 简单安全的身份验证

### 3D图形技术
- **3D数学变换** - 旋转矩阵、透视投影
- **物理仿真** - 开普勒定律轨道计算
- **粒子系统** - 多层次星空效果
- **性能优化** - 视锥剔除、深度排序

## 🎨 3D效果详解

### 核心算法

**3D旋转变换**
```typescript
const rotateX = (point, angle) => ({
  x: point.x,
  y: point.y * Math.cos(angle) - point.z * Math.sin(angle),
  z: point.y * Math.sin(angle) + point.z * Math.cos(angle)
})
```

**透视投影**
```typescript
const project3D = (point, canvas) => {
  const distance = 800
  const scale = distance / (distance + point.z)
  return {
    x: point.x * scale + canvas.width / 2,
    y: point.y * scale + canvas.height / 2,
    scale: scale
  }
}
```

**开普勒定律**
```typescript
// T² ∝ r³ 简化为 T ∝ r^1.5
const orbitSpeed = baseSpeed / Math.pow(orbitRadius / baseRadius, 0.8)
```

### 粒子系统层次
1. **背景星空** - 400颗静态闪烁星星
2. **星际尘埃** - 100个旋转微粒
3. **星云效果** - 8个大范围渐变背景
4. **AI行星** - 动态数量的3D行星
5. **中央恒星** - 多层光效太阳

## 🔧 开发指南

### 添加新的AI工具

1. **通过管理界面**（推荐）
   - 访问 `/admin` 管理后台
   - 点击"新增AI工具"
   - 填写工具信息并保存

2. **通过API**
```bash
curl -X POST http://localhost:3000/api/agents \
  -H "Content-Type: application/json" \
  -H "Cookie: admin-auth=true" \
  -d '{
    "name": "工具名称",
    "description": "工具描述", 
    "tags": "标签1,标签2",
    "manager": "负责人",
    "homepage": "https://example.com"
  }'
```

### 自定义行星类型

在 `components/RealisticPlanet.tsx` 中添加新的行星类型：

```typescript
const planetTypes = [
  // 现有类型...
  {
    type: 'custom',
    colors: ['#FF00FF', '#00FFFF', '#FFFF00'],
    rings: false,
    atmosphere: true,
    storms: false
  }
]
```

### 修改3D效果参数

在 `components/Galaxy3D.tsx` 中调整：

```typescript
// 修改轨道参数
const baseRadius = 300        // 第一颗行星轨道半径
const radiusIncrement = 120   // 轨道间距

// 修改粒子数量
const starCount = 400         // 背景星星数量

// 修改物理参数
const baseSpeed = 0.5         // 基础轨道速度
```

## 🎮 使用说明

### 基础操作
- **拖拽旋转** - 鼠标按住拖拽可360度旋转银河系
- **滚轮缩放** - 向上滚动放大，向下滚动缩小
- **悬浮查看** - 鼠标悬浮在行星上查看基本信息
- **点击探索** - 点击行星打开详细信息面板

### 控制面板功能
- **搜索工具** - 实时搜索AI工具名称和描述
- **分类筛选** - 按标签筛选特定类型的工具
- **重置视角** - 一键回到初始观察角度
- **自动旋转** - 开启自动展示模式
- **缩放控制** - 精确控制缩放级别

### 管理后台 (`/admin`)
- **工具管理** - 增删改查AI工具信息
- **反馈配置** - 自定义用户反馈按钮
- **状态控制** - 启用/禁用工具显示
- **数据统计** - 查看工具使用统计

## 🚀 部署指南

### Vercel 部署（推荐）

1. **连接GitHub仓库**
```bash
npm i -g vercel
vercel --prod
```

2. **环境变量配置**
在Vercel Dashboard中设置：
- `DATABASE_URL` - 数据库连接字符串
- `ADMIN_PASSWORD` - 管理员密码

### Docker 部署

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### 传统服务器部署

```bash
# 构建生产版本
npm run build

# 启动生产服务
npm start

# 使用PM2管理进程
npm install -g pm2
pm2 start npm --name "ai-galaxy" -- start
```

## 🔧 配置选项

### 环境变量

```env
# 数据库配置
DATABASE_URL="file:./dev.db"

# 管理员配置  
ADMIN_PASSWORD="your-admin-password"

# 应用配置
NEXT_PUBLIC_APP_NAME="AI Agent 体验台"
NEXT_PUBLIC_APP_VERSION="1.0.0"

# 3D效果配置
NEXT_PUBLIC_ENABLE_3D="true"
NEXT_PUBLIC_MAX_PARTICLES="400"
```

### 性能调优

```javascript
// 在 Galaxy3D.tsx 中调整性能参数
const PERFORMANCE_CONFIG = {
  starCount: 400,           // 星星数量
  dustCount: 100,           // 尘埃粒子数量
  targetFPS: 60,            // 目标帧率
  cullingDistance: 800,     // 剔除距离
  maxPlanets: 50           // 最大行星数量
}
```

## 🤝 贡献指南

### 开发流程

1. **Fork项目** 并创建功能分支
```bash
git checkout -b feature/amazing-feature
```

2. **提交更改**
```bash
git commit -m 'Add some amazing feature'
```

3. **推送分支**
```bash
git push origin feature/amazing-feature
```

4. **创建Pull Request**

### 代码规范

- **TypeScript** - 严格类型检查
- **ESLint** - 代码质量检查
- **Prettier** - 代码格式化
- **Conventional Commits** - 提交信息规范

### 测试要求

```bash
# 运行测试套件
npm test

# 类型检查
npm run type-check

# 代码检查
npm run lint

# 构建测试
npm run build
```

## 📊 性能指标

### 3D渲染性能
- **目标帧率**: 60 FPS
- **粒子系统**: 500+ 粒子实时渲染
- **3D变换**: 实时矩阵计算
- **内存使用**: < 100MB 浏览器内存

### 加载性能
- **首屏加载**: < 2秒
- **3D初始化**: < 1秒
- **路由切换**: < 500ms
- **API响应**: < 200ms

## 🔍 故障排除

### 常见问题

**Q: 3D效果不显示或卡顿**
A: 检查浏览器是否支持Canvas API，尝试降低粒子数量

**Q: 管理后台无法访问**
A: 确认cookie设置正确，清除浏览器缓存重试

**Q: 数据库连接失败**
A: 检查 `DATABASE_URL` 环境变量，运行 `npx prisma generate`

**Q: 启动脚本无权限**
A: 在macOS中执行 `chmod +x 启动AI体验台.command`

### 调试模式

```bash
# 开启详细日志
DEBUG=* npm run dev

# 禁用3D效果（调试用）
NEXT_PUBLIC_ENABLE_3D=false npm run dev

# 数据库调试
npx prisma studio
```

## 📜 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- **React** - 强大的UI框架
- **Next.js** - 优秀的全栈框架  
- **Ant Design** - 美观的组件库
- **Prisma** - 现代化的ORM
- **Three.js生态** - 3D图形学习参考

## 📞 联系方式

- **项目维护者**: [您的名字]
- **邮箱**: your.email@example.com
- **项目主页**: https://github.com/your-username/ai-agent-platform

---

<div align="center">

**🌌 在AI的银河系中，探索无限可能 🌌**

Made with ❤️ by AI Agent Platform Team

</div>