import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getQuest, type Quest } from '@/lib/services/questService';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Users, CheckCircle, Clock, Download, BarChart3 } from 'lucide-react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

interface ParticipantData {
  id: string;
  user_id?: string;
  is_guest: boolean;
  guest_email?: string;
  status: string;
  started_at: string;
  completed_at?: string;
  total_points: number;
  completed_tasks: number;
}

export default function QuestAnalytics() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [quest, setQuest] = useState<Quest | null>(null);
  const [participants, setParticipants] = useState<ParticipantData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadQuest();
      loadParticipants();
    }
  }, [id]);

  const loadQuest = async () => {
    if (!id) return;
    try {
      const questData = await getQuest(id);
      if (questData) {
        // Verify user owns this quest
        if (questData.creator_id !== user?.id) {
          navigate('/dashboard');
          return;
        }
        setQuest(questData);
      }
    } catch (error) {
      console.error('Error loading quest:', error);
      navigate('/dashboard');
    }
  };

  const loadParticipants = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const { data: participantsData, error } = await supabase
        .from('quest_participants')
        .select('*')
        .eq('quest_id', id)
        .order('started_at', { ascending: false });

      if (error) throw error;

      // Get completion counts for each participant
      const participantsWithCompletions = await Promise.all(
        (participantsData || []).map(async (participant) => {
          const { count } = await supabase
            .from('task_completions')
            .select('*', { count: 'exact', head: true })
            .eq('participant_id', participant.id);

          return {
            ...participant,
            completed_tasks: count || 0,
          };
        })
      );

      setParticipants(participantsWithCompletions);
    } catch (error) {
      console.error('Error loading participants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (participants.length === 0) return;

    const headers = [t('email'), t('status'), t('started'), t('completedLabel'), t('points'), t('tasksLabel')];
    const rows = participants.map((p) => [
      p.is_guest ? p.guest_email || t('guest') : t('authenticatedUser'),
      p.status,
      format(new Date(p.started_at), 'yyyy-MM-dd HH:mm'),
      p.completed_at ? format(new Date(p.completed_at), 'yyyy-MM-dd HH:mm') : '-',
      p.total_points.toString(),
      p.completed_tasks.toString(),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quest-analytics-${quest?.title || 'quest'}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-forest-dark flex items-center justify-center">
        <div className="text-stormy-sky">{t('loading')}</div>
      </div>
    );
  }

  if (!quest) {
    return null;
  }

  const totalParticipants = participants.length;
  const completedParticipants = participants.filter((p) => p.status === 'completed').length;
  const completionRate = totalParticipants > 0 ? (completedParticipants / totalParticipants) * 100 : 0;
  const averagePoints =
    totalParticipants > 0
      ? participants.reduce((sum, p) => sum + p.total_points, 0) / totalParticipants
      : 0;

  return (
    <div className="min-h-screen bg-forest-dark">
      <nav className="bg-cream shadow-sm border-b border-cream-dark/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-stormy-sky hover:text-deep-teal"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-primary font-bold text-deep-teal">
                {t('analyticsTitle', { title: quest.title })}
              </h1>
            </div>
            <button onClick={handleExportCSV} className="btn-secondary flex items-center gap-2">
              <Download className="w-4 h-4" />
              {t('exportCSV')}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-6 h-6 text-deep-teal" />
              <h3 className="font-semibold text-deep-teal">{t('totalParticipants')}</h3>
            </div>
            <div className="text-3xl font-bold text-deep-teal">{totalParticipants}</div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h3 className="font-semibold text-deep-teal">{t('completed')}</h3>
            </div>
            <div className="text-3xl font-bold text-green-600">{completedParticipants}</div>
            <div className="text-sm text-stormy-sky mt-1">
              {completionRate.toFixed(1)}% {t('completionRate')}
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-6 h-6 text-pirate-gold" />
              <h3 className="font-semibold text-deep-teal">{t('avgPoints')}</h3>
            </div>
            <div className="text-3xl font-bold text-pirate-gold">{averagePoints.toFixed(0)}</div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-6 h-6 text-sunset-orange" />
              <h3 className="font-semibold text-deep-teal">{t('activeNow')}</h3>
            </div>
            <div className="text-3xl font-bold text-sunset-orange">
              {participants.filter((p) => p.status === 'active').length}
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-2xl font-semibold text-deep-teal mb-4">{t('participantsTitle')}</h2>
          {participants.length === 0 ? (
            <div className="text-center py-12 text-stormy-sky">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>{t('noParticipantsYet')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stormy-sky">
                    <th className="text-left py-3 px-4 font-semibold text-deep-teal">{t('participant')}</th>
                    <th className="text-left py-3 px-4 font-semibold text-deep-teal">{t('status')}</th>
                    <th className="text-left py-3 px-4 font-semibold text-deep-teal">{t('started')}</th>
                    <th className="text-left py-3 px-4 font-semibold text-deep-teal">{t('completedLabel')}</th>
                    <th className="text-left py-3 px-4 font-semibold text-deep-teal">{t('points')}</th>
                    <th className="text-left py-3 px-4 font-semibold text-deep-teal">{t('tasksLabel')}</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((participant) => (
                    <tr key={participant.id} className="border-b border-stormy-sky">
                      <td className="py-3 px-4 text-stormy-sky">
                        {participant.is_guest
                          ? participant.guest_email || t('guest')
                          : t('authenticatedUser')}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            participant.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : participant.status === 'active'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {participant.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-stormy-sky">
                        {format(new Date(participant.started_at), 'MMM d, yyyy HH:mm')}
                      </td>
                      <td className="py-3 px-4 text-stormy-sky">
                        {participant.completed_at
                          ? format(new Date(participant.completed_at), 'MMM d, yyyy HH:mm')
                          : '-'}
                      </td>
                      <td className="py-3 px-4 text-pirate-gold font-semibold">
                        {participant.total_points}
                      </td>
                      <td className="py-3 px-4 text-stormy-sky">
                        {participant.completed_tasks}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

