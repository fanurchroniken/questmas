import { supabase } from '@/lib/supabase';

export interface Quest {
  id: string;
  creator_id: string;
  organization_id?: string;
  title: string;
  description?: string;
  quest_type: 'christmas_calendar' | 'treasure_hunt' | 'onboarding' | 'custom';
  status: 'draft' | 'published' | 'archived';
  theme_config: Record<string, unknown>;
  start_date?: string;
  end_date?: string;
  is_public: boolean;
  requires_auth: boolean;
  share_code?: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface Task {
  id: string;
  quest_id: string;
  chapter_id?: string;
  title: string;
  description?: string;
  instructions?: string;
  task_type: string;
  unlock_trigger: 'date' | 'answer' | 'location' | 'manual' | 'sequential';
  unlock_condition: Record<string, unknown>;
  correct_answer?: string;
  points: number;
  order_index: number;
  hints: Array<{ text: string; cost?: number }>;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface CalendarConfig {
  id: string;
  quest_id: string;
  start_date: string;
  end_date: string;
  unlock_schedule: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface CreateQuestInput {
  title: string;
  description?: string;
  quest_type: Quest['quest_type'];
  recipient_first_name?: string;
  start_date?: string;
  end_date?: string;
  is_public?: boolean;
  requires_auth?: boolean;
  theme_config?: Record<string, unknown>;
}

export interface CreateTaskInput {
  quest_id: string;
  title: string;
  description?: string;
  instructions?: string;
  task_type?: string;
  unlock_trigger: Task['unlock_trigger'];
  unlock_condition: Record<string, unknown>;
  correct_answer?: string;
  points?: number;
  order_index: number;
  hints?: Array<{ text: string; cost?: number }>;
  metadata?: Record<string, unknown>;
}

export async function createQuest(
  input: CreateQuestInput & { creator_id: string }
): Promise<Quest> {
  const { data, error } = await supabase
    .from('quests')
    .insert({
      ...input,
      status: 'draft',
      is_public: input.is_public ?? true,
      requires_auth: input.requires_auth ?? false,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateQuest(id: string, updates: Partial<Quest>): Promise<Quest> {
  const { data, error } = await supabase
    .from('quests')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteQuest(id: string): Promise<void> {
  const { error } = await supabase.from('quests').delete().eq('id', id);

  if (error) throw error;
}

export async function getQuest(id: string): Promise<Quest | null> {
  const { data, error } = await supabase.from('quests').select('*').eq('id', id).single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function getUserQuests(): Promise<Quest[]> {
  const { data, error } = await supabase
    .from('quests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function publishQuest(id: string): Promise<Quest> {
  // Generate share code if not exists
  const quest = await getQuest(id);
  if (!quest) throw new Error('Quest not found');

  const shareCode = quest.share_code || generateShareCode();

  const { data, error } = await supabase
    .from('quests')
    .update({
      status: 'published',
      published_at: new Date().toISOString(),
      share_code: shareCode,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      ...input,
      task_type: input.task_type || 'answer',
      points: input.points || 10,
      hints: input.hints || [],
      metadata: input.metadata || {},
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getQuestTasks(questId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('quest_id', questId)
    .order('order_index', { ascending: true });

  if (error) throw error;
  return data;
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase.from('tasks').delete().eq('id', id);
  if (error) throw error;
}

export async function createCalendarConfig(
  questId: string,
  startDate: string,
  endDate: string
): Promise<CalendarConfig> {
  const { data, error } = await supabase
    .from('calendar_configs')
    .insert({
      quest_id: questId,
      start_date: startDate,
      end_date: endDate,
      unlock_schedule: {},
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getCalendarConfig(questId: string): Promise<CalendarConfig | null> {
  const { data, error } = await supabase
    .from('calendar_configs')
    .select('*')
    .eq('quest_id', questId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function getQuestByShareCode(shareCode: string): Promise<Quest | null> {
  const { data, error } = await supabase
    .from('quests')
    .select('*')
    .eq('share_code', shareCode)
    .eq('status', 'published')
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

function generateShareCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

