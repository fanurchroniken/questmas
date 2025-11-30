import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { QuestForm } from '@/components/quest/QuestForm';
import { TaskEditor } from '@/components/quest/TaskEditor';
import { SimpleTaskEditor } from '@/components/quest/SimpleTaskEditor';
import { TaskGrid } from '@/components/quest/TaskGrid';
import {
  createQuest,
  updateQuest,
  deleteQuest,
  getQuest,
  getQuestTasks,
  createTask,
  updateTask,
  deleteTask,
  createCalendarConfig,
  publishQuest,
  type Quest,
  type Task,
  type CreateQuestInput,
  type CreateTaskInput,
} from '@/lib/services/questService';
import { ArrowLeft, Save, Eye, Calendar, Plus, Trash2, Share2, Grid3x3, List, Edit2, ChevronDown, ChevronUp } from 'lucide-react';
import { ShareButtons } from '@/components/sharing/ShareButtons';
import { PersonalizedShareModal } from '@/components/sharing/PersonalizedShareModal';
import { format } from 'date-fns';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { TestModeToggle } from '@/components/TestModeToggle';

export default function QuestBuilder() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { t } = useTranslation();
  const [quest, setQuest] = useState<Quest | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isNewQuest, setIsNewQuest] = useState(!id);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isQuestDetailsOpen, setIsQuestDetailsOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showPersonalizedShare, setShowPersonalizedShare] = useState(false);

  useEffect(() => {
    if (id && !authLoading && user) {
      loadQuest();
    }
  }, [id, authLoading, user]);

  const loadQuest = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const questData = await getQuest(id);
      if (questData) {
        // Verify user owns this quest
        if (questData.creator_id !== user?.id) {
          alert('You do not have permission to edit this quest.');
          navigate('/dashboard');
          return;
        }
        setQuest(questData);
        const tasksData = await getQuestTasks(id);
        setTasks(tasksData);
      } else {
        alert('Quest not found.');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error loading quest:', error);
      alert('Failed to load quest. Please try again.');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleQuestSubmit = async (data: CreateQuestInput & { recipient_first_name?: string }) => {
    if (!user) return;

    setSaving(true);
    try {
      let questData: Quest;
      
      // Auto-set dates for Christmas calendars
      const questDataWithDates: CreateQuestInput = { ...data };
      if (data.quest_type === 'christmas_calendar') {
        const currentYear = new Date().getFullYear();
        questDataWithDates.start_date = `${currentYear}-12-01`;
        questDataWithDates.end_date = `${currentYear}-12-24`;
      }
      
      // Store recipient_first_name in theme_config
      const themeConfig: Record<string, unknown> = {
        ...(quest?.theme_config || {}),
      };
      if (data.recipient_first_name) {
        themeConfig.recipient_first_name = data.recipient_first_name;
      } else {
        delete themeConfig.recipient_first_name;
      }
      
      // Remove recipient_first_name from questDataWithDates as it's stored in theme_config
      const { recipient_first_name, ...questDataWithoutRecipient } = questDataWithDates;

      if (isNewQuest) {
        questData = await createQuest({
          ...questDataWithoutRecipient,
          theme_config: themeConfig,
          creator_id: user.id,
        } as CreateQuestInput & { creator_id: string });

        // Create calendar config for Christmas calendars
        if (data.quest_type === 'christmas_calendar') {
          const currentYear = new Date().getFullYear();
          const startDate = `${currentYear}-12-01`;
          const endDate = `${currentYear}-12-24`;
          await createCalendarConfig(questData.id, startDate, endDate);

          // Auto-create 24 tasks for Christmas calendar (Dec 1-24)
          const tasksToCreate = [];
          const start = new Date(startDate);
          
          for (let day = 1; day <= 24; day++) {
            const taskDate = new Date(start);
            taskDate.setDate(start.getDate() + (day - 1));
            const dateString = taskDate.toISOString().split('T')[0];

            tasksToCreate.push({
              quest_id: questData.id,
              title: `Day ${day} - December ${day}`,
              description: '',
              instructions: '',
              task_type: 'answer',
              unlock_trigger: 'date' as const,
              unlock_condition: { date: dateString },
              correct_answer: '',
              points: 10,
              order_index: day - 1,
              hints: [],
              metadata: {},
            });
          }

          // Create all tasks
          for (const taskData of tasksToCreate) {
            await createTask(taskData);
          }

          // Reload tasks to show them
          const tasksData = await getQuestTasks(questData.id);
          setTasks(tasksData);
        }

        navigate(`/quests/${questData.id}/edit`);
        setQuest(questData);
        setIsNewQuest(false);
      } else if (quest) {
        // Auto-set dates for Christmas calendars on update too
        const questDataWithDates: CreateQuestInput = { ...data };
        if (data.quest_type === 'christmas_calendar') {
          const currentYear = new Date().getFullYear();
          questDataWithDates.start_date = `${currentYear}-12-01`;
          questDataWithDates.end_date = `${currentYear}-12-24`;
        }
        
        // Store recipient_first_name in theme_config for updates too
        const updateThemeConfig: Record<string, unknown> = {
          ...(quest.theme_config || {}),
        };
        if (data.recipient_first_name) {
          updateThemeConfig.recipient_first_name = data.recipient_first_name;
        } else {
          delete updateThemeConfig.recipient_first_name;
        }
        
        const { recipient_first_name: _, ...questDataWithoutRecipient } = questDataWithDates;
        questData = await updateQuest(quest.id, {
          ...questDataWithoutRecipient,
          theme_config: updateThemeConfig,
        });
        setQuest(questData);
      }
    } catch (error) {
      console.error('Error saving quest:', error);
      alert('Failed to save quest. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleTaskSave = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    if (!quest) return;

    try {
      if (editingTask) {
        const updated = await updateTask(editingTask.id, taskData);
        setTasks(tasks.map((t) => (t.id === updated.id ? updated : t)));
      } else {
        const newTask = await createTask({
          ...taskData,
          quest_id: quest.id,
        });
        setTasks([...tasks, newTask]);
      }
      setEditingTask(null);
    } catch (error) {
      console.error('Error saving task:', error);
      alert('Failed to save task. Please try again.');
    }
  };

  const handleSimpleTaskSave = async (taskData: {
    title?: string;
    instructions: string;
    location_description?: string;
  }) => {
    if (!quest || !editingTask) return;

    setSaving(true);
    try {
      // Preserve existing task properties, only update the simple fields
      const unlockCondition = editingTask.unlock_condition || {};
      const existingMetadata = (editingTask.metadata || {}) as Record<string, unknown>;
      const updated = await updateTask(editingTask.id, {
        quest_id: quest.id,
        title: taskData.title || editingTask.title,
        description: editingTask.description,
        instructions: taskData.instructions,
        task_type: editingTask.task_type,
        unlock_trigger: editingTask.unlock_trigger,
        unlock_condition: unlockCondition,
        correct_answer: '', // No answer needed for photo-based tasks
        points: editingTask.points,
        order_index: editingTask.order_index,
        hints: editingTask.hints || [], // Preserve existing hints if any
        metadata: {
          ...existingMetadata,
          location_description: taskData.location_description,
          requires_photo: true,
        },
      });
      setTasks(tasks.map((t) => (t.id === updated.id ? updated : t)));
      setEditingTask(null);
    } catch (error) {
      console.error('Error saving task:', error);
      alert('Failed to save task. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleTaskDelete = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      await deleteTask(taskId);
      setTasks(tasks.filter((t) => t.id !== taskId));
      if (editingTask?.id === taskId) {
        setEditingTask(null);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task. Please try again.');
    }
  };

  const handlePublish = async () => {
    if (!quest) return;
    if (!confirm('Publish this quest? It will be accessible via shareable link.')) return;

    try {
      const published = await publishQuest(quest.id);
      setQuest(published);
      alert('Quest published! Share the link with participants.');
    } catch (error) {
      console.error('Error publishing quest:', error);
      alert('Failed to publish quest. Please try again.');
    }
  };

  const handlePreview = () => {
    if (!quest) return;
    
    // For published quests, use share code
    if (quest.share_code) {
      window.open(`/q/${quest.share_code}`, '_blank');
    } else {
      // For unpublished quests, preview using quest ID (creator can access)
      window.open(`/quest/${quest.id}/participate`, '_blank');
    }
  };

  const handleDelete = async () => {
    if (!quest || !user) return;

    // Verify user owns this quest before deleting
    if (quest.creator_id !== user.id) {
      alert('You do not have permission to delete this quest.');
      return;
    }

    const confirmMessage = quest.status === 'published'
      ? 'Are you sure you want to delete this published quest? This action cannot be undone and all participants will lose access.'
      : 'Are you sure you want to delete this quest? This action cannot be undone.';

    if (!confirm(confirmMessage)) return;

    setDeleting(true);
    try {
      await deleteQuest(quest.id);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting quest:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete quest. Please try again.';
      alert(errorMessage);
      setDeleting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-forest-dark flex items-center justify-center">
        <div className="text-stormy-sky">{t('loading')}</div>
      </div>
    );
  }

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
                {isNewQuest ? t('createNewQuest') : t('editQuestTitle')}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              {quest && (
                <button onClick={handlePreview} className="btn-secondary flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  {t('preview')}
                </button>
              )}
              {quest && quest.status !== 'published' && (
                <button onClick={handlePublish} className="btn-cta flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {t('publish')}
                </button>
              )}
              {quest && (
                <button
                  onClick={handleDelete}
                  className="btn-secondary flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  disabled={deleting}
                >
                  <Trash2 className="w-4 h-4" />
                  {deleting ? t('loading') : t('delete')}
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <button
                onClick={() => setIsQuestDetailsOpen(!isQuestDetailsOpen)}
                className="w-full flex justify-between items-center mb-4 text-left"
              >
                <h2 className="text-2xl font-semibold text-deep-teal">{t('questDetails')}</h2>
                {isQuestDetailsOpen ? (
                  <ChevronUp className="w-5 h-5 text-stormy-sky" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-stormy-sky" />
                )}
              </button>
              {isQuestDetailsOpen && (
                <QuestForm
                  onSubmit={handleQuestSubmit}
                  defaultValues={quest ? {
                    ...quest,
                    recipient_first_name: (quest.theme_config?.recipient_first_name as string) || undefined,
                  } : undefined}
                  loading={saving}
                />
              )}
            </div>

            {quest && (
              <div className="card">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-deep-teal">{t('tasksTitle')}</h2>
                    <p className="text-sm text-stormy-sky mt-1">
                      {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} total
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {quest.quest_type === 'christmas_calendar' && (
                      <div className="flex items-center gap-1 bg-forest-dark rounded-lg p-1">
                        <button
                          onClick={() => setViewMode('grid')}
                          className={`p-2 rounded transition-colors ${
                            viewMode === 'grid'
                              ? 'bg-deep-teal text-white'
                              : 'text-stormy-sky hover:bg-forest-dark'
                          }`}
                          title="Grid view"
                        >
                          <Grid3x3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setViewMode('list')}
                          className={`p-2 rounded transition-colors ${
                            viewMode === 'list'
                              ? 'bg-deep-teal text-white'
                              : 'text-stormy-sky hover:bg-forest-dark'
                          }`}
                          title="List view"
                        >
                          <List className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    {!editingTask && quest.quest_type !== 'christmas_calendar' && (
                      <button
                        onClick={() => setEditingTask({} as Task)}
                        className="btn-primary flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Task
                      </button>
                    )}
                  </div>
                </div>

                {editingTask && quest.quest_type === 'christmas_calendar' ? (
                  <SimpleTaskEditor
                    task={editingTask}
                    onSave={handleSimpleTaskSave}
                    onCancel={() => setEditingTask(null)}
                    loading={saving}
                  />
                ) : editingTask ? (
                  <div className="mb-6">
                    <TaskEditor
                      task={editingTask.id ? editingTask : undefined}
                      questId={quest.id}
                      orderIndex={tasks.length}
                      onSave={handleTaskSave}
                      onCancel={() => setEditingTask(null)}
                      onDelete={editingTask.id ? () => handleTaskDelete(editingTask.id) : undefined}
                    />
                  </div>
                ) : null}

                {!editingTask && (
                  <>
                    {quest.quest_type === 'christmas_calendar' && viewMode === 'grid' ? (
                      <TaskGrid
                        tasks={tasks}
                        onTaskClick={(task) => setEditingTask(task)}
                        questType={quest.quest_type}
                      />
                    ) : (
                      <div className="space-y-3">
                        {tasks.map((task, index) => {
                          const unlockDate = task.unlock_trigger === 'date' && task.unlock_condition?.date
                            ? new Date(task.unlock_condition.date as string)
                            : null;
                          const hasAnswer = !!task.correct_answer?.trim();
                          const hasRiddle = !!task.instructions?.trim();
                          const hasContent = hasAnswer && hasRiddle;

                          return (
                            <div
                              key={task.id}
                              className={`border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer ${
                                hasContent
                                  ? 'border-green-300 bg-green-50'
                                  : hasAnswer || hasRiddle
                                    ? 'border-yellow-300 bg-yellow-50'
                                    : 'border-dashed border-gray-300 bg-gray-50'
                              }`}
                              onClick={() => setEditingTask(task)}
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-sm font-semibold text-deep-teal">
                                      {quest.quest_type === 'christmas_calendar' ? t('dayNumber', { number: index + 1 }) : t('taskNumber', { number: index + 1 })}
                                    </span>
                                    {unlockDate && (
                                      <span className="text-xs text-stormy-sky">
                                        {format(unlockDate, 'MMM d')}
                                      </span>
                                    )}
                                    {hasContent ? (
                                      <span className="text-xs text-green-700 bg-green-200 px-2 py-0.5 rounded">
                                        {t('complete')}
                                      </span>
                                    ) : hasAnswer || hasRiddle ? (
                                      <span className="text-xs text-yellow-700 bg-yellow-200 px-2 py-0.5 rounded">
                                        {t('incomplete')}
                                      </span>
                                    ) : (
                                      <span className="text-xs text-gray-600 bg-gray-200 px-2 py-0.5 rounded">
                                        {t('empty')}
                                      </span>
                                    )}
                                  </div>
                                  <h3 className="font-semibold text-deep-teal mb-1">
                                    {task.title || (quest.quest_type === 'christmas_calendar' ? t('dayNumber', { number: index + 1 }) : t('taskNumber', { number: index + 1 }))}
                                  </h3>
                                  {task.instructions && (
                                    <p className="text-sm text-stormy-sky line-clamp-2 mt-1">
                                      {task.instructions}
                                    </p>
                                  )}
                                  <div className="mt-2 flex gap-3 text-xs text-stormy-sky">
                                    {hasAnswer && <span className="text-green-700">✓ {t('answer')}</span>}
                                    {hasRiddle && <span className="text-green-700">✓ {t('riddle')}</span>}
                                    {task.hints && task.hints.length > 0 && (
                                      <span>{t('hintCount', { count: task.hints.length })}</span>
                                    )}
                                  </div>
                                </div>
                                <div className="text-stormy-sky ml-4">
                                  <Edit2 className="w-5 h-5" />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        {tasks.length === 0 && (
                          <div className="text-center py-12 text-stormy-sky">
                            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p>{t('noTasksCreated')}</p>
                            {quest.quest_type === 'christmas_calendar' && (
                              <p className="text-sm mt-2">
                                {t('autoCreated24Tasks')}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="card sticky top-8">
              <h3 className="text-lg font-semibold text-deep-teal mb-4">Quest Info</h3>
              {quest ? (
                <div className="space-y-4 text-sm">
                  <div>
                    <span className="text-stormy-sky">Status:</span>
                    <span className="ml-2 font-medium capitalize">{quest.status}</span>
                  </div>
                  {quest.share_code && (
                    <div>
                      <span className="text-stormy-sky">Share Code:</span>
                      <span className="ml-2 font-medium font-mono">{quest.share_code}</span>
                    </div>
                  )}
                  {quest.created_at && (
                    <div>
                      <span className="text-stormy-sky">Created:</span>
                      <span className="ml-2">
                        {format(new Date(quest.created_at), 'MMM d, yyyy')}
                      </span>
                    </div>
                  )}
                  {quest.published_at && (
                    <div>
                      <span className="text-stormy-sky">Published:</span>
                      <span className="ml-2">
                        {format(new Date(quest.published_at), 'MMM d, yyyy')}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-stormy-sky">Tasks:</span>
                    <span className="ml-2 font-medium">{tasks.length}</span>
                  </div>
                </div>
              ) : (
                <p className="text-stormy-sky text-sm">
                  Save the quest details to start adding tasks.
                </p>
              )}
            </div>

            {quest && quest.status === 'published' && quest.share_code && (
              <div className="card sticky top-[400px]">
                <h3 className="text-lg font-semibold text-deep-teal mb-4 flex items-center gap-2">
                  <Share2 className="w-5 h-5" />
                  {t('shareQuest')}
                </h3>
                <div className="space-y-4">
                  <button
                    onClick={() => setShowPersonalizedShare(true)}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    {t('share')}
                  </button>
                  <div className="text-center text-sm text-stormy-sky">— {t('or')} —</div>
                  <ShareButtons
                    url={`${window.location.origin}/q/${quest.share_code}`}
                    title={quest.title}
                    description={quest.description}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {quest && quest.status === 'published' && quest.share_code && (
        <PersonalizedShareModal
          isOpen={showPersonalizedShare}
          onClose={() => setShowPersonalizedShare(false)}
          url={`${window.location.origin}/q/${quest.share_code}`}
          title={quest.title}
          description={quest.description}
          sharerName={user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Someone'}
          isChristmasCalendar={quest.quest_type === 'christmas_calendar'}
        />
      )}
      <TestModeToggle />
    </div>
  );
}

