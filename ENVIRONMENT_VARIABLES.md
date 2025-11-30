# Environment Variables Reference

This document lists all environment variables required for the application. **These values must be set in Coolify during deployment and must NEVER be committed to git.**

## Required Variables

### Build-Time Variables

These variables are required during the Docker build process and will be embedded into the JavaScript bundle.

| Variable | Description | Example | Where to Get |
|----------|-------------|---------|--------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://xxxxxxxxxxxxx.supabase.co` | Supabase Dashboard → Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Supabase Dashboard → Settings → API → anon/public key |

## Setting Variables in Coolify

1. Navigate to your application in Coolify
2. Go to **Environment Variables** section
3. Click **Add Variable**
4. Enter the variable name (e.g., `VITE_SUPABASE_URL`)
5. Enter the variable value (your actual Supabase credentials)
6. Click **Save**
7. **Important**: After adding/changing variables, you must **rebuild** the application

## Security Notes

### ✅ Safe to Expose
- **VITE_SUPABASE_ANON_KEY**: This is the public/anonymous key designed to be used in client-side code. It's safe to embed in the JavaScript bundle because Supabase Row Level Security (RLS) protects your data.

### ❌ Never Expose
- **Service Role Key**: This key bypasses RLS and should NEVER be used in client-side code or exposed in the frontend. Only use it in server-side code (Supabase Edge Functions).

### 🔒 Best Practices
1. **Never commit actual values to git** - Only commit `.env.example` with placeholders
2. **Use different keys for different environments** - Development, staging, and production should each have their own Supabase project
3. **Rotate keys if compromised** - If you suspect a key has been exposed, rotate it immediately in Supabase dashboard
4. **Verify `.gitignore`** - Ensure `.env`, `.env.local`, `.env.production` are all ignored

## Verification

To verify your environment variables are set correctly:

1. **In Coolify**: Check the Environment Variables section shows your variables
2. **After Build**: Check browser console - the app should connect to Supabase without errors
3. **In Code**: The app validates these variables on startup (see `src/lib/supabase.ts`)

## Example Configuration

### Development (Local)
Create `.env.local` (not committed to git):
```env
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Production (Coolify)
Set in Coolify Environment Variables:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here
```

## Troubleshooting

### "Missing Supabase environment variables" Error
- **Cause**: Variables not set or not passed to build stage
- **Solution**: 
  1. Verify variables are set in Coolify
  2. Ensure variables start with `VITE_` prefix
  3. Rebuild the application after setting variables
  4. Check Coolify build logs to verify variables are being passed

### Supabase Connection Errors
- **Cause**: Incorrect URL or key
- **Solution**:
  1. Verify URL format: `https://[project-ref].supabase.co`
  2. Verify anon key is correct (copy from Supabase dashboard)
  3. Check Supabase project is active (not paused)
  4. Verify CORS is configured in Supabase dashboard

---

**Remember**: These are secrets! Never commit them to git. Always set them in Coolify's environment variables section.

