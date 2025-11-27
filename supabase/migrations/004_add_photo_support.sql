-- Add photo_url column to task_completions
ALTER TABLE task_completions
ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Create storage bucket for quest photos (if it doesn't exist)
-- Note: This needs to be run in Supabase Dashboard > Storage > Create Bucket
-- Bucket name: quest-photos
-- Public: true
-- File size limit: 10MB
-- Allowed MIME types: image/jpeg, image/png, image/webp

-- RLS policies for storage bucket (run after creating bucket)
-- These policies allow authenticated users to upload photos
-- and allow public read access to photos

-- Policy: Allow authenticated users to upload photos
-- CREATE POLICY "Users can upload quest photos"
--   ON storage.objects FOR INSERT
--   TO authenticated
--   WITH CHECK (bucket_id = 'quest-photos');

-- Policy: Allow public read access to photos
-- CREATE POLICY "Public can view quest photos"
--   ON storage.objects FOR SELECT
--   TO public
--   USING (bucket_id = 'quest-photos');

