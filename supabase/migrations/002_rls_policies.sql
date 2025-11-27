-- Enable Row Level Security on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE quest_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quest_themes ENABLE ROW LEVEL SECURITY;

-- Note: auth.uid() is already provided by Supabase, no need to create it

-- Organizations policies
CREATE POLICY "Users can view their organization"
  ON organizations FOR SELECT
  USING (
    id IN (
      SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage organizations"
  ON organizations FOR ALL
  USING (false); -- Only system admins, implement separately if needed

-- User profiles policies
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (id = auth.uid());

-- Quests policies
CREATE POLICY "Anyone can view published public quests"
  ON quests FOR SELECT
  USING (
    status = 'published' AND is_public = true
  );

CREATE POLICY "Users can view their own quests"
  ON quests FOR SELECT
  USING (creator_id = auth.uid());

CREATE POLICY "Users can create quests"
  ON quests FOR INSERT
  WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Users can update their own quests"
  ON quests FOR UPDATE
  USING (creator_id = auth.uid());

CREATE POLICY "Users can delete their own quests"
  ON quests FOR DELETE
  USING (creator_id = auth.uid());

-- Calendar configs policies
CREATE POLICY "Anyone can view calendar configs for published quests"
  ON calendar_configs FOR SELECT
  USING (
    quest_id IN (
      SELECT id FROM quests WHERE status = 'published' AND is_public = true
    )
  );

CREATE POLICY "Users can manage calendar configs for their quests"
  ON calendar_configs FOR ALL
  USING (
    quest_id IN (
      SELECT id FROM quests WHERE creator_id = auth.uid()
    )
  );

-- Chapters policies
CREATE POLICY "Anyone can view chapters for published quests"
  ON chapters FOR SELECT
  USING (
    quest_id IN (
      SELECT id FROM quests WHERE status = 'published' AND is_public = true
    )
  );

CREATE POLICY "Users can manage chapters for their quests"
  ON chapters FOR ALL
  USING (
    quest_id IN (
      SELECT id FROM quests WHERE creator_id = auth.uid()
    )
  );

-- Tasks policies
CREATE POLICY "Anyone can view tasks for published quests"
  ON tasks FOR SELECT
  USING (
    quest_id IN (
      SELECT id FROM quests WHERE status = 'published' AND is_public = true
    )
  );

CREATE POLICY "Users can manage tasks for their quests"
  ON tasks FOR ALL
  USING (
    quest_id IN (
      SELECT id FROM quests WHERE creator_id = auth.uid()
    )
  );

-- Quest participants policies
CREATE POLICY "Users can view their own participation"
  ON quest_participants FOR SELECT
  USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Anyone can create participation for published quests"
  ON quest_participants FOR INSERT
  WITH CHECK (
    quest_id IN (
      SELECT id FROM quests WHERE status = 'published' AND is_public = true
    )
    AND (user_id = auth.uid() OR user_id IS NULL)
  );

CREATE POLICY "Users can update their own participation"
  ON quest_participants FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Quest creators can view all participants"
  ON quest_participants FOR SELECT
  USING (
    quest_id IN (
      SELECT id FROM quests WHERE creator_id = auth.uid()
    )
  );

-- Task completions policies
CREATE POLICY "Users can view their own completions"
  ON task_completions FOR SELECT
  USING (
    participant_id IN (
      SELECT id FROM quest_participants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own completions"
  ON task_completions FOR INSERT
  WITH CHECK (
    participant_id IN (
      SELECT id FROM quest_participants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own completions"
  ON task_completions FOR UPDATE
  USING (
    participant_id IN (
      SELECT id FROM quest_participants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Quest creators can view all completions"
  ON task_completions FOR SELECT
  USING (
    task_id IN (
      SELECT id FROM tasks WHERE quest_id IN (
        SELECT id FROM quests WHERE creator_id = auth.uid()
      )
    )
  );

-- Quest themes policies
CREATE POLICY "Anyone can view themes for published quests"
  ON quest_themes FOR SELECT
  USING (
    quest_id IN (
      SELECT id FROM quests WHERE status = 'published' AND is_public = true
    )
  );

CREATE POLICY "Users can manage themes for their quests"
  ON quest_themes FOR ALL
  USING (
    quest_id IN (
      SELECT id FROM quests WHERE creator_id = auth.uid()
    )
  );

