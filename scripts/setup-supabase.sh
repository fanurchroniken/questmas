#!/bin/bash

# Supabase Setup Script
# This script helps set up your Supabase project

echo "🚀 Captain's Quest - Supabase Setup"
echo "===================================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "✅ Created .env.local"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env.local and add your Supabase credentials:"
    echo "   - VITE_SUPABASE_URL"
    echo "   - VITE_SUPABASE_ANON_KEY"
    echo ""
else
    echo "✅ .env.local already exists"
fi

# Check if Supabase CLI is installed
if command -v supabase &> /dev/null; then
    echo "✅ Supabase CLI is installed"
    echo ""
    echo "To set up local Supabase:"
    echo "  1. Run: supabase start"
    echo "  2. Copy the credentials to .env.local"
    echo "  3. Run: supabase migration up"
    echo ""
else
    echo "⚠️  Supabase CLI not found"
    echo ""
    echo "To install Supabase CLI:"
    echo "  macOS:   brew install supabase/tap/supabase"
    echo "  Windows: scoop install supabase"
    echo "  Or download from: https://github.com/supabase/cli/releases"
    echo ""
fi

echo "📚 For detailed setup instructions, see SUPABASE_SETUP.md"
echo ""

