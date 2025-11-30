#!/bin/sh
set -e

# Create .env file from environment variables if they exist
# This allows Coolify to pass env vars that Vite can read during build
if [ -n "$VITE_SUPABASE_URL" ] && [ -n "$VITE_SUPABASE_ANON_KEY" ]; then
  echo "Creating .env file from environment variables..."
  echo "VITE_SUPABASE_URL=$VITE_SUPABASE_URL" > .env
  echo "VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY" >> .env
  echo "Environment variables set for build"
else
  echo "WARNING: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not set!"
  echo "Build will fail if these are required."
  exit 1
fi

# Run the build
npm run build

