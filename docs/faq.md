# ❓ 常见问题

## 🚀 安装和启动问题

### Q: 提示 "command not found: node"
**A**: 需要先安装 Node.js
```bash
# macOS 使用 Homebrew
brew install node

# 或者从官网下载安装包
# https://nodejs.org
```

### Q: npm install 失败，提示权限错误
**A**: 尝试以下解决方案：
```bash
# 清除 npm 缓存
npm cache clean --force

# 使用 sudo（不推荐）
sudo npm install

# 推荐：配置 npm 全局目录
npm config set prefix ~/.npm-global
```

### Q: 端口 3000 被占用
**A**: 
```bash
# 查看占用进程
lsof -i :3000

# 终止进程
kill -9 <PID>

# 或使用其他端口启动
npm run dev -- --port 3001
```

### Q: 数据库初始化失败
**A**:
```bash
# 删除现有数据库文件
rm prisma/dev.db

# 重新初始化
npx prisma db push
npx prisma db seed
```

## 🌐 浏览器访问问题

### Q: 点击链接显示 "Open Presentation Preview in Obsidian first!"
**A**: 这是因为在 Obsidian 中点击了链接
- ✅ **正确方式**: 复制链接到浏览器地址栏
- ✅ **正确方式**: 右键选择"在浏览器中打开"
- ❌ **错误方式**: 直接在 Obsidian 中点击

### Q: 浏览器显示 "无法访问此网站"
**A**: 检查以下几点：
1. 确认服务器已启动（看到 "Ready" 提示）
2. 确认端口号正确（默认3000或3001）
3. 尝试 `http://127.0.0.1:3000` 而不是 `localhost`
4. 检查防火墙设置

### Q: 页面显示空白或加载失败
**A**:
```bash
# 检查控制台错误
# 按 F12 打开开发者工具

# 重启服务器
pkill -f "next dev"
npm run dev
```

## 🔐 登录和权限问题

### Q: 管理员登录失败
**A**: 确认使用正确的默认账号：
- **邮箱**: `admin@example.com`
- **密码**: `admin123`

### Q: 登录后仍提示"未授权"
**A**:
```bash
# 清除浏览器 Cookie
# 开发者工具 → Application → Cookies → 清除

# 重新登录
```

### Q: 添加反馈按钮时提示"操作失败"
**A**: 
1. 确认已重新登录获取正确的认证cookie
2. 检查浏览器控制台的错误信息
3. 重启服务器后重新登录

## 💾 数据库相关问题

### Q: 数据丢失或显示不正确
**A**:
```bash
# 检查数据库文件是否存在
ls -la prisma/dev.db

# 重新填充数据
npx prisma db seed

# 查看数据库内容
npx prisma studio
```

### Q: Prisma 错误："Database does not exist"
**A**:
```bash
# 重新生成数据库
npx prisma db push

# 如果问题持续，删除并重建
rm prisma/dev.db
npx prisma db push
npx prisma db seed
```

### Q: 图片上传失败
**A**:
```bash
# 检查上传目录权限
ls -la public/uploads/

# 创建上传目录
mkdir -p public/uploads
chmod 755 public/uploads
```

## 🔧 开发环境问题

### Q: 修改代码后页面没有更新
**A**:
1. 确认服务器在开发模式运行 (`npm run dev`)
2. 检查控制台是否有编译错误
3. 刷新浏览器页面 (Cmd+R / Ctrl+R)
4. 硬刷新 (Cmd+Shift+R / Ctrl+Shift+R)

### Q: TypeScript 类型错误
**A**:
```bash
# 检查类型错误
npm run type-check

# 重新生成 Prisma 客户端
npx prisma generate

# 重启 TypeScript 服务器（VS Code）
# Cmd+Shift+P → "TypeScript: Restart TS Server"
```

### Q: ESLint 或格式化问题
**A**:
```bash
# 运行代码检查
npm run lint

# 自动修复格式问题
npm run lint -- --fix
```

## 🚢 部署相关问题

### Q: 生产环境构建失败
**A**:
```bash
# 清除构建缓存
rm -rf .next

# 重新构建
npm run build

# 检查构建错误并修复
```

### Q: 生产环境数据库问题
**A**:
1. 确认 DATABASE_URL 配置正确
2. 确认数据库文件权限
3. 运行生产环境数据库迁移

## 📱 移动端问题

### Q: 手机访问样式异常
**A**:
1. 确认使用响应式设计
2. 检查视口设置
3. 测试不同屏幕尺寸

### Q: 移动端性能慢
**A**:
1. 优化图片大小
2. 启用压缩
3. 减少不必要的重渲染

## 🔍 调试技巧

### 查看详细错误信息
```bash
# 启动时显示详细日志
DEBUG=* npm run dev

# 查看 API 请求
# 浏览器开发者工具 → Network 标签
```

### 重置到初始状态
```bash
# 完全重置项目
rm -rf node_modules .next prisma/dev.db
npm install
npx prisma db push
npx prisma db seed
npm run dev
```

## 📞 获取更多帮助

如果以上解决方案都无法解决你的问题：

### 1. 查看日志
- 浏览器控制台错误信息
- 服务器终端输出
- 网络请求状态

### 2. 搜索已知问题
- [GitHub Issues](https://github.com/project/issues)
- Stack Overflow
- 项目文档

### 3. 提交问题报告
包含以下信息：
- 操作系统版本
- Node.js 版本
- 错误信息截图
- 复现步骤
- 期望行为

### 4. 联系我们
- **邮箱**: admin@example.com
- **GitHub**: 提交新 Issue

---

*最后更新: 2025-07-18*