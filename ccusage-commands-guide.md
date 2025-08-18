# CCUsage 命令使用指南

## 简介
CCUsage 是用于分析 Claude Code 使用情况的工具，提供多种查看和监控 API 使用统计的方式。

## 安装
```bash
npm install -g ccusage
# 或使用 npx
npx ccusage [命令] [选项]
```

## 核心命令

### 1. 基础查看命令

#### 按日期分组
```bash
ccusage daily                # 按日期显示使用报告
ccusage daily --since 20250701 --until 20250715  # 指定日期范围
```

#### 按月份分组
```bash
ccusage monthly              # 按月份显示使用报告
```

#### 按会话分组
```bash
ccusage session              # 按会话显示使用报告
```

#### 按计费块分组
```bash
ccusage blocks               # 按计费块显示使用报告
```

### 2. 实时监控模式

#### 实时仪表板
```bash
ccusage blocks --live        # 实时使用监控，每秒更新
```

#### 自定义设置
```bash
ccusage blocks --live -t 500000           # 设置50万token限制
ccusage blocks --live -t max               # 使用历史最高值作为限制
ccusage blocks --live --refresh-interval 2  # 每2秒更新一次
```

### 3. MCP 服务器
```bash
ccusage mcp                  # 启动 MCP 服务器
```

## 常用选项

| 选项 | 说明 | 示例 |
|------|------|------|
| `--since <date>` | 从指定日期开始 | `--since 20250701` |
| `--until <date>` | 到指定日期结束 | `--until 20250715` |
| `--json` | JSON格式输出 | `--json` |
| `--breakdown` | 按模型详细分解 | `--breakdown` |
| `--project <name>` | 指定项目名称 | `--project my-project` |
| `--color/--no-color` | 开启/关闭彩色输出 | `--color` |
| `--debug` | 显示调试信息 | `--debug` |
| `--instances` | 按项目/实例分组 | `--instances` |

## 实时仪表板显示内容

使用 `--live` 模式时，终端会显示：
- 当前5小时Claude Code会话进度
- Token消耗速率和预计耗尽时间
- 基于使用模式的成本预测
- 令牌和会话剩余时间的可视化进度条

## 输出示例

### 基本使用报告
```
日期         Tokens    成本(USD)  会话数
2025-07-19   125,430   $0.89      8
2025-07-20   98,765    $0.71      6
2025-07-21   156,234   $1.12      12
```

### 实时模式
```
┌─ Claude Code 实时使用监控 ─┐
│ 会话时间: 2h 15m / 5h          │
│ Token使用: 234,567 / 500,000   │
│ 消耗速率: 1,847 tokens/min     │
│ 预计耗尽: 2h 23m               │
│ 当前成本: $1.68                │
└──────────────────────────────┘
```

## 注意事项
- 实时模式每5小时会话重置一次
- 成本计算基于实际API定价
- 支持离线模式和在线定价更新
- 可以通过环境变量控制颜色输出

## 相关资源
- [官方文档](https://ccusage.com/guide/getting-started)
- [GitHub项目](https://github.com/ryoppippi/ccusage)