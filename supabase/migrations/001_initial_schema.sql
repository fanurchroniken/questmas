-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Quest type enum
CREATE TYPE quest_type AS ENUM (
  'christmas_calendar',
  'treasure_hunt',
  'onboarding',
  'custom'
);

-- Unlock trigger type enum
CREATE TYPE unlock_trigger_type AS ENUM (
  'date',
  'answer',
  'location',
  'manual',
  'sequential'
);

-- Quest status enum
CREATE TYPE quest_status AS ENUM (
  'draft',
  'published',
  'archived'
);

-- Participant status enum
CREATE TYPE participant_status AS ENUM (
  'active',
  'completed',
  'abandoned'
);

-- Organizations table (for B2B, optional for MVP)
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- User profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quests table
CREATE TABLE IF NOT EXISTS quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  quest_type quest_type NOT NULL DEFAULT 'custom',
  status quest_status NOT NULL DEFAULT 'draft',
  theme_config JSONB DEFAULT '{}'::jsonb,
  start_date DATE,
  end_date DATE,
  is_public BOOLEAN DEFAULT true,
  requires_auth BOOLEAN DEFAULT false,
  share_code TEXT UNIQUE, -- Short code for shareable URLs
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Calendar configs (for Christmas calendars)
CREATE TABLE IF NOT EXISTS calendar_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quest_id UUID NOT NULL REFERENCES quests(id) ON DELETE CASCADE,
  start_date DATE NOT NULL, -- First day of calendar (e.g., Dec 1)
  end_date DATE NOT NULL, -- Last day of calendar (e.g., Dec 24)
  unlock_schedule JSONB DEFAULT '{}'::jsonb, -- Custom unlock schedule if needed
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(quest_id)
);

-- Chapters table (optional grouping for future use)
CREATE TABLE IF NOT EXISTS chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quest_id UUID NOT NULL REFERENCES quests(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks table (challenges/riddles within quests)
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quest_id UUID NOT NULL REFERENCES quests(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES chapters(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  instructions TEXT,
  task_type TEXT DEFAULT 'answer', -- answer, location, qr_code, etc.
  unlock_trigger unlock_trigger_type NOT NULL DEFAULT 'sequential',
  unlock_condition JSONB DEFAULT '{}'::jsonb, -- Date, answer, location coords, etc.
  correct_answer TEXT, -- For answer-based tasks
  points INTEGER DEFAULT 10,
  order_index INTEGER NOT NULL DEFAULT 0,
  hints JSONB DEFAULT '[]'::jsonb, -- Array of hints
  metadata JSONB DEFAULT '{}'::jsonb, -- Additional task-specific data
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quest participants (user participation sessions)
CREATE TABLE IF NOT EXISTS quest_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quest_id UUID NOT NULL REFERENCES quests(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_guest BOOLEAN DEFAULT false,
  guest_email TEXT, -- For guest participants
  status participant_status NOT NULL DEFAULT 'active',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  total_points INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create partial unique indexes for quest_participants
CREATE UNIQUE INDEX IF NOT EXISTS idx_quest_participants_quest_user 
  ON quest_participants(quest_id, user_id) 
  WHERE user_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_quest_participants_quest_guest 
  ON quest_participants(quest_id, guest_email) 
  WHERE is_guest = true;

-- Task completions (completion tracking)
CREATE TABLE IF NOT EXISTS task_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID NOT NULL REFERENCES quest_participants(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  answer TEXT, -- User's answer (if applicable)
  points_earned INTEGER DEFAULT 0,
  hints_used INTEGER DEFAULT 0,
  attempts INTEGER DEFAULT 1,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(participant_id, task_id)
);

-- Quest themes (theme configurations)
CREATE TABLE IF NOT EXISTS quest_themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quest_id UUID NOT NULL REFERENCES quests(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  colors JSONB DEFAULT '{}'::jsonb,
  fonts JSONB DEFAULT '{}'::jsonb,
  styles JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(quest_id)
);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quests_updated_at BEFORE UPDATE ON quests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_calendar_configs_updated_at BEFORE UPDATE ON calendar_configs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chapters_updated_at BEFORE UPDATE ON chapters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quest_participants_updated_at BEFORE UPDATE ON quest_participants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quest_themes_updated_at BEFORE UPDATE ON quest_themes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

