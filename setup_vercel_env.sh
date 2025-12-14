#!/bin/bash

# Vercel Environment Variables Setup Script
# Usage: ./setup_vercel_env.sh

echo "Adding environment variables to Vercel..."

# Supabase
vercel env add SUPABASE_URL production "https://your-project.supabase.co"
vercel env add SUPABASE_KEY production "your-anon-key"
vercel env add SUPABASE_SERVICE_ROLE_KEY production "your-service-role-key"
vercel env add JWT_SECRET production "your-secret-key"

# AI Keys
vercel env add OPENAI_API_KEY production "sk-proj-xxxxxxxx"
vercel env add GROQ_API_KEY production "gsk_xxxxxxxx"
vercel env add GOOGLE_API_KEY production "AIzaSyxxxxxxxx"
vercel env add STABILITY_API_KEY production "sk-xxxxxxxx"
vercel env add HUGGINGFACE_API_KEY production "hf_xxxxxxxx"
vercel env add ELEVENLABS_API_KEY production "sk_xxxxxxxx"
vercel env add DEEPGRAM_API_KEY production "xxxxxxxx"
vercel env add E2B_API_KEY production "e2b_xxxxxxxx"
vercel env add PLANT_ID_API_KEY production "xxxxxxxx"
vercel env add READY_PLAYER_ME_API_KEY production "sk_live_xxxxxxxx"
vercel env add KIE_AI_API_KEY production "xxxxxxxx"
vercel env add PINECONE_API_KEY production "pcsk_xxxxxxxx"
vercel env add MAGIC_HOUR_API_KEY production "mhk_live_xxxxxxxx"
vercel env add HUNYUAN3D_API_KEY production "xxxxxxxx"

echo "✅ All environment variables added!"
