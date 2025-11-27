import { supabase } from '@/lib/supabase';

export interface QuestParticipant {
  id: string;
  quest_id: string;
  user_id?: string;
  is_guest: boolean;
  guest_email?: string;
  status: 'active' | 'completed' | 'abandoned';
  started_at: string;
  completed_at?: string;
  total_points: number;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface TaskCompletion {
  id: string;
  participant_id: string;
  task_id: string;
  answer?: string;
  photo_url?: string;
  points_earned: number;
  hints_used: number;
  attempts: number;
  completed_at: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface CreateParticipantInput {
  quest_id: string;
  user_id?: string;
  is_guest?: boolean;
  guest_email?: string;
}

export async function createParticipant(
  input: CreateParticipantInput
): Promise<QuestParticipant> {
  const { data, error } = await supabase
    .from('quest_participants')
    .insert({
      quest_id: input.quest_id,
      user_id: input.user_id,
      is_guest: input.is_guest ?? !input.user_id,
      guest_email: input.guest_email,
      status: 'active',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getParticipant(
  questId: string,
  userId?: string,
  guestEmail?: string
): Promise<QuestParticipant | null> {
  let query = supabase
    .from('quest_participants')
    .select('*')
    .eq('quest_id', questId);

  if (userId) {
    query = query.eq('user_id', userId);
  } else if (guestEmail) {
    query = query.eq('guest_email', guestEmail).eq('is_guest', true);
  } else {
    return null;
  }

  const { data, error } = await query.single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function getParticipantCompletions(
  participantId: string
): Promise<TaskCompletion[]> {
  const { data, error } = await supabase
    .from('task_completions')
    .select('*')
    .eq('participant_id', participantId)
    .order('completed_at', { ascending: true });

  if (error) throw error;
  return data;
}

export async function completeTask(
  participantId: string,
  taskId: string,
  answer?: string,
  pointsEarned?: number,
  photoUrl?: string
): Promise<TaskCompletion> {
  // Check if already completed
  const existing = await supabase
    .from('task_completions')
    .select('*')
    .eq('participant_id', participantId)
    .eq('task_id', taskId)
    .single();

  if (existing.data) {
    return existing.data;
  }

  const completionData: {
    participant_id: string;
    task_id: string;
    answer?: string;
    photo_url?: string;
    points_earned: number;
    hints_used: number;
    attempts: number;
    metadata?: Record<string, unknown>;
  } = {
    participant_id: participantId,
    task_id: taskId,
    points_earned: pointsEarned || 10,
    hints_used: 0,
    attempts: 1,
  };

  if (answer) {
    completionData.answer = answer;
  }

  if (photoUrl) {
    // Store photo as data URL in metadata (or photo_url if it's a URL)
    // If it's a data URL, store in metadata to avoid URL length issues
    if (photoUrl.startsWith('data:')) {
      completionData.metadata = { 
        completion_type: 'photo',
        photo_data_url: photoUrl 
      };
    } else {
      completionData.photo_url = photoUrl;
      completionData.metadata = { completion_type: 'photo' };
    }
  }

  const { data, error } = await supabase
    .from('task_completions')
    .insert(completionData)
    .select()
    .single();

  if (error) throw error;

  // Update participant total points
  const participant = await supabase
    .from('quest_participants')
    .select('total_points')
    .eq('id', participantId)
    .single();

  if (participant.data) {
    await supabase
      .from('quest_participants')
      .update({
        total_points: (participant.data.total_points || 0) + (pointsEarned || 10),
      })
      .eq('id', participantId);
  }

  return data;
}

export async function updateParticipantStatus(
  participantId: string,
  status: QuestParticipant['status']
): Promise<QuestParticipant> {
  const updates: Partial<QuestParticipant> = { status };
  if (status === 'completed') {
    updates.completed_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('quest_participants')
    .update(updates)
    .eq('id', participantId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

