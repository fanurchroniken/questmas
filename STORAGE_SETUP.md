# Supabase Storage Setup for Quest Photos

## Overview

The Questmas app uses Supabase Storage to store photos that participants take to complete Christmas calendar challenges. This guide will help you set up the storage bucket.

## Steps

### 1. Create Storage Bucket

1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New bucket**
4. Configure the bucket:
   - **Name**: `quest-photos`
   - **Public bucket**: ✅ Enable (checked)
   - **File size limit**: `10 MB`
   - **Allowed MIME types**: `image/jpeg, image/png, image/webp`
5. Click **Create bucket**

### 2. Set Up Storage Policies

After creating the bucket, you need to set up Row-Level Security (RLS) policies:

1. Go to **Storage** > **Policies** tab
2. Select the `quest-photos` bucket
3. Click **New Policy**

#### Policy 1: Allow Public Read Access

- **Policy name**: `Public can view quest photos`
- **Allowed operation**: `SELECT`
- **Target roles**: `public`
- **Policy definition**:
  ```sql
  (bucket_id = 'quest-photos')
  ```

#### Policy 2: Allow Authenticated Uploads

- **Policy name**: `Users can upload quest photos`
- **Allowed operation**: `INSERT`
- **Target roles**: `authenticated`
- **Policy definition**:
  ```sql
  (bucket_id = 'quest-photos')
  ```

#### Policy 3: Allow Users to Update Their Own Photos (Optional)

- **Policy name**: `Users can update their quest photos`
- **Allowed operation**: `UPDATE`
- **Target roles**: `authenticated`
- **Policy definition**:
  ```sql
  (bucket_id = 'quest-photos')
  ```

### 3. Run Database Migration

Run the migration to add the `photo_url` column to the `task_completions` table:

```sql
-- This is in supabase/migrations/004_add_photo_support.sql
ALTER TABLE task_completions
ADD COLUMN IF NOT EXISTS photo_url TEXT;
```

You can run this in the Supabase SQL Editor.

## Testing

After setup, test the photo upload functionality:

1. Create a Christmas calendar quest
2. Add a challenge that requires a photo
3. As a participant, try to upload a photo
4. Verify the photo appears in the Storage bucket
5. Check that the photo URL is saved in the `task_completions` table

## Troubleshooting

### Error: "Photo storage not configured"

This means the `quest-photos` bucket doesn't exist. Follow Step 1 above to create it.

### Error: "new row violates row-level security policy"

The storage policies aren't set up correctly. Follow Step 2 above to configure the policies.

### Photos not displaying

Check that:
1. The bucket is set to **Public**
2. The `photo_url` column exists in `task_completions`
3. The photo URLs are being saved correctly

## Security Considerations

- Photos are publicly accessible (by design, for sharing)
- Consider adding file size limits and MIME type restrictions
- For production, you may want to add rate limiting
- Consider adding automatic cleanup of old photos

