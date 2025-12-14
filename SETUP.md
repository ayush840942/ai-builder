# Complete Setup Guide

## 🎯 Quick Start

This guide will help you set up the complete AI No-Code Builder project from scratch.

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 18+ and npm
- **PostgreSQL** 14+ (or use Supabase)
- **Git**

## Step 1: Clone and Setup

```bash
cd /Users/priyanshuchoudhary/Downloads/lovable/ai-builder-project

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## Step 2: Set Up Supabase

1. Go to [https://supabase.com](https://supabase.com) and create a new project
2. Once created, go to **Settings > API** and copy:
   - Project URL
   - `anon` public key
   - `service_role` secret key

3. Create the following tables in Supabase SQL Editor:

```sql
-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  framework TEXT DEFAULT 'react',
  template TEXT,
  code TEXT DEFAULT '',
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_users_email ON users(email);
```

## Step 3: Get AI API Keys

### OpenAI (Required)
1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy and save it securely

### Anthropic Claude (Optional)
1. Go to [https://console.anthropic.com/](https://console.anthropic.com/)
2. Generate an API key
3. Copy and save it

### Google AI (Gemini) (Optional)
1. Go to [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Copy and save it

### Replicate (Optional)
1. Go to [https://replicate.com/account/api-tokens](https://replicate.com/account/api-tokens)
2. Create a token
3. Copy and save it

## Step 4: Configure Environment Variables

### Backend Configuration

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and fill in your values:

```env
# Server
PORT=3001
NODE_ENV=development

# Supabase (from Step 2)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_role_key_here

# AI APIs (from Step 3)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_AI_API_KEY=AI...
REPLICATE_API_TOKEN=r8_...

# JWT Secret (generate a random string)
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:5173
```

### Frontend Configuration

```bash
cd ../frontend
cp .env.example .env
```

Edit `frontend/.env`:

```env
VITE_API_URL=http://localhost:3001
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 5: Start the Application

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

You should see:
```
🚀 Server running on port 3001
📝 Environment: development
🌐 CORS enabled for: http://localhost:5173
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v5.0.10  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## Step 6: Test the Application

1. Open your browser and go to `http://localhost:5173`
2. Click "Get Started" to create an account
3. Fill in your details and register
4. You should be redirected to the dashboard

## 🧪 Testing AI Features

Once logged in, you can test the AI code generation:

```bash
# Using curl or Postman
curl -X POST http://localhost:3001/api/ai/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "prompt": "Create a button component with primary and secondary variants",
    "framework": "react",
    "style": "tailwind"
  }'
```

## 🐛 Troubleshooting

### Backend won't start
- Check if port 3001 is available
- Verify all environment variables are set
- Check Supabase connection

### Frontend won't start
- Check if port 5173 is available
- Run `npm install` again
- Clear node_modules and reinstall

### AI API errors
- Verify API keys are correct
- Check if you have credits/quota
- Try a different AI provider

### Database errors
- Verify Supabase tables are created
- Check service role key permissions
- Review Supabase logs

## 📚 Next Steps

1. **Customize the UI**: Edit components in `frontend/src/components`
2. **Add Features**: Extend the AI service in `backend/src/services/ai.service.ts`
3. **Deploy**: See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions
4. **Add Tests**: Create tests in `__tests__` directories

## 🔒 Security Notes

- Never commit `.env` files
- Use strong JWT secrets in production
- Enable RLS (Row Level Security) in Supabase
- Rate limit your API endpoints
- Validate all user inputs

## 💡 Tips

- Use the OpenAI provider for best results
- Start with simple prompts and iterate
- Monitor your API usage and costs
- Enable caching for frequently generated code
- Use WebSocket for real-time collaboration

## 🆘 Need Help?

- Check the [API Documentation](./API.md)
- Review [Development Guide](./DEVELOPMENT.md)
- Open an issue on GitHub
- Join our Discord community

## 🎉 You're All Set!

Your AI No-Code Builder is now running. Start building amazing applications!
