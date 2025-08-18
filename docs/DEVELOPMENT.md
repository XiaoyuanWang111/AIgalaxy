# 📚 开发指南 - AI Agent 体验台

## 🎯 版本管理策略

### 分支管理
```
main              # 主分支 - 生产环境代码
├── develop       # 开发分支 - 集成最新功能
├── feature/*     # 功能分支 - 新功能开发
├── hotfix/*      # 修复分支 - 紧急修复
└── release/*     # 发布分支 - 发布准备
```

### 版本号规范
采用语义化版本控制 (Semantic Versioning)：`MAJOR.MINOR.PATCH`

- **MAJOR**: 破坏性变更
- **MINOR**: 新功能添加
- **PATCH**: 错误修复

## 🔄 开发工作流

### 1. 功能开发流程
```bash
# 1. 从develop分支创建功能分支
git checkout develop
git pull origin develop
git checkout -b feature/feedback-button-enhancement

# 2. 开发功能
# ... 编码 ...

# 3. 提交代码
git add .
git commit -m "feat: 添加反馈按钮拖拽排序功能

- 支持拖拽调整按钮顺序
- 实时保存排序结果
- 优化用户体验

🚀 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# 4. 推送到远程
git push origin feature/feedback-button-enhancement

# 5. 创建Pull Request到develop分支
```

### 2. 提交信息规范
使用约定式提交 (Conventional Commits)：

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**类型 (type):**
- `feat`: 新功能
- `fix`: 错误修复
- `docs`: 文档更新
- `style`: 代码格式化
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建工具、辅助工具的变动

**示例:**
```bash
feat(admin): 添加批量删除功能
fix(api): 修复反馈按钮API权限验证
docs(readme): 更新安装说明
style(component): 格式化FeedbackButtons组件
```

## 🚀 发布流程

### 1. 准备发布
```bash
# 创建发布分支
git checkout develop
git checkout -b release/v1.1.0

# 更新版本号
npm version minor  # 或 major/patch

# 更新CHANGELOG.md
# 运行测试
npm test
npm run build
```

### 2. 发布到生产
```bash
# 合并到main分支
git checkout main
git merge release/v1.1.0

# 创建标签
git tag -a v1.1.0 -m "Release version 1.1.0"

# 推送到远程
git push origin main --tags

# 合并回develop分支
git checkout develop
git merge release/v1.1.0
```

## 🛠️ 本地开发环境

### 环境配置
```bash
# 1. 克隆项目
git clone <repository-url>
cd ai-agent-platform

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 配置

# 4. 初始化数据库
npx prisma db push
npx prisma db seed

# 5. 启动开发服务器
./启动AI体验台.command
# 或
npm run dev
```

### 数据库管理
```bash
# 查看数据库
npx prisma studio

# 重置数据库
npx prisma db push --force-reset
npx prisma db seed

# 生成新的迁移
npx prisma db push

# 更新客户端
npx prisma generate
```

## 📁 项目结构

```
ai-agent-platform/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 主页
│   ├── admin/             # 管理后台
│   ├── agents/            # 工具详情页
│   └── api/               # API路由
├── components/            # React组件
├── prisma/               # 数据库配置
├── public/               # 静态资源
├── lib/                  # 工具函数
└── docs/                 # 文档
```

## 🧪 测试策略

### 测试类型
- **单元测试**: 组件和函数测试
- **集成测试**: API端点测试
- **E2E测试**: 用户流程测试

### 运行测试
```bash
# 运行所有测试
npm test

# 监视模式
npm run test:watch

# 生成覆盖率报告
npm run test:coverage
```

## 🚨 代码质量

### 代码检查
```bash
# ESLint检查
npm run lint

# TypeScript检查
npm run type-check

# 代码格式化
npm run format
```

### 提交前检查
```bash
# 安装Git hooks
npm run prepare

# 手动运行预提交检查
npm run pre-commit
```

## 📝 文档更新

### 必须更新的文档
1. **README.md** - 项目概述和快速开始
2. **CHANGELOG.md** - 版本变更记录
3. **API文档** - 接口说明
4. **组件文档** - 组件使用说明

### 文档规范
- 使用Markdown格式
- 包含代码示例
- 保持更新及时性
- 支持中英文双语

## 🔧 常用命令

```bash
# 开发相关
npm run dev              # 启动开发服务器
npm run build           # 构建生产版本
npm run start           # 启动生产服务器

# 数据库相关
npx prisma studio       # 数据库管理界面
npx prisma db seed      # 重新填充数据
npx prisma generate     # 更新客户端

# Git相关
git status              # 查看状态
git log --oneline       # 查看提交历史
git branch -a           # 查看所有分支
```

## 🐛 故障排除

### 常见问题
1. **端口被占用**: 使用 `lsof -i :3001` 查看占用进程
2. **数据库错误**: 重新运行 `npx prisma db push`
3. **依赖问题**: 删除 `node_modules` 重新安装
4. **缓存问题**: 清除 `.next` 目录

### 调试技巧
- 使用浏览器开发者工具
- 查看服务器控制台日志
- 使用 `console.log` 调试
- 使用 VS Code 调试器

---

*最后更新: 2025-07-18*
*版本: v1.0 - 初始版本*