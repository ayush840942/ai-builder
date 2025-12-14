# Vercel Environment Variables Setup

These variables are required for the AI Builder to function correctly.

1.  Go to your Vercel Project Dashboard.
2.  Navigate to **Settings** > **Environment Variables**.
3.  Add the following variables (copy and paste):

| Name | Value |
|------|-------|
| `SUPABASE_URL` | https://your-project.supabase.co |
| `SUPABASE_KEY` | your-anon-key |
| `SUPABASE_SERVICE_ROLE_KEY` | your-service-role-key |
| `JWT_SECRET` | your-secret-jwt-key |
| `OPENAI_API_KEY` | sk-proj-xxxxxxxx |
| `GROQ_API_KEY` | gsk_xxxxxxxx |
| `GOOGLE_API_KEY` | AIzaSyxxxxxxxx |
| `STABILITY_API_KEY` | sk-xxxxxxxx |
| `HUGGINGFACE_API_KEY` | hf_xxxxxxxx |
| `ELEVENLABS_API_KEY` | sk_xxxxxxxx |
| `DEEPGRAM_API_KEY` | xxxxxxxx |
| `E2B_API_KEY` | e2b_xxxxxxxx |
| `PLANT_ID_API_KEY` | xxxxxxxx |
| `READY_PLAYER_ME_API_KEY` | sk_live_xxxxxxxx |
| `KIE_AI_API_KEY` | xxxxxxxx |
| `PINECONE_API_KEY` | pcsk_xxxxxxxx |
| `MAGIC_HOUR_API_KEY` | mhk_live_xxxxxxxx |
| `HUNYUAN3D_API_KEY` | xxxxxxxx |

4.  **Redeploy**: Go to **Deployments**, click the three dots on the latest deployment, and select **Redeploy**.
