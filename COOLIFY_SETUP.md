# Coolify Deployment Setup Guide

This guide provides step-by-step instructions for deploying to Coolify, including how to configure environment variables.

## Prerequisites

- Coolify instance running and accessible
- Supabase project created and configured
- Git repository pushed to GitHub/GitLab/Gitea

## Step 1: Create Application in Coolify

1. Log into your Coolify dashboard
2. Navigate to **Applications** → **New Application**
3. Choose **Dockerfile** as the deployment type
4. Connect your Git repository:
   - Select your Git provider (GitHub, GitLab, Gitea)
   - Authorize Coolify to access your repository
   - Select the repository: `questmas` (or your repo name)
   - Select the branch: `main` (or your production branch)

## Step 2: Configure Build Settings

1. In your application settings, go to **Build Pack** or **Build Configuration**
2. Verify:
   - **Dockerfile Path**: `./Dockerfile` (should be auto-detected)
   - **Port**: `80` (nginx default port)
   - **Build Command**: (leave empty, Dockerfile handles this)

## Step 3: Set Environment Variables (CRITICAL)

⚠️ **This is the most important step!** Without these variables, the build will fail or the app won't work.

### Option A: Using Coolify's Environment Variables UI (Recommended)

1. In your Coolify application, go to **Environment Variables** section
2. Click **Add Variable** or **+** button
3. Add the following variables one by one:

   **Variable 1:**
   - **Key**: `VITE_SUPABASE_URL`
   - **Value**: `https://your-project-id.supabase.co` (your actual Supabase URL)
   - **Build Time**: ✅ **ENABLED** (This is critical!)
   - **Runtime**: Can be disabled (not needed after build)

   **Variable 2:**
   - **Key**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: `your_actual_anon_key_here` (your actual Supabase anon key)
   - **Build Time**: ✅ **ENABLED** (This is critical!)
   - **Runtime**: Can be disabled (not needed after build)

4. **Important**: Make sure "Build Time" is enabled for both variables!
   - In Coolify, environment variables can be marked as "Build Time" or "Runtime"
   - Vite needs these at **build time** because they get embedded into the JavaScript bundle
   - If "Build Time" is not available, the variables should still be passed to the build stage

### Option B: Using Coolify's Build Arguments

If Coolify has a "Build Arguments" section:

1. Go to **Build Arguments** or **Docker Build Args**
2. Add:
   - `VITE_SUPABASE_URL=https://your-project-id.supabase.co`
   - `VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here`

### How to Get Your Supabase Credentials

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → Use for `VITE_SUPABASE_URL`
   - **anon/public key** → Use for `VITE_SUPABASE_ANON_KEY`

## Step 4: Deploy

1. Click **Deploy** or **Redeploy** in Coolify
2. Monitor the build logs
3. Look for:
   - ✅ "Environment variables set for build" (if using build script)
   - ✅ "Building application..."
   - ✅ "Build completed successfully"
   - ❌ If you see "ERROR: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set!", the environment variables weren't passed correctly

## Step 5: Verify Deployment

### Check Build Logs

After deployment, check the build logs for:
- No errors about missing environment variables
- Successful build completion
- Container started successfully

### Check Application

1. In Coolify, find your application's URL (or configure a domain)
2. Visit the URL in your browser
3. Open browser DevTools (F12) → Console tab
4. Check for errors:
   - ❌ "Missing Supabase environment variables" → Environment variables not set correctly
   - ❌ CORS errors → Need to configure CORS in Supabase dashboard
   - ❌ Network errors → Check Supabase project is active

### Test Functionality

1. **Homepage**: Should load without errors
2. **Sign Up/Login**: Should work (tests Supabase connection)
3. **Create Quest**: Should save to Supabase

## Troubleshooting

### Issue: Build Succeeds But Website Shows Blank/Error

**Symptoms**: Build completes, but visiting the site shows blank page or "Missing Supabase environment variables" error

**Cause**: Environment variables weren't passed to the build stage

**Solutions**:
1. Verify environment variables are set in Coolify
2. **Check "Build Time" is enabled** for the variables
3. Check build logs for the error message
4. Try setting variables in "Build Arguments" section if available
5. Rebuild the application after setting variables

### Issue: "ERROR: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set!"

**Cause**: Environment variables not available during Docker build

**Solutions**:
1. Go to Coolify → Your Application → Environment Variables
2. Verify both variables are set
3. **Enable "Build Time" option** for both variables
4. If "Build Time" option doesn't exist, check Coolify documentation for your version
5. Rebuild the application

### Issue: Build Fails Immediately

**Symptoms**: Build fails right away with exit code 1

**Solutions**:
1. Check build logs for specific error
2. Verify Dockerfile syntax is correct
3. Check that all files are committed to git
4. Verify Node.js version compatibility

### Issue: CORS Errors in Browser

**Symptoms**: Browser console shows CORS errors when trying to connect to Supabase

**Solutions**:
1. Go to Supabase Dashboard → Settings → API
2. Add your domain to **Allowed CORS origins**:
   - `https://your-domain.com`
   - `https://www.your-domain.com`
   - Or use `*` for development (not recommended for production)
3. Save changes
4. Clear browser cache and reload

### Issue: 404 Errors on Direct URL Access

**Symptoms**: Direct URL access or page refresh shows 404

**Solutions**:
- This is normal for SPAs - the Dockerfile includes nginx config to handle this
- If it's not working, verify nginx configuration in Dockerfile

## Coolify-Specific Notes

### Environment Variable Passing

Coolify versions may handle environment variables differently:

- **Coolify v3+**: Usually has "Build Time" toggle for environment variables
- **Coolify v2**: May need to use "Build Arguments" section
- **Some versions**: Environment variables are automatically passed to build stage

If you're unsure:
1. Check Coolify documentation for your version
2. Try setting variables in both "Environment Variables" and "Build Arguments"
3. Check build logs to see if variables are being passed

### Automatic Deployments

Coolify can auto-deploy on git push:
1. Go to application settings
2. Enable "Auto Deploy" or "Webhook"
3. Configure the branch (usually `main`)
4. Every push to that branch will trigger a new deployment

## Post-Deployment Checklist

- [ ] Application accessible via URL
- [ ] No console errors in browser
- [ ] Authentication works (sign up/login)
- [ ] Can create quests
- [ ] Can view quests
- [ ] Database migrations applied in Supabase
- [ ] CORS configured in Supabase
- [ ] SSL certificate valid (if using custom domain)

## Additional Resources

- [Coolify Documentation](https://coolify.io/docs)
- [Supabase Setup Guide](./SUPABASE_SETUP.md)
- [Deployment Readiness Checklist](./DEPLOYMENT_READINESS.md)

