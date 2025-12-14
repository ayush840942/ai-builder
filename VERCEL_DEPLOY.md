# Deploying AI Builder to Vercel

This project is configured as a monorepo for easy deployment on Vercel.

## Prerequisites

1.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com).
2.  **Vercel CLI** (Optional): Install with `npm i -g vercel`.
3.  **GitHub Repository**: Push this project to a GitHub repository.

## Deployment Steps

### Option 1: Using Vercel Dashboard (Recommended)

1.  **Push to GitHub**:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    # Add your remote
    git remote add origin <your-repo-url>
    git push -u origin main
    ```

2.  **Import Project**:
    *   Go to Vercel Dashboard -> **Add New** -> **Project**.
    *   Select your GitHub repository.

3.  **Configure Project**:
    *   **Framework Preset**: Select **Vite**.
    *   **Root Directory**: Leave as `./` (root).
    *   **Build Command**: `npm run build` (This runs the root build script which builds the frontend).
    *   **Output Directory**: `frontend/dist`.
    *   **Install Command**: `npm install` (This installs dependencies for both frontend and backend).

4.  **Environment Variables**:
    Add the following environment variables in the Vercel dashboard:

    *   `VITE_API_URL`: `/` (or leave empty)
    *   `OPENAI_API_KEY`: Your OpenAI Key
    *   `SUPABASE_URL`: Your Supabase URL
    *   `SUPABASE_KEY`: Your Supabase Key
    *   `GROQ_API_KEY`: Your Groq Key
    *   `STABILITY_API_KEY`: Your Stability AI Key
    *   `ELEVENLABS_API_KEY`: Your ElevenLabs Key
    *   `DEEPGRAM_API_KEY`: Your Deepgram Key
    *   `JWT_SECRET`: A secure random string

5.  **Deploy**: Click **Deploy**.

### Option 2: Using Vercel CLI

1.  Run `vercel` in the root directory.
2.  Follow the prompts.
3.  When asked for build settings, use:
    *   Build Command: `npm run build`
    *   Output Directory: `frontend/dist`
    *   Install Command: `npm install`

## How it Works

*   **Frontend**: Built using Vite and served as static files.
*   **Backend**: The `api/index.ts` file acts as the entry point for Vercel Serverless Functions. Requests to `/api/*` are rewritten to this function.
*   **Monorepo**: The root `package.json` manages dependencies for both.

## Troubleshooting

*   **Database Connection**: Ensure your Supabase database allows connections from anywhere (0.0.0.0/0) or Vercel's IP range.
*   **Cold Starts**: The first request might take a few seconds as the serverless function wakes up.
