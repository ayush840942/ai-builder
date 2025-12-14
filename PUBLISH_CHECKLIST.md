# 🚀 Publishing Checklist

Your app is deployed! Here are the final steps to make it fully functional for the public.

## 1. 🔑 Set Environment Variables (CRITICAL)
Your app needs API keys to work. Go to your [Vercel Dashboard](https://vercel.com/dashboard), select your project, then **Settings** -> **Environment Variables**.

Add these keys (copy from your local `.env`):
- `OPENAI_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_KEY`
- `GROQ_API_KEY`
- `STABILITY_API_KEY`
- `ELEVENLABS_API_KEY`
- `DEEPGRAM_API_KEY`
- `JWT_SECRET`

**Redeploy** after adding variables (go to Deployments -> Redeploy) for them to take effect.

## 2. 🌐 Custom Domain (Optional)
To use your own domain (e.g., `myapp.com`):
1.  Go to **Settings** -> **Domains**.
2.  Enter your domain.
3.  Follow the DNS configuration instructions provided by Vercel.

## 3. 🐙 Push to GitHub
Ensure your code is safe and enables automatic deployments:
```bash
git remote add origin https://github.com/YOUR_USERNAME/ai-builder-project.git
git branch -M main
git push -u origin main
```

## 4. 📢 Share!
Your public URL is:
`https://ai-builder-project.vercel.app`
(Check your dashboard for the exact link)
