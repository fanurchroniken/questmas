# Coolify Deployment Guide

This guide will help you deploy Captain's Quest - Questmas MVP to Coolify on a Supabase server.

> **Note**: This application uses **Supabase** (not Contabase) as the backend service. Supabase provides PostgreSQL database, authentication, and storage services.

## Quick Start Checklist

- [ ] Supabase project created and configured
- [ ] Database migrations run on Supabase
- [ ] Supabase credentials obtained (URL and anon key)
- [ ] Coolify instance running and accessible
- [ ] Git repository connected to Coolify
- [ ] Environment variables configured in Coolify
- [ ] Application deployed and running
- [ ] Domain configured (optional)
- [ ] SSL certificate enabled (if using custom domain)

## Prerequisites

Before deploying, ensure you have:

1. **Coolify instance** installed and running on your server
2. **Supabase project** set up (cloud or self-hosted)
   - Project URL
   - Anon/public API key
   - Database migrations ready to run
3. **Git repository** with your code (GitHub, GitLab, or Gitea)
4. **Domain name** (optional, but recommended for production)

## Overview

Your application is a **static React frontend** that connects to Supabase. The deployment process involves:

1. Building the React app (Vite)
2. Serving static files with nginx
3. Configuring environment variables
4. Running database migrations on Supabase

## Step 1: Prepare Your Supabase Project

### 1.1 Create/Configure Supabase Project

If you haven't already:

