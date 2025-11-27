# Database Migration Guide

Follow these steps to set up your Supabase database schema.

## Step-by-Step Instructions

### Step 1: Open SQL Editor in Supabase

1. Go to your Supabase project dashboard
2. Click on **"SQL Editor"** in the left sidebar
3. Click **"New query"** button

### Step 2: Run Migration 001 (Initial Schema)

1. Open the file: `supabase/migrations/001_initial_schema.sql`
2. **Copy the entire contents** of the file
3. Paste it into the SQL Editor in Supabase
4. Click **"Run"** (or press Ctrl+Enter / Cmd+Enter)
5. Wait for it to complete - you should see "Success. No rows returned"

### Step 3: Run Migration 002 (RLS Policies)

1. Open the file: `supabase/migrations/002_rls_policies.sql`
2. **Copy the entire contents** of the file
3. In the SQL Editor, click **"New query"** (or clear the previous one)
4. Paste the contents
5. Click **"Run"**
6. Wait for it to complete

### Step 4: Run Migration 003 (Indexes)

1. Open the file: `supabase/migrations/003_indexes.sql`
2. **Copy the entire contents** of the file
3. In the SQL Editor, click **"New query"** (or clear the previous one)
4. Paste the contents
5. Click **"Run"**
6. Wait for it to complete

### Step 5: Verify Tables Were Created

1. Go to **"Table Editor"** in the left sidebar
2. You should see these tables:
   - ✅ `organizations`
   - ✅ `user_profiles`
   - ✅ `quests`
   - ✅ `calendar_configs`
   - ✅ `chapters`
   - ✅ `tasks`
   - ✅ `quest_participants`
   - ✅ `task_completions`
   - ✅ `quest_themes`

If you see all these tables, you're done! 🎉

## Troubleshooting

### Error: "relation already exists"
- Some tables might already exist. This is okay - the migrations use `CREATE TABLE IF NOT EXISTS`
- You can ignore these warnings

### Error: "permission denied"
- Make sure you're running the migrations in the SQL Editor (not as a regular user)
- The SQL Editor runs with admin privileges

### Error: "type already exists"
- The enums might already exist. This is fine - they use `CREATE TYPE IF NOT EXISTS`

### Can't find SQL Editor?
- Look in the left sidebar for "SQL Editor" or "Database" → "SQL Editor"
- It might be under "Database" section

## Next Steps

After migrations are complete:

1. **Test the connection**: Run `npm run dev` and try signing up
2. **Create your first quest**: Log in and create a Christmas calendar quest
3. **Test participation**: Share the quest link and test the participant flow

## Need Help?

If you encounter any errors:
1. Copy the error message
2. Check which migration step failed
3. The error message will usually tell you what went wrong

