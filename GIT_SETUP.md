# Git Setup Guide for Coolify Deployment

Before deploying to Coolify, you need to push your project to a Git repository (GitHub, GitLab, or Gitea). Coolify connects to these repositories to deploy your application.

## Step 1: Initialize Git Repository (if not already done)

If you haven't initialized Git yet, run these commands in your project directory:

```bash
# Initialize Git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Questmas MVP"
```

## Step 2: Create a Git Repository on a Hosting Service

Choose one of these platforms (Coolify supports all of them):

### Option A: GitHub (Most Common)

1. Go to [https://github.com](https://github.com)
2. Sign in or create an account
3. Click the **"+"** icon → **"New repository"**
4. Fill in the details:
   - **Repository name**: `questmas` (or your preferred name)
   - **Description**: "Captain's Quest - Questmas MVP"
   - **Visibility**: Choose **Private** (recommended) or **Public**
   - **DO NOT** initialize with README, .gitignore, or license (you already have these)
5. Click **"Create repository"**
6. GitHub will show you commands to push - **don't run them yet**, continue to Step 3

### Option B: GitLab

1. Go to [https://gitlab.com](https://gitlab.com)
2. Sign in or create an account
3. Click **"New project"** or **"Create blank project"**
4. Fill in the details:
   - **Project name**: `questmas`
   - **Visibility**: Choose **Private** or **Public**
5. Click **"Create project"**
6. GitLab will show you commands to push

### Option C: Gitea (Self-hosted)

1. Access your Gitea instance
2. Click **"New Repository"**
3. Fill in repository name and settings
4. Click **"Create Repository"**

## Step 3: Connect Local Repository to Remote

After creating the repository on your chosen platform, connect your local repository:

```bash
# Add remote repository (replace with your actual repository URL)
# For GitHub:
git remote add origin https://github.com/YOUR_USERNAME/questmas.git

# Or for GitLab:
git remote add origin https://gitlab.com/YOUR_USERNAME/questmas.git

# Or for Gitea:
git remote add origin https://your-gitea-instance.com/YOUR_USERNAME/questmas.git

# Verify remote was added
git remote -v
```

## Step 4: Push to Remote Repository

```bash
# Push to main branch (or master, depending on your default)
git branch -M main
git push -u origin main
```

**Note**: You may be prompted for authentication:
- **GitHub**: Use a Personal Access Token (not your password)
- **GitLab**: Use a Personal Access Token or your password
- **Gitea**: Use your username and password/token

### Creating a GitHub Personal Access Token

If using GitHub and prompted for credentials:

1. Go to GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Click **"Generate new token (classic)"**
3. Give it a name (e.g., "Coolify Deployment")
4. Select scopes: **repo** (full control of private repositories)
5. Click **"Generate token"**
6. **Copy the token immediately** (you won't see it again)
7. Use this token as your password when pushing

## Step 5: Verify Push

Check your repository on the hosting platform - you should see all your files there.

## Step 6: Important Files to Check

Before pushing, make sure these files are in your repository:

✅ **Required for deployment:**
- `Dockerfile` (for building the app)
- `package.json` (dependencies)
- `vite.config.ts` (build configuration)
- `src/` directory (source code)
- `supabase/migrations/` (database migrations - for reference)

✅ **Should be in repository:**
- `README.md`
- `COOLIFY_DEPLOYMENT.md` (deployment guide)
- Configuration files (`.gitignore`, `tsconfig.json`, etc.)

❌ **Should NOT be in repository** (already in `.gitignore`):
- `node_modules/`
- `.env` or `.env.local` (secrets)
- `dist/` (build output)
- IDE files

## Step 7: Connect Repository to Coolify

Once your code is on GitHub/GitLab/Gitea:

1. Log into Coolify
2. Go to **Applications** → **New Application**
3. Select your Git provider (GitHub, GitLab, or Gitea)
4. Authorize Coolify to access your repositories
5. Select the repository: `questmas` (or your repo name)
6. Select the branch: `main` (or `master`)
7. Continue with the deployment setup as described in `COOLIFY_DEPLOYMENT.md`

## Troubleshooting

### Issue: "Permission denied" when pushing

**Solutions**:
- Use a Personal Access Token instead of password (for GitHub/GitLab)
- Check that you have write access to the repository
- Verify the remote URL is correct

### Issue: "Repository not found"

**Solutions**:
- Check the repository name and URL are correct
- Ensure the repository exists on the hosting platform
- Verify you have access to the repository

### Issue: Large files or slow push

**Solutions**:
- Make sure `node_modules/` is in `.gitignore` (it should be)
- Don't commit `dist/` folder (already in `.gitignore`)
- If you have large files, consider using Git LFS

### Issue: Authentication fails

**Solutions**:
- For GitHub: Use Personal Access Token, not password
- For GitLab: Check token permissions
- Try using SSH instead of HTTPS (requires SSH key setup)

## Using SSH Instead of HTTPS (Optional)

If you prefer SSH authentication:

1. Generate an SSH key (if you don't have one):
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

2. Add the public key to your Git hosting service:
   - **GitHub**: Settings → SSH and GPG keys → New SSH key
   - **GitLab**: Preferences → SSH Keys
   - **Gitea**: Settings → SSH / GPG Keys

3. Change remote URL to SSH:
   ```bash
   git remote set-url origin git@github.com:YOUR_USERNAME/questmas.git
   ```

4. Test connection:
   ```bash
   ssh -T git@github.com
   ```

## Next Steps

After pushing to Git:

1. ✅ Verify all files are in the repository
2. ✅ Follow `COOLIFY_DEPLOYMENT.md` to set up Coolify
3. ✅ Connect Coolify to your Git repository
4. ✅ Configure environment variables
5. ✅ Deploy!

## Quick Reference Commands

```bash
# Initialize Git (if needed)
git init
git add .
git commit -m "Initial commit"

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/questmas.git

# Push
git branch -M main
git push -u origin main

# For future updates
git add .
git commit -m "Your commit message"
git push
```