1. Go to [https://supabase.com](https://supabase.com) and create a project
2. Or set up a self-hosted Supabase instance
3. Get your credentials from **Settings → API**:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 1.2 Run Database Migrations

**Important**: Run these migrations on your Supabase instance **before** deploying the frontend.

You have two options:

#### Option A: Using Supabase Dashboard (Easiest)

1. Go to **SQL Editor** in your Supabase dashboard
2. Run each migration file in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`
   - `supabase/migrations/003_indexes.sql`
   - `supabase/migrations/004_add_photo_support.sql`
3. Copy the contents of each file
4. Paste into the SQL Editor
5. Click "Run" for each migration
6. Verify each migration ran successfully

#### Option B: Using Supabase CLI

```bash
# Install Supabase CLI (if not already installed)
# macOS
brew install supabase/tap/supabase

# Windows (using Scoop)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref
# (Find your project ref in Settings → General → Reference ID)

# Push migrations
supabase db push
```

## Step 2: Configure Coolify Application

### 2.1 Create New Application in Coolify

1. Log into your Coolify dashboard
2. Navigate to **Applications** → **New Application**
3. Choose **Docker Compose** or **Dockerfile** deployment type
4. Connect your Git repository:
   - Select your Git provider (GitHub, GitLab, Gitea)
   - Authorize Coolify to access your repository
   - Select the repository: `Questmas` (or your repo name)
   - Select the branch: `main` (or your production branch)

### 2.2 Configure Build Settings

Coolify should automatically detect your `Dockerfile`. Verify these settings:

- **Build Pack**: Dockerfile
- **Dockerfile Path**: `./Dockerfile` (root of repository)
- **Build Command**: (auto-detected from Dockerfile)
- **Port**: `80` (nginx default port)

**Note**: The Dockerfile uses a multi-stage build:
1. **Builder stage**: Installs dependencies and builds the React app with Vite
2. **Production stage**: Serves the built static files with nginx

### 2.3 Set Environment Variables

⚠️ **CRITICAL**: These environment variables contain **SECRETS** and must **NEVER** be committed to git!

In Coolify, go to your application's **Environment Variables** section and add:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important Notes**:
- These variables are **build-time** variables for Vite
- They will be embedded in the built JavaScript bundle during the Docker build
- The Dockerfile is configured to accept these as build arguments
- Make sure these are the **production** Supabase credentials
- **NEVER commit these values to your repository** - They must only be set in Coolify
- Verify `.env` files are in `.gitignore` (they should be)
- Use actual values from your Supabase dashboard, not the placeholders above

**Coolify Configuration**:
- Coolify should automatically pass environment variables to the Docker build
- If variables aren't being picked up, check Coolify's build settings
- You may need to ensure "Build Arguments" or "Environment Variables" are enabled for the build stage
- After adding/changing environment variables, you must **rebuild** the application

### 2.4 Configure Domain (Optional)

1. In Coolify, go to **Domains** section
2. Add your custom domain (e.g., `questmas.yourdomain.com`)
3. Configure DNS records as instructed by Coolify:
   - Add an A record pointing to your server's IP
   - Or add a CNAME record if using a subdomain
4. Enable SSL/TLS (Coolify can automatically provision Let's Encrypt certificates)

## Step 3: Deploy

### 3.1 Initial Deployment

1. Click **Deploy** in Coolify
2. Coolify will:
   - Clone your repository
   - Build the Docker image using your Dockerfile
   - Start the container
   - Expose the application on the configured port

### 3.2 Monitor Deployment

Watch the build logs in Coolify to ensure:
- Dependencies install successfully
- Build completes without errors
- Container starts correctly

Expected build output:
```
✓ Building...
✓ Installing dependencies...
✓ Building application...
✓ Starting nginx...
```

## Step 4: Verify Deployment

### 4.1 Check Application Status

1. In Coolify, verify the application shows as **Running**
2. Check the logs for any errors
3. Visit your application URL (Coolify-provided or custom domain)

### 4.2 Test Core Functionality

1. **Homepage**: Should load without errors
2. **Authentication**: 
   - Try signing up a new account
   - Verify email confirmation works (if enabled)
   - Try logging in
3. **Quest Creation**:
   - Create a test quest
   - Verify it saves to Supabase
4. **Quest Participation**:
   - Share a quest link
   - Test the participant flow

### 4.3 Check Browser Console

Open browser DevTools (F12) and check:
- No console errors
- Network requests to Supabase succeed
- Environment variables are correctly loaded

## Step 5: Post-Deployment Configuration

### 5.1 Configure Supabase Storage (if using photos)

If your app uses photo uploads:

1. Go to Supabase Dashboard → **Storage**
2. Create a bucket (e.g., `quest-photos`)
3. Configure bucket policies:
   - Public read access (if photos should be publicly viewable)
   - Authenticated write access (for uploads)
4. Update RLS policies if needed

### 5.2 Set Up Email Templates (Optional)

If using Supabase Auth email features:

1. Go to **Authentication** → **Email Templates**
2. Customize email templates for:
   - Sign up confirmation
   - Password reset
   - Magic link

### 5.3 Configure CORS (if needed)

If you encounter CORS errors:

1. Go to Supabase Dashboard → **Settings** → **API**
2. Add your domain to **Allowed CORS origins**:
   - `https://yourdomain.com`
   - `https://www.yourdomain.com`

## Troubleshooting

### Issue: Build Fails

**Symptoms**: Build logs show errors

**Solutions**:
- Check that all dependencies in `package.json` are valid
- Verify Node.js version in Dockerfile matches requirements (Node 20)
- Check build logs for specific error messages
- Ensure `.gitignore` isn't excluding necessary files

### Issue: "Missing Supabase environment variables"

**Symptoms**: App loads but shows error about missing env vars

**Solutions**:
- Verify environment variables are set in Coolify
- Check that variable names start with `VITE_` (required for Vite)
- **Important**: Environment variables must be available during the **build stage**, not just runtime
- Rebuild the application after adding/changing environment variables
- In Coolify, check that environment variables are passed as build arguments
- If Coolify doesn't automatically pass env vars to build, you may need to:
  1. Check Coolify's build settings for "Build Arguments" option
  2. Or use a build script that reads from environment and creates a `.env` file before build
  3. Or configure Coolify to use build arguments explicitly

### Issue: Database Connection Errors

**Symptoms**: API calls to Supabase fail

**Solutions**:
- Verify Supabase URL and anon key are correct
- Check Supabase project is active (not paused)
- Verify migrations ran successfully
- Check Supabase logs in dashboard

### Issue: 404 Errors on Routes

**Symptoms**: Direct URL access or refresh shows 404

**Solutions**:
- This is expected for SPAs - the Dockerfile includes nginx config for SPA routing
- Verify the nginx configuration in Dockerfile is correct
- Check that `try_files $uri $uri/ /index.html;` is in nginx config

### Issue: Photos Not Uploading

**Symptoms**: Photo upload fails

**Solutions**:
- Verify Supabase Storage bucket exists
- Check bucket policies allow uploads
- Verify RLS policies are correct
- Check browser console for specific error messages

### Issue: SSL Certificate Issues

**Symptoms**: HTTPS not working or certificate errors

**Solutions**:
- In Coolify, check SSL/TLS settings
- Verify DNS records are correct
- Wait for Let's Encrypt certificate provisioning (can take a few minutes)
- Check domain is properly configured in Coolify

## Continuous Deployment

Coolify supports automatic deployments:

1. **Auto Deploy on Push**: Enable in Coolify settings
   - Deploys automatically when you push to the configured branch
2. **Manual Deploy**: Deploy on-demand from Coolify dashboard
3. **Preview Deployments**: Set up separate applications for staging/development

## Environment-Specific Deployments

For multiple environments (staging, production):

1. Create separate Supabase projects for each environment
2. Create separate Coolify applications
3. Use different environment variables for each
4. Use different branches or tags for deployments

## Security Best Practices

1. **Never commit secrets**: 
   - Keep `.env` files in `.gitignore` ✅ (verified)
   - Only `.env.example` should be in git (with placeholder values)
   - All actual secrets must be set in Coolify, not in git
   - Verify no secrets in git history: `git log --all --source -- "*env*" "*secret*"`

2. **Use production Supabase keys**: Don't use development keys in production

3. **Enable RLS**: Ensure Row Level Security is enabled on all Supabase tables

4. **Regular updates**: Keep dependencies updated for security patches

5. **Monitor logs**: Regularly check Coolify and Supabase logs for issues

6. **Verify secrets are not exposed**:
   - Check that environment variables are only set in Coolify dashboard
   - Never hardcode secrets in source code
   - Review built JavaScript bundle to ensure no secrets are visible (they will be embedded, but should only be the anon key which is safe for client-side)

## Monitoring & Maintenance

### Regular Checks

- Monitor application uptime in Coolify
- Check Supabase usage (database size, API calls, storage)
- Review error logs weekly
- Monitor SSL certificate expiration

### Updates

To update your application:

1. Push changes to your Git repository
2. Coolify will detect changes (if auto-deploy enabled)
3. Or manually trigger deployment in Coolify
4. Monitor build and deployment logs

## Additional Resources

- [Coolify Documentation](https://coolify.io/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Nginx Configuration](https://nginx.org/en/docs/)

## Support

If you encounter issues:

1. Check Coolify logs
2. Check Supabase logs
3. Check browser console
4. Review this guide's troubleshooting section
5. Check project documentation in `Project Requirement Documentation#/`

