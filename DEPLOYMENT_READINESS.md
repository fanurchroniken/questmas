# Deployment Readiness Checklist

This document verifies that your project is ready for deployment to Coolify on Contabo and that all secrets are properly secured.

## ✅ Security Verification

### Secrets Management
- [x] **No hardcoded secrets in source code** - All secrets use environment variables
- [x] **`.env` files are in `.gitignore`** - Verified: `.env`, `.env.local`, `.env.production` are ignored
- [x] **`.env.example` exists** - Contains only placeholder values, safe to commit
- [x] **No secrets in git history** - Verified: No actual secrets found in commit history
- [x] **Environment variables properly referenced** - Code uses `import.meta.env.VITE_*` pattern

### Code Security Review
- ✅ `src/lib/supabase.ts` correctly uses `import.meta.env.VITE_SUPABASE_URL` and `import.meta.env.VITE_SUPABASE_ANON_KEY`
- ✅ No hardcoded API keys, URLs, or credentials found in source code
- ✅ All Supabase references in documentation use placeholder values (`xxxxxxxxxxxxx`, `eyJhbGci...`)

## 📋 Required Environment Variables

These variables **MUST** be set in Coolify during deployment. They are **NOT** committed to git.

### Build-Time Variables (Required for Docker Build)

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**Important Notes:**
- These are **build-time** variables that get embedded into the JavaScript bundle during Docker build
- They must be set in Coolify's **Environment Variables** section before building
- The Dockerfile accepts these as `ARG` and converts them to `ENV` for the build process
- After setting/changing these variables, you **must rebuild** the application

### How to Get These Values

1. Go to your Supabase Dashboard
2. Navigate to **Settings** → **API**
3. Copy:
   - **Project URL** → Use for `VITE_SUPABASE_URL`
   - **anon/public key** → Use for `VITE_SUPABASE_ANON_KEY`

⚠️ **Never commit these actual values to git!**

## 🐳 Docker Configuration

### Dockerfile Status
- ✅ Multi-stage build configured (builder + production)
- ✅ Build arguments properly defined (`ARG VITE_SUPABASE_URL`, `ARG VITE_SUPABASE_ANON_KEY`)
- ✅ Environment variables set for build stage
- ✅ Nginx configured for SPA routing (handles client-side routing)
- ✅ Port 80 exposed (standard for Coolify)

### Build Process
1. **Builder stage**: Installs dependencies and builds React app with Vite
2. **Production stage**: Serves static files with nginx
3. Environment variables are injected at build time (not runtime)

## 📦 Pre-Deployment Checklist

### Before Deploying to Coolify

- [ ] **Supabase Project Ready**
  - [ ] Supabase project created (cloud or self-hosted)
  - [ ] Database migrations run (see `supabase/migrations/`)
  - [ ] Storage buckets configured (if using photo uploads)
  - [ ] CORS configured in Supabase dashboard (add your domain)
  - [ ] RLS policies verified

- [ ] **Git Repository**
  - [ ] Code pushed to GitHub/GitLab/Gitea
  - [ ] No `.env` files committed (verify with `git ls-files | grep env`)
  - [ ] `.env.example` exists and is committed (for documentation)
  - [ ] All secrets removed from git history (if any were ever committed)

- [ ] **Coolify Configuration**
  - [ ] Coolify instance running and accessible
  - [ ] Git repository connected to Coolify
  - [ ] Application created in Coolify
  - [ ] Environment variables set in Coolify (NOT in git)
  - [ ] Domain configured (optional but recommended)
  - [ ] SSL/TLS enabled (if using custom domain)

- [ ] **Build Configuration**
  - [ ] Dockerfile path correct (`./Dockerfile`)
  - [ ] Port set to `80`
  - [ ] Build arguments enabled in Coolify settings
  - [ ] Environment variables passed to build stage

## 🚀 Deployment Steps

1. **Set Environment Variables in Coolify**
   - Go to your application in Coolify
   - Navigate to **Environment Variables**
   - Add:
     - `VITE_SUPABASE_URL` = Your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY` = Your Supabase anon key
   - **Save** the variables

2. **Deploy**
   - Click **Deploy** in Coolify
   - Monitor build logs
   - Verify build completes successfully

3. **Verify Deployment**
   - Check application is running
   - Test homepage loads
   - Test authentication (sign up/login)
   - Test core functionality
   - Check browser console for errors

## 🔒 Security Best Practices

### ✅ What's Safe to Commit
- `.env.example` (with placeholder values)
- Documentation files
- Source code (without hardcoded secrets)
- Configuration files (without actual credentials)

### ❌ What's NEVER Committed
- `.env` files (any variant: `.env`, `.env.local`, `.env.production`)
- Actual API keys or secrets
- Database passwords
- Service role keys (Supabase)
- Any file containing real credentials

### 🔍 How to Verify No Secrets Are Committed

```bash
# Check if any .env files are tracked
git ls-files | grep -i env

# Should only show .env.example, nothing else

# Search for potential secrets in code
grep -r "https://.*\.supabase\.co" src/ --exclude-dir=node_modules
# Should only show documentation or example values

# Check git history for secrets (if concerned)
git log --all --full-history --source -- "*env*" "*secret*"
```

## 🐛 Troubleshooting

### Issue: Build fails with "Missing Supabase environment variables"
**Solution**: 
- Verify environment variables are set in Coolify
- Check that variables start with `VITE_` (required for Vite)
- Ensure Coolify passes variables to build stage
- Rebuild after adding/changing variables

### Issue: App loads but shows Supabase connection errors
**Solution**:
- Verify Supabase URL and anon key are correct
- Check Supabase project is active (not paused)
- Verify CORS is configured in Supabase dashboard
- Check browser console for specific error messages

### Issue: 404 errors on direct URL access
**Solution**:
- This is normal for SPAs - nginx config handles this
- Verify nginx config in Dockerfile includes `try_files $uri $uri/ /index.html;`

## 📝 Post-Deployment

After successful deployment:

1. **Test all functionality**
   - User authentication
   - Quest creation
   - Quest participation
   - Photo uploads (if applicable)

2. **Monitor logs**
   - Check Coolify logs for errors
   - Check Supabase logs for API issues
   - Monitor browser console

3. **Set up monitoring** (optional)
   - Configure uptime monitoring
   - Set up error tracking (if using Sentry)
   - Monitor Supabase usage

## ✅ Final Verification

Before considering deployment complete:

- [ ] Application accessible via URL
- [ ] No console errors in browser
- [ ] Authentication works (sign up/login)
- [ ] Core features functional
- [ ] No secrets visible in built JavaScript (check browser DevTools → Sources)
- [ ] SSL certificate valid (if using HTTPS)
- [ ] Database migrations applied
- [ ] Storage configured (if needed)

## 📚 Additional Resources

- [Coolify Deployment Guide](./COOLIFY_DEPLOYMENT.md) - Detailed deployment instructions
- [Supabase Setup Guide](./SUPABASE_SETUP.md) - Supabase configuration
- [Project Architecture](./Project%20Requirement%20Documentation%23/architecture.md) - System architecture

---

**Last Verified**: All checks passed ✅
**Status**: Ready for deployment to Coolify

