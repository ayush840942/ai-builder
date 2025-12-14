# AI No-Code Builder

A complete, production-ready AI-powered no-code builder inspired by Lovable.dev.

## ✨ What's Included

This is a **complete, full-stack application** with:

### Backend
- ✅ Express.js server with TypeScript
- ✅ Supabase integration for database and auth
- ✅ **Multiple AI API integrations**:
  - OpenAI GPT-4
  - Anthropic Claude
  - Google Gemini
  - Replicate
- ✅ JWT authentication
- ✅ WebSocket support for real-time features
- ✅ Rate limiting and security middleware
- ✅ Comprehensive error handling
- ✅ Logging with Winston

### Frontend
- ✅ React 18 with TypeScript
- ✅ Vite for fast development
- ✅ TailwindCSS for styling
- ✅ Shadcn/ui components
- ✅ React Query for data fetching
- ✅ Zustand for state management
- ✅ React Router for navigation
- ✅ Beautiful, responsive UI

### Features
- ✅ User authentication (register/login)
- ✅ Project management (CRUD operations)
- ✅ AI code generation with multiple providers
- ✅ Component generation
- ✅ Code improvement
- ✅ Code explanation
- ✅ Real-time collaboration (WebSocket)
- ✅ Responsive design

## 🚀 Quick Start

See [SETUP.md](./SETUP.md) for detailed setup instructions.

```bash
# 1. Install dependencies
cd backend && npm install
cd ../frontend && npm install

# 2. Set up environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Edit .env files with your API keys

# 3. Start backend
cd backend && npm run dev

# 4. Start frontend (in another terminal)
cd frontend && npm run dev
```

## 📁 Project Structure

```
ai-builder-project/
├── backend/                    # Node.js/Express backend
│   ├── src/
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic (AI service)
│   │   ├── middleware/        # Auth, validation, error handling
│   │   └── utils/             # Utilities (logger)
│   └── package.json
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── pages/             # Page components
│   │   ├── components/        # Reusable components
│   │   ├── services/          # API client
│   │   └── stores/            # State management
│   └── package.json
│
└── README.md
```

## 🔑 Required API Keys

You'll need at least one AI provider:

1. **OpenAI** (Recommended) - https://platform.openai.com/api-keys
2. **Anthropic** (Optional) - https://console.anthropic.com/
3. **Google AI** (Optional) - https://makersuite.google.com/app/apikey
4. **Replicate** (Optional) - https://replicate.com/account/api-tokens

Plus:
- **Supabase** account - https://supabase.com

## 🎯 Key Features

### AI Code Generation
Generate complete React components, pages, or entire applications from natural language descriptions.

```typescript
// Example API call
POST /api/ai/generate
{
  "prompt": "Create a user profile card with avatar, name, and bio",
  "framework": "react",
  "style": "tailwind"
}
```

### Multiple AI Providers
Switch between different AI providers based on your needs:
- **OpenAI GPT-4**: Best overall quality
- **Anthropic Claude**: Great for complex reasoning
- **Google Gemini**: Fast and cost-effective
- **Replicate**: Access to specialized models

### Real-time Collaboration
Built-in WebSocket support for real-time code updates and collaboration.

## 📚 Documentation

- [Setup Guide](./SETUP.md) - Complete setup instructions
- [API Documentation](./docs/API.md) - API endpoints reference
- [Development Guide](./docs/DEVELOPMENT.md) - Development workflow
- [Deployment Guide](./docs/DEPLOYMENT.md) - Deploy to production

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express
- TypeScript
- Supabase (PostgreSQL)
- OpenAI, Anthropic, Google AI, Replicate
- Socket.IO
- JWT Authentication

**Frontend:**
- React 18
- TypeScript
- Vite
- TailwindCSS
- Shadcn/ui
- React Query
- Zustand
- React Router

## 🚢 Deployment

Ready to deploy? See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for instructions on deploying to:
- Vercel (Frontend)
- Railway/Render (Backend)
- AWS/GCP/Azure
- Docker

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🙏 Acknowledgments

- Inspired by [Lovable.dev](https://lovable.dev)
- Built with modern web technologies
- Powered by cutting-edge AI models

---

**Ready to build something amazing?** Follow the [SETUP.md](./SETUP.md) guide to get started!
