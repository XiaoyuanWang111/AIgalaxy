# 🌌 AI Galaxy - 3D AI Agent Platform

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Xaiver03/AIgalaxy)
[![Docker](https://img.shields.io/badge/docker-supported-blue)](deploy/docker/docker-compose.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **Explore AI tools in an immersive 3D galaxy where each tool appears as a star with brightness based on popularity.**

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Prisma-5.14-2D3748?style=for-the-badge&logo=prisma" alt="Prisma"/>
  <img src="https://img.shields.io/badge/PostgreSQL-15-316192?style=for-the-badge&logo=postgresql" alt="PostgreSQL"/>
</div>

---

## ✨ Features

- **🌟 3D Galaxy Interface**: Interactive cosmos where each AI tool is a star
- **📊 Dynamic Star System**: Brightness reflects tool popularity (7 magnitude levels)
- **⚡ Real-time Physics**: Smooth 30fps rendering with particle effects
- **🔐 Admin Dashboard**: Complete agent and configuration management
- **🚀 Production Ready**: Docker, Vercel, and cloud deployment support

## 🚀 Quick Deploy

### Option 1: Vercel (Fastest - 2 minutes)
1. Click "Deploy with Vercel" button above
2. Connect GitHub and configure PostgreSQL database
3. Set environment variables → Deploy!

### Option 2: Docker (Full Stack)
```bash
git clone https://github.com/Xaiver03/AIgalaxy.git
cd AIgalaxy
./deploy/scripts/deploy.sh  # One-click deployment
```

### Option 3: Local Development
```bash
# Clone and setup
git clone https://github.com/Xaiver03/AIgalaxy.git
cd AIgalaxy && npm install

# Configure database
cp .env.example .env.local
# Edit .env.local with your DATABASE_URL

# Initialize and start
npx prisma db push && npm run db:seed && npm run dev
```

## 📋 Essential Configuration

```env
# Required Environment Variables
DATABASE_URL="postgresql://username:password@host:5432/database"
SESSION_SECRET="your-32-character-secret"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="your-secure-password"
```

## 📚 Documentation

| Topic | Link | Description |
|-------|------|-------------|
| 🚀 **Deployment** | [docs/deployment/](docs/deployment/) | Complete deployment guides |
| ☁️ **Vercel** | [vercel.md](docs/deployment/vercel.md) | Vercel-specific setup |
| 🐳 **Docker** | [docker.md](docs/deployment/docker.md) | Containerized deployment |
| 🛠️ **Development** | [DEVELOPMENT.md](docs/DEVELOPMENT.md) | Local development guide |
| 📊 **API** | [api.md](docs/api.md) | API reference |
| 🗄️ **Database** | [database-structure.md](docs/database-structure.md) | Schema documentation |

## 🌟 Star Magnitude System

| Clicks | Magnitude | Brightness | Description |
|--------|-----------|------------|-------------|
| 1000+ | ⭐⭐⭐⭐⭐ | Super Bright | Popular tools |
| 500-999 | ⭐⭐⭐⭐ | Bright | Well-known |
| 200-499 | ⭐⭐⭐ | Normal | Regular use |
| 100-199 | ⭐⭐ | Dim | Moderate |
| 0-99 | ⭐ | Faint | New/Niche |

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **Database**: PostgreSQL + Prisma ORM
- **UI**: Ant Design + Tailwind CSS
- **3D Graphics**: Custom Canvas API
- **Deployment**: Vercel, Docker, Cloud servers

## 📁 Project Structure

```
ai-agent-platform/
├── app/                 # Next.js 14 App Router
│   ├── admin/          # Admin dashboard
│   ├── agents/         # Agent pages
│   └── api/            # API routes
├── components/         # React components
├── lib/                # Utilities and configs
├── prisma/             # Database schema
├── deploy/             # Deployment configs
│   ├── docker/         # Docker compose setup
│   ├── scripts/        # Deployment scripts
│   └── docs/           # Deployment guides
├── docs/               # Project documentation
└── scripts/            # Utility scripts
```

## 🌐 Access Points

After deployment:
- **Main App**: `https://your-domain.com`
- **Admin Panel**: `https://your-domain.com/admin`
- **API Health**: `https://your-domain.com/api/health`
- **Database Admin**: `https://your-domain.com:8080` (Docker only)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/Xaiver03/AIgalaxy/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Xaiver03/AIgalaxy/discussions)
- **Documentation**: [Project Docs](docs/)

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

<div align="center">
  <strong>Made with ❤️ for the AI community</strong>
  <br>
  ⭐ Star this repo if you find it useful!
</div>