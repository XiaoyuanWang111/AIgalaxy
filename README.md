# 🌌 AI Galaxy - Interactive 3D AI Tools Explorer

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Prisma-5.14-2D3748?style=for-the-badge&logo=prisma" alt="Prisma"/>
  <img src="https://img.shields.io/badge/PostgreSQL-14-316192?style=for-the-badge&logo=postgresql" alt="PostgreSQL"/>
</div>

<div align="center">
  <h3>🚀 Explore AI Tools in an Immersive 3D Galaxy Experience</h3>
  <p>Transform the way you discover AI tools with our innovative 3D visualization platform</p>
</div>

---

## ✨ What is AI Galaxy?

AI Galaxy is a revolutionary platform that visualizes AI tools and services as stars in an interactive 3D galaxy. Each AI tool is represented as a star whose brightness corresponds to its popularity, creating a stunning visual representation of the AI ecosystem.

### 🎯 Key Features

#### 🌟 **3D Galaxy Visualization**
- **Immersive Experience**: Navigate through a beautiful 3D galaxy where each star represents an AI tool
- **Dynamic Star System**: 7-level magnitude system based on tool popularity
  - 🌑 Dim Stars (0-19 clicks)
  - ⭐ Normal Stars (20-49 clicks)
  - ✨ Bright Stars (50-99 clicks)
  - 💫 Shining Stars (100-499 clicks)
  - 🌟 Giant Stars (500-999 clicks)
  - ⚡ Super Giants (1000-4999 clicks)
  - 🌞 Hypergiant Stars (5000+ clicks)

#### 🎮 **Interactive Features**
- **Real-time Physics**: Stars move with realistic orbital mechanics
- **Smooth Controls**: Intuitive mouse/touch controls for navigation
- **Particle Effects**: Beautiful trails and glow effects
- **Information Display**: Hover to see tool details, click to explore

#### 🛠️ **Platform Capabilities**
- **AI Tool Showcase**: Comprehensive information for each AI tool
- **Smart Categorization**: Tag-based filtering and search
- **Usage Analytics**: Track popularity and trending tools
- **Admin Dashboard**: Full CRUD operations for tool management
- **Responsive Design**: Works seamlessly on all devices

## 🚀 Tech Stack

<table>
<tr>
<td>

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.0
- **UI Library**: Ant Design 5.26
- **Styling**: Tailwind CSS 3.4
- **3D Engine**: Custom Canvas API
- **State**: React Hooks + Context

</td>
<td>

### Backend
- **API**: Next.js API Routes
- **Database**: PostgreSQL + Prisma
- **Auth**: JWT + bcrypt
- **File Storage**: Local + Cloud
- **Validation**: Zod
- **Security**: Rate limiting

</td>
</tr>
</table>

## 📸 Screenshots

<div align="center">
  <table>
    <tr>
      <td align="center">
        <strong>3D Galaxy View</strong><br>
        <em>Explore AI tools in space</em>
      </td>
      <td align="center">
        <strong>Tool Details</strong><br>
        <em>Comprehensive information</em>
      </td>
    </tr>
    <tr>
      <td align="center">
        <strong>Admin Dashboard</strong><br>
        <em>Manage tools easily</em>
      </td>
      <td align="center">
        <strong>Analytics</strong><br>
        <em>Track usage patterns</em>
      </td>
    </tr>
  </table>
</div>

## 🏁 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Xaiver03/AIgalaxy.git
cd AIgalaxy

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your database credentials

# Set up database
npm run db:generate
npm run db:push
npm run db:seed

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the magic! ✨

## 📝 Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/aigalaxy"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Optional: AI Services
OPENAI_API_KEY="your-openai-key"
```

## 🗂️ Project Structure

```
AIgalaxy/
├── app/                 # Next.js App Router
│   ├── api/            # API endpoints
│   ├── admin/          # Admin pages
│   └── (public)/       # Public pages
├── components/          # React components
│   ├── ui/             # Base UI components
│   └── galaxy/         # 3D galaxy components
├── lib/                # Utilities & configs
├── prisma/             # Database schema
└── public/             # Static assets
```

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Check TypeScript |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:seed` | Seed database |

## 🚀 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Xaiver03/AIgalaxy)

1. Click the button above
2. Configure environment variables
3. Deploy!

### Self-Hosting

```bash
# Build the application
npm run build

# Start production server
npm run start
```

## 🎨 Customization

### Adding New AI Tools
1. Access the admin panel at `/admin`
2. Use the intuitive form to add tools
3. Upload logos and configure tags
4. Tools appear as stars instantly!

### Modifying Star Behavior
Edit `components/GalaxyStarSystem.tsx` to customize:
- Star colors and sizes
- Animation speeds
- Physics parameters
- Interaction behaviors

## 🤝 Contributing

We love contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📊 Performance

- **60 FPS** rendering on modern devices
- **< 3s** initial load time
- **Optimized** for mobile devices
- **Lazy loading** for better performance

## 🔒 Security

- JWT-based authentication
- Rate limiting on API endpoints
- Input validation with Zod
- SQL injection protection via Prisma
- XSS prevention built-in

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Ant Design](https://ant.design/) - UI Design Language
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Vercel](https://vercel.com/) - Deployment Platform

---

<div align="center">
  <p>
    <strong>🌟 Star us on GitHub!</strong><br>
    Built with ❤️ by developers, for developers
  </p>
  <p>
    <a href="https://github.com/Xaiver03/AIgalaxy/issues">Report Bug</a>
    ·
    <a href="https://github.com/Xaiver03/AIgalaxy/issues">Request Feature</a>
    ·
    <a href="https://github.com/Xaiver03/AIgalaxy/discussions">Discussions</a>
  </p>
</div>