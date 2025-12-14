# Push to GitHub

Since you don't have the GitHub CLI (`gh`) installed, follow these steps to push your code to GitHub:

1.  **Create a Repository**:
    *   Go to [github.com/new](https://github.com/new).
    *   Name it `ai-builder-project` (or any name you like).
    *   Make it **Public** or **Private**.
    *   Do **not** initialize with README, .gitignore, or License (we already have them).
    *   Click **Create repository**.

2.  **Push Code**:
    Copy the commands shown on GitHub under "…or push an existing repository from the command line", which look like this:

    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/ai-builder-project.git
    git branch -M main
    git push -u origin main
    ```

    Replace `YOUR_USERNAME` with your actual GitHub username.

3.  **Connect Vercel to GitHub** (Optional but Recommended):
    *   Go to your Vercel Project Dashboard.
    *   Go to **Settings** -> **Git**.
    *   Click **Connect Git Repository**.
    *   Select the repository you just created.
    *   This enables **automatic deployments** whenever you push to GitHub!
