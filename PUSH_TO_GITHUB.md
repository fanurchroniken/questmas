# Push to GitHub - Quick Guide

## Step 1: Create GitHub Repository

1. Go to [https://github.com/new](https://github.com/new)
2. **Repository name**: `questmas` (or your preferred name)
3. **Description**: "Captain's Quest - Questmas MVP"
4. **Visibility**: Choose **Private** (recommended) or **Public**
5. **IMPORTANT**: Do NOT check any of these:
   - ❌ Add a README file
   - ❌ Add .gitignore
   - ❌ Choose a license
   
   (You already have these files!)
6. Click **"Create repository"**

## Step 2: Copy the Repository URL

After creating the repository, GitHub will show you a page with setup instructions. 

**Copy the HTTPS URL** - it will look like:
```
https://github.com/YOUR_USERNAME/questmas.git
```

## Step 3: Run These Commands

Once you have the repository URL, I'll help you run these commands:

```bash
# Add GitHub as remote (replace with your actual URL)
git remote add origin https://github.com/YOUR_USERNAME/questmas.git

# Push to GitHub
git push -u origin main
```

## Step 4: Authentication

When you run `git push`, you'll be prompted for credentials:

### Option A: Personal Access Token (Recommended)

1. Go to GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Click **"Generate new token (classic)"**
3. Give it a name: "Questmas Deployment"
4. Select scope: **repo** (full control of private repositories)
5. Click **"Generate token"**
6. **Copy the token immediately** (you won't see it again!)
7. When prompted for password during `git push`, paste the token

### Option B: GitHub CLI (Alternative)

If you have GitHub CLI installed:
```bash
gh auth login
git push -u origin main
```

## Troubleshooting

### "Repository not found"
- Check the URL is correct
- Verify you have access to the repository
- Make sure the repository exists on GitHub

### "Authentication failed"
- Use a Personal Access Token, not your password
- Make sure the token has `repo` scope
- Check the token hasn't expired

### "Permission denied"
- Verify you're the owner or have write access
- Check your GitHub username is correct in the URL

