# 🚀 Easy Deployment Guide

## Option 1: Railway (Recommended - Easiest)

1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"**
3. Select **"Deploy from GitHub repo"**
4. Connect your GitHub and select this repository
5. Railway will auto-detect and deploy!

**Add Environment Variables:**
In Railway dashboard → Variables → Add these:
- `SUPABASE_URL` = `https://lwanzqvzxgxsfmqtsbfg.supabase.co`
- `SUPABASE_KEY` = (your anon key from backend/.env)
- `SUPABASE_SERVICE_ROLE_KEY` = (your service role key)
- `JWT_SECRET` = `super-secret-jwt-key-change-this`
- `OPENAI_API_KEY` = (your key)
- `GROQ_API_KEY` = (your key)
- `NODE_ENV` = `production`

---

## Option 2: Render (Also Easy)

1. Go to [render.com](https://render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub and select this repo
4. Settings:
   - **Build Command:** `npm run build`
   - **Start Command:** `npm run start`
5. Add environment variables (same as above)
6. Click **Deploy**

---

## Option 3: Run Locally with Ngrok (Quick Test)

If you just want to share your local app publicly:

```bash
# Terminal 1: Run backend
cd backend && npm run dev

# Terminal 2: Run frontend
cd frontend && npm run dev

# Terminal 3: Expose with ngrok
npx ngrok http 5173
```

This gives you a public URL instantly!

---

## Quick Push to GitHub

```bash
cd /Users/priyanshuchoudhary/Downloads/lovable/ai-builder-project
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/YOUR_USERNAME/ai-builder.git
git push -u origin main
```

Then connect that repo to Railway or Render.
