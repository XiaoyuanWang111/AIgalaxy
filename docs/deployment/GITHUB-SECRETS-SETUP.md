# 🔐 GitHub Secrets 配置指南

本指南将帮助你配置GitHub Actions自动化CI/CD所需的所有Secrets。

## 📋 Secrets清单

### 1. 腾讯云容器镜像服务 (TCR)

#### 获取腾讯云镜像仓库凭据

1. 登录[腾讯云容器镜像服务](https://console.cloud.tencent.com/tcr)
2. 创建命名空间（如：`ai-platform`）
3. 获取访问凭据：
   - 点击"访问凭证" → "新建访问凭证"
   - 记录用户名和密码

#### 配置Secrets

| Secret名称 | 获取方式 | 示例 |
|-----------|---------|------|
| `TCR_NAMESPACE` | TCR控制台-命名空间名称 | `ai-platform` |
| `TCR_USERNAME` | TCR控制台-访问凭证用户名 | `100012345678` |
| `TCR_PASSWORD` | TCR控制台-访问凭证密码 | `tcr-password-xxx` |

### 2. 服务器SSH连接

#### 生成SSH密钥对

```bash
# 生成专用SSH密钥
ssh-keygen -t rsa -b 4096 -C "github-actions@ai-agent" -f ~/.ssh/github_actions_key

# 查看私钥（用于GitHub Secret）
cat ~/.ssh/github_actions_key

# 查看公钥（添加到服务器）
cat ~/.ssh/github_actions_key.pub
```

#### 服务器配置

```bash
# SSH到服务器
ssh root@your-server-ip

# 添加公钥
echo "你的公钥内容" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

#### 配置Secrets

| Secret名称 | 说明 | 示例 |
|-----------|------|------|
| `HOST` | 服务器IP地址 | `192.168.1.100` |
| `USERNAME` | SSH用户名 | `root` |
| `SSH_KEY` | SSH私钥完整内容 | `-----BEGIN RSA PRIVATE KEY-----...` |
| `PORT` | SSH端口 | `22` |

### 3. 数据库配置

#### PostgreSQL设置

方案A: 使用腾讯云数据库
```bash
# 腾讯云控制台创建PostgreSQL实例
# 获取连接字符串
postgresql://username:password@host:port/database
```

方案B: 服务器自建数据库
```bash
# 安装PostgreSQL
sudo apt install postgresql postgresql-contrib

# 创建数据库和用户
sudo -u postgres psql
CREATE DATABASE ai_agent_platform;
CREATE USER ai_agent_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE ai_agent_platform TO ai_agent_user;
```

#### Redis设置

```bash
# 安装Redis
sudo apt install redis-server

# 设置密码
sudo nano /etc/redis/redis.conf
# 添加: requirepass your_redis_password

# 重启Redis
sudo systemctl restart redis
```

#### 配置Secrets

| Secret名称 | 说明 | 示例 |
|-----------|------|------|
| `DATABASE_URL` | PostgreSQL连接字符串 | `postgresql://ai_agent_user:password@localhost:5432/ai_agent_platform` |
| `REDIS_URL` | Redis连接字符串 | `redis://:password@localhost:6379` |
| `SESSION_SECRET` | 会话密钥(至少32字符) | 使用 `openssl rand -base64 48` 生成 |

### 4. 应用配置

| Secret名称 | 说明 | 示例 |
|-----------|------|------|
| `DOMAIN` | 应用域名 | `ai-agent.example.com` |

### 5. Docker Hub配置（可选）

如果同时推送到Docker Hub：

1. 登录[Docker Hub](https://hub.docker.com)
2. 账户设置 → Security → New Access Token
3. 创建访问令牌

| Secret名称 | 说明 | 示例 |
|-----------|------|------|
| `DOCKER_HUB_USERNAME` | Docker Hub用户名 | `your-username` |
| `DOCKER_HUB_TOKEN` | Docker Hub访问令牌 | `dckr_pat_xxx...` |

## 🚀 配置步骤

### 1. 进入GitHub仓库设置

```
你的仓库 → Settings → Secrets and variables → Actions
```

### 2. 添加Secret

1. 点击 **New repository secret**
2. 输入 **Name**（必须与上表完全一致）
3. 输入 **Secret** 值
4. 点击 **Add secret**

### 3. 验证配置

创建所有必需的Secrets后，可以通过手动触发工作流测试：

```
Actions → Docker Build and Deploy → Run workflow
```

## 🔍 调试技巧

### 检查Secret是否正确设置

在GitHub Actions中添加调试步骤：

```yaml
- name: Debug Secrets
  run: |
    echo "TCR_NAMESPACE is set: ${{ secrets.TCR_NAMESPACE != '' }}"
    echo "DATABASE_URL is set: ${{ secrets.DATABASE_URL != '' }}"
    # 注意：永远不要直接输出Secret值！
```

### 常见错误

1. **登录失败**
   - 检查TCR用户名密码是否正确
   - 确认命名空间存在

2. **SSH连接失败**
   - 验证SSH密钥格式正确（包含头尾标记）
   - 确认服务器已添加公钥
   - 检查防火墙是否开放SSH端口

3. **数据库连接失败**
   - 验证DATABASE_URL格式正确
   - 确认数据库服务运行中
   - 检查网络连接和防火墙

## 📝 完整Secrets示例

```yaml
# 腾讯云镜像仓库
TCR_NAMESPACE: ai-platform
TCR_USERNAME: 100012345678
TCR_PASSWORD: tcr_password_xxxxx

# 服务器连接
HOST: 192.144.154.224
USERNAME: root
SSH_KEY: |
  -----BEGIN RSA PRIVATE KEY-----
  MIIEpAIBAAKCAQEA...
  ...完整私钥内容...
  -----END RSA PRIVATE KEY-----
PORT: 22

# 数据库配置
DATABASE_URL: postgresql://ai_user:Pass123!@10.0.0.2:5432/ai_platform
REDIS_URL: redis://:Redis123!@10.0.0.2:6379
SESSION_SECRET: bXlfc3VwZXJfc2VjcmV0X3Nlc3Npb25fa2V5X2F0X2xlYXN0XzMyX2NoYXJz

# 应用配置
DOMAIN: ai-agent.example.com

# Docker Hub（可选）
DOCKER_HUB_USERNAME: myusername
DOCKER_HUB_TOKEN: dckr_pat_abcdefghijklmnop
```

## ✅ 配置完成检查清单

- [ ] TCR_NAMESPACE - 腾讯云镜像命名空间
- [ ] TCR_USERNAME - 腾讯云镜像用户名
- [ ] TCR_PASSWORD - 腾讯云镜像密码
- [ ] HOST - 服务器IP地址
- [ ] USERNAME - SSH用户名
- [ ] SSH_KEY - SSH私钥
- [ ] PORT - SSH端口
- [ ] DATABASE_URL - 数据库连接字符串
- [ ] REDIS_URL - Redis连接字符串
- [ ] SESSION_SECRET - 会话密钥
- [ ] DOMAIN - 应用域名

## 🎯 下一步

配置完所有Secrets后：

1. 推送代码到main分支触发自动部署
2. 在Actions页面监控部署进度
3. 部署完成后访问配置的域名

---

如有问题，请查看[故障排除指南](./README.md#故障排除)或提交Issue。