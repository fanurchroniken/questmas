import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTestMode } from '@/contexts/TestModeContext';
import { getQuest, getQuestTasks, type Quest, type Task } from '@/lib/services/questService';
import {
  createParticipant,
  getParticipant,
  getParticipantCompletions,
  completeTask,
  updateParticipantStatus,
  type QuestParticipant,
  type TaskCompletion,
} from '@/lib/services/participationService';
import { CalendarView } from '@/components/quest/CalendarView';
import { TaskDisplay } from '@/components/quest/TaskDisplay';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { format, isAfter, isBefore, parseISO, startOfDay } from 'date-fns';
import { ArrowLeft, Trophy, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function QuestParticipant() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isTestMode, getTestDate } = useTestMode();
  const [quest, setQuest] = useState<Quest | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [participant, setParticipant] = useState<QuestParticipant | null>(null);
  const [completions, setCompletions] = useState<TaskCompletion[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  // Debug: Log test mode state
  useEffect(() => {
    console.log('QuestParticipant - Test mode state:', isTestMode);
    console.log('QuestParticipant - localStorage test_mode:', localStorage.getItem('questmas_test_mode'));
  }, [isTestMode]);

  useEffect(() => {
    if (id) {
      loadQuest();
    }
  }, [id]);

  useEffect(() => {
    if (!quest) return;

    // Wait for auth to finish loading before checking preview mode
    if (authLoading) return;

    // Check if user is the creator - allow preview without participant
    if (user && quest.creator_id === user.id && quest.status !== 'published') {
      // Creator previewing unpublished quest - create a mock participant for preview
      setParticipant({
        id: 'preview-participant',
        quest_id: quest.id,
        user_id: user.id,
        status: 'active',
        started_at: new Date().toISOString(),
        total_points: 0,
        is_guest: false,
      } as QuestParticipant);
      return;
    }

    // For authenticated users, load or create participant
    if (user) {
      loadParticipant();
    } else if (!quest.requires_auth) {
      // For guest access, create a session-based participant
      loadOrCreateGuestParticipant();
    }
  }, [quest, user, authLoading]);

  useEffect(() => {
    if (participant && participant.id !== 'preview-participant') {
      loadCompletions();
    } else if (participant && participant.id === 'preview-participant') {
      // In preview mode, set empty completions
      setCompletions([]);
    }
  }, [participant]);

  const loadQuest = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const questData = await getQuest(id);
      if (questData) {
        setQuest(questData);
        const tasksData = await getQuestTasks(id);
        const sortedTasks = tasksData.sort((a, b) => a.order_index - b.order_index);
        setTasks(sortedTasks);
        console.log('Loaded quest:', questData.title, 'with', sortedTasks.length, 'tasks');
      } else {
        // Quest not found - set quest to null to show error message
        setQuest(null);
      }
    } catch (error) {
      console.error('Error loading quest:', error);
      // Don't navigate away, show error instead
      setQuest(null);
    } finally {
      setLoading(false);
    }
  };

  const loadParticipant = async () => {
    if (!quest || !user) return;

    try {
      let participantData = await getParticipant(quest.id, user.id);

      if (!participantData) {
        participantData = await createParticipant({
          quest_id: quest.id,
          user_id: user.id,
          is_guest: false,
        });
      }

      setParticipant(participantData);
    } catch (error) {
      console.error('Error loading participant:', error);
    }
  };

  const loadOrCreateGuestParticipant = async () => {
    if (!quest) return;

    // For guest participants, use session storage
    const guestId = sessionStorage.getItem(`guest_participant_${quest.id}`);
    if (guestId) {
      try {
        const participantData = await getParticipant(quest.id, undefined, guestId);
        if (participantData) {
          setParticipant(participantData);
          return;
        }
      } catch (error) {
        console.error('Error loading guest participant:', error);
      }
    }

    // Create new guest participant
    try {
      const guestEmail = `guest_${Date.now()}@quest.local`;
      const participantData = await createParticipant({
        quest_id: quest.id,
        is_guest: true,
        guest_email: guestEmail,
      });
      sessionStorage.setItem(`guest_participant_${quest.id}`, guestEmail);
      setParticipant(participantData);
    } catch (error) {
      console.error('Error creating guest participant:', error);
    }
  };

  const loadCompletions = async () => {
    if (!participant || participant.id === 'preview-participant') {
      // Skip loading completions for preview mode
      setCompletions([]);
      return;
    }

    try {
      const completionData = await getParticipantCompletions(participant.id);
      setCompletions(completionData);
    } catch (error) {
      console.error('Error loading completions:', error);
      // Set empty completions on error to prevent further issues
      setCompletions([]);
    }
  };

  const isTaskUnlocked = (task: Task): boolean => {
    // If test mode is ON, unlock all tasks
    if (isTestMode) {
      console.log('Test mode ON: unlocking task', task.id, task.title);
      return true;
    }
    
    // Otherwise, follow the defined rules
    if (task.unlock_trigger === 'date') {
      const unlockDate = task.unlock_condition?.date as string;
      if (unlockDate) {
        const today = startOfDay(getTestDate()); // Use test date if in test mode
        const unlock = startOfDay(parseISO(unlockDate));
        const isUnlocked = !isBefore(today, unlock);
        if (!isUnlocked) {
          console.log('Task locked by date:', { taskId: task.id, today: today.toISOString(), unlock: unlock.toISOString() });
        }
        return isUnlocked;
      }
    } else if (task.unlock_trigger === 'sequential') {
      const taskIndex = tasks.findIndex((t) => t.id === task.id);
      if (taskIndex === 0) return true;
      const previousTask = tasks[taskIndex - 1];
      return completions.some((c) => c.task_id === previousTask.id);
    }
    return true;
  };

  const isTaskCompleted = (taskId: string): boolean => {
    return completions.some((c) => c.task_id === taskId);
  };

  const handleTaskComplete = async (task: Task, answer?: string, photoUrl?: string) => {
    if (!activeParticipant || isCreatorPreview) {
      // In preview mode, just show a message
      alert('This is a preview. Tasks cannot be completed in preview mode.');
      return;
    }

    if (!activeParticipant) return;

    setCompleting(true);
    try {
      await completeTask(activeParticipant.id, task.id, answer, task.points, photoUrl);
      await loadCompletions();

      // Check if all tasks are completed
      const allCompleted = tasks.every((t) => {
        const completed = completions.some((c) => c.task_id === t.id);
        return completed || (t.id === task.id ? true : completed);
      });

      if (allCompleted && activeParticipant.status !== 'completed') {
        await updateParticipantStatus(activeParticipant.id, 'completed');
        setParticipant({ ...activeParticipant, status: 'completed' });
      }

      setSelectedTask(null);
    } catch (error) {
      console.error('Error completing task:', error);
      alert('Failed to complete task. Please try again.');
    } finally {
      setCompleting(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-forest-dark flex items-center justify-center">
        <div className="text-cream">{t('loading')}</div>
      </div>
    );
  }

  if (!quest) {
    if (loading) {
      return (
        <div className="min-h-screen bg-forest-dark flex items-center justify-center">
          <div className="text-cream">{t('loading')}</div>
        </div>
      );
    }
    // Quest not found
    return (
      <div className="min-h-screen bg-forest-dark flex items-center justify-center">
        <div className="card text-center">
          <h1 className="text-2xl font-bold text-deep-teal mb-4">{t('questNotFound')}</h1>
          <p className="text-stormy-sky mb-4">{t('questNotAvailable')}</p>
          <button onClick={() => navigate('/dashboard')} className="btn-primary">
            {t('goToDashboard')}
          </button>
        </div>
      </div>
    );
  }

  // For creator previewing unpublished quest, show a preview mode
  // Only check this after auth has finished loading
  const isCreatorPreview = !authLoading && user?.id === quest.creator_id && quest.status !== 'published';
  
  // Use mock participant for creator preview
  const activeParticipant = participant || (isCreatorPreview ? {
    id: 'preview-participant',
    quest_id: quest.id,
    user_id: user?.id || '',
    status: 'active' as const,
    started_at: new Date().toISOString(),
    total_points: 0,
    is_guest: false,
  } as QuestParticipant : null);

  // Wait for auth to load before making decisions about participant
  if (authLoading) {
    return (
      <div className="min-h-screen bg-forest-dark flex items-center justify-center">
        <div className="text-cream">{t('loading')}</div>
      </div>
    );
  }

  // For non-creator preview, wait for participant to load
  if (!activeParticipant && !isCreatorPreview) {
    // If quest doesn't require auth, guest participant will be created
    if (!quest.requires_auth && !user) {
      return (
        <div className="min-h-screen bg-forest-dark flex items-center justify-center">
          <div className="text-cream">{t('loading')}</div>
        </div>
      );
    }
    // For authenticated users, wait for participant
    return (
      <div className="min-h-screen bg-forest-dark flex items-center justify-center">
        <div className="text-cream">{t('loading')}</div>
      </div>
    );
  }

  // Safety check - if still no participant and not in preview mode, show error
  if (!activeParticipant && !isCreatorPreview) {
    return (
      <div className="min-h-screen bg-forest-dark flex items-center justify-center">
        <div className="card text-center">
          <h1 className="text-2xl font-bold text-deep-teal mb-4">{t('questNotFound')}</h1>
          <p className="text-stormy-sky mb-4">{t('questNotAvailable')}</p>
          <button onClick={() => navigate('/dashboard')} className="btn-primary">
            {t('goToDashboard')}
          </button>
        </div>
      </div>
    );
  }

  const isChristmasCalendar = quest.quest_type === 'christmas_calendar';
  const completedCount = completions.length;
  const totalTasks = tasks.length;
  const allCompleted = activeParticipant?.status === 'completed' || completedCount === totalTasks;

  return (
    <div className="min-h-screen bg-forest-dark">
      <nav className="bg-cream shadow-sm border-b border-cream-dark/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <button
                onClick={() => navigate(-1)}
                className="text-forest-dark hover:text-forest-light flex-shrink-0"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-base sm:text-xl font-primary font-bold text-cream truncate">{quest.title}</h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              <LanguageSwitcher />
              {activeParticipant && activeParticipant.total_points > 0 && (
                <div className="hidden sm:flex items-center gap-1 text-pirate-gold font-semibold text-sm">
                  <Trophy className="w-4 h-4" />
                  {activeParticipant.total_points} points
                </div>
              )}
              {isCreatorPreview && (
                <div className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded whitespace-nowrap">
                  Preview
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Test Mode Indicator */}
        {isTestMode && (
          <div className="mb-4 p-4 bg-yellow-50 border-2 border-yellow-400 rounded-lg">
            <p className="text-sm text-yellow-800 font-semibold">
              🧪 Test Mode ON: All calendar doors are unlocked for testing
            </p>
          </div>
        )}
        
        {/* Debug info in preview mode */}
        {isCreatorPreview && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-forest-dark">
              <strong>Preview Mode:</strong> {tasks.length} tasks loaded. Test date: {getTestDate().toLocaleDateString()}
            </p>
            {isTestMode && (
              <p className="text-sm text-green-700 font-semibold mt-2">
                ✓ Test Mode ON: All doors are unlocked
              </p>
            )}
          </div>
        )}
        {allCompleted ? (
          <div className="card text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-forest-dark mb-4">
              {isChristmasCalendar ? t('allDoorsOpened') : t('questComplete')}
            </h2>
            <p className="text-lg text-forest-dark/80 mb-6">
              {isChristmasCalendar ? (
                <>{t('allDoorsOpenedMessage', { count: totalTasks })}</>
              ) : (
                <>{t('questCompleteMessage', { count: totalTasks })}</>
              )}
            </p>
            <div className="text-2xl font-bold text-pirate-gold mb-6">
              {t('totalPointsLabel')} {activeParticipant?.total_points ?? 0}
            </div>
            <button onClick={() => navigate('/')} className="btn-primary">
              {t('goHome')}
            </button>
          </div>
        ) : selectedTask ? (
          <TaskDisplay
            task={selectedTask}
            isCompleted={isCreatorPreview ? false : isTaskCompleted(selectedTask.id)}
            onComplete={(answer, photoUrl) => handleTaskComplete(selectedTask, answer, photoUrl)}
            onBack={() => setSelectedTask(null)}
            loading={completing}
            questTitle={quest.title}
            questType={quest.quest_type}
          />
        ) : (
          <div>
            {isChristmasCalendar ? (
              <>
                {tasks.length === 0 ? (
                  <div className="card text-center py-12">
                    <p className="text-forest-dark mb-4">{t('noTasksYet')}</p>
                    <p className="text-sm text-forest-dark/80">{t('tasksWillAppearHere')}</p>
                  </div>
                ) : (
                  <CalendarView
                    tasks={tasks}
                    completions={completions}
                    onTaskClick={(task) => {
                      // Allow clicking on unlocked tasks (completed or not)
                      if (isTaskUnlocked(task)) {
                        setSelectedTask(task);
                      }
                    }}
                    isTaskUnlocked={isTaskUnlocked}
                    isTaskCompleted={isTaskCompleted}
                  />
                )}
              </>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasks.map((task) => {
                  const unlocked = isTaskUnlocked(task);
                  const completed = isTaskCompleted(task.id);
                  return (
                    <div
                      key={task.id}
                      onClick={() => {
                        if (unlocked && !completed) {
                          setSelectedTask(task);
                        }
                      }}
                      className={`card cursor-pointer transition-all ${
                        !unlocked
                          ? 'opacity-50 cursor-not-allowed'
                          : completed
                            ? 'bg-green-50 border-green-200'
                            : 'hover:shadow-lg'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-forest-dark">{task.title}</h3>
                        {completed && <CheckCircle className="w-5 h-5 text-green-600" />}
                      </div>
                      {task.description && (
                        <p className="text-sm text-forest-dark/80 mb-2">{task.description}</p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-forest-dark/70">
                        <span>{task.points} {t('points')}</span>
                        {!unlocked && <span className="text-red-600">{t('locked')}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

