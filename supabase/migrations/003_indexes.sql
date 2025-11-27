-- Indexes for performance optimization

-- User profiles indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_organization_id ON user_profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);

-- Quests indexes
CREATE INDEX IF NOT EXISTS idx_quests_creator_id ON quests(creator_id);
CREATE INDEX IF NOT EXISTS idx_quests_organization_id ON quests(organization_id);
CREATE INDEX IF NOT EXISTS idx_quests_status ON quests(status);
CREATE INDEX IF NOT EXISTS idx_quests_quest_type ON quests(quest_type);
CREATE INDEX IF NOT EXISTS idx_quests_share_code ON quests(share_code) WHERE share_code IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_quests_public_published ON quests(is_public, status) WHERE is_public = true AND status = 'published';
CREATE INDEX IF NOT EXISTS idx_quests_dates ON quests(start_date, end_date) WHERE start_date IS NOT NULL;

-- Calendar configs indexes
CREATE INDEX IF NOT EXISTS idx_calendar_configs_quest_id ON calendar_configs(quest_id);
CREATE INDEX IF NOT EXISTS idx_calendar_configs_dates ON calendar_configs(start_date, end_date);

-- Chapters indexes
CREATE INDEX IF NOT EXISTS idx_chapters_quest_id ON chapters(quest_id);
CREATE INDEX IF NOT EXISTS idx_chapters_order ON chapters(quest_id, order_index);

-- Tasks indexes
CREATE INDEX IF NOT EXISTS idx_tasks_quest_id ON tasks(quest_id);
CREATE INDEX IF NOT EXISTS idx_tasks_chapter_id ON tasks(chapter_id);
CREATE INDEX IF NOT EXISTS idx_tasks_order ON tasks(quest_id, order_index);
CREATE INDEX IF NOT EXISTS idx_tasks_unlock_trigger ON tasks(unlock_trigger);

-- Quest participants indexes
CREATE INDEX IF NOT EXISTS idx_quest_participants_quest_id ON quest_participants(quest_id);
CREATE INDEX IF NOT EXISTS idx_quest_participants_user_id ON quest_participants(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_quest_participants_status ON quest_participants(status);
CREATE INDEX IF NOT EXISTS idx_quest_participants_started_at ON quest_participants(started_at);

-- Task completions indexes
CREATE INDEX IF NOT EXISTS idx_task_completions_participant_id ON task_completions(participant_id);
CREATE INDEX IF NOT EXISTS idx_task_completions_task_id ON task_completions(task_id);
CREATE INDEX IF NOT EXISTS idx_task_completions_completed_at ON task_completions(completed_at);

-- Quest themes indexes
CREATE INDEX IF NOT EXISTS idx_quest_themes_quest_id ON quest_themes(quest_id);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_quest_participants_quest_user ON quest_participants(quest_id, user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_task_completions_participant_task ON task_completions(participant_id, task_id);

