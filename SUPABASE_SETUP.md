# Supabase Setup Guide

This guide will help you set up your Supabase project for Captain's Quest - Questmas MVP.

## Option 1: Using Supabase Cloud (Recommended for MVP)

### Step 1: Create Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" or "Sign up"
3. Sign up with GitHub, Google, or email
4. Verify your email if required

### Step 2: Create a New Project

1. Click "New Project" in your Supabase dashboard
2. Fill in the project details:
   - **Name**: `captains-quest` (or your preferred name)
   - **Database Password**: Create a strong password (save this securely!)
   - **Region**: Choose the closest region to your users
   - **Pricing Plan**: Free tier is fine for MVP
3. Click "Create new project"
4. Wait 2-3 minutes for the project to be provisioned

### Step 3: Get Your Project Credentials

1. Once your project is ready, go to **Settings** → **API**
2. You'll find:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key**: (Keep this secret! Only for server-side use)

### Step 4: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Step 5: Run Database Migrations

You have two options:

#### Option A: Using Supabase Dashboard (Easiest)

1. Go to **SQL Editor** in your Supabase dashboard
2. Open each migration file in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`
   - `supabase/migrations/003_indexes.sql`
3. Copy the contents of each file
4. Paste into the SQL Editor
5. Click "Run" for each migration
6. Verify each migration ran successfully

#### Option B: Using Supabase CLI (Recommended for Development)

1. Install Supabase CLI:
   ```bash
   # macOS
   brew install supabase/tap/supabase
   
   # Windows (using Scoop)
   scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
   scoop install supabase
   
   # Or download from: https://github.com/supabase/cli/releases
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Link your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```
   (Find your project ref in Settings → General → Reference ID)

4. Push migrations:
   ```bash
   supabase db push
   ```

### Step 6: Verify Setup

1. In Supabase dashboard, go to **Table Editor**
2. You should see these tables:
   - `organizations`
   - `user_profiles`
   - `quests`
   - `calendar_configs`
   - `chapters`
   - `tasks`
   - `quest_participants`
   - `task_completions`
   - `quest_themes`

3. Test your connection:
   ```bash
   npm run dev
   ```
   Visit `http://localhost:5173` and try signing up a new account.

## Option 2: Using Local Supabase (For Development)

If you want to develop locally without using cloud resources:

### Step 1: Install Supabase CLI

```bash
# macOS
brew install supabase/tap/supabase

# Windows
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

### Step 2: Start Local Supabase

```bash
supabase start
```

This will:
- Start a local PostgreSQL database
- Start local Supabase services
- Print your local credentials

### Step 3: Use Local Credentials

The `supabase start` command will output something like:
```
API URL: http://localhost:54321
anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Add these to your `.env.local`:
```env
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 4: Run Migrations Locally

```bash
supabase migration up
```

Or if migrations are already applied:
```bash
supabase db reset
```

## Troubleshooting

### Issue: "Missing Supabase environment variables"
- Make sure `.env.local` exists and has the correct values
- Restart your dev server after changing `.env.local`

### Issue: "RLS policy violation"
- Check that migrations ran successfully
- Verify RLS policies in Supabase dashboard (Authentication → Policies)

### Issue: "Cannot connect to Supabase"
- Check your internet connection
- Verify the URL and keys are correct
- Check Supabase project status (might be paused on free tier)

### Issue: Migrations fail
- Run migrations in order (001, 002, 003)
- Check for syntax errors in SQL
- Ensure you have the correct permissions

## Next Steps

Once Supabase is set up:

1. **Test Authentication**: Try signing up a new user
2. **Create a Quest**: Use the quest builder to create your first Christmas calendar
3. **Test Participation**: Share the quest link and test the participant flow
4. **Check Analytics**: View analytics for your test quest

## Security Notes

- **Never commit `.env.local`** - it's already in `.gitignore`
- **Never expose service_role key** - only use anon key in frontend
- **Keep database password secure** - you'll need it for direct database access

## Need Help?

If you encounter issues:
1. Check Supabase logs in the dashboard
2. Check browser console for errors
3. Verify all migrations ran successfully
4. Ensure environment variables are set correctly

