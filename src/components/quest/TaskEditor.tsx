import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Plus, Trash2 } from 'lucide-react';
import { Task } from '@/lib/services/questService';
import { useTranslation } from 'react-i18next';

interface TaskEditorProps {
  task?: Task;
  questId: string;
  orderIndex: number;
  onSave: (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export function TaskEditor({
  task,
  questId,
  orderIndex,
  onSave,
  onCancel,
  onDelete,
}: TaskEditorProps) {
  const { t } = useTranslation();
  
  const taskSchema = z.object({
  title: z.string().optional(), // Optional for auto-created tasks
  description: z.string().optional(),
  instructions: z.string().optional(),
  correct_answer: z.string().optional(),
  points: z.number().min(0).default(10),
  unlock_trigger: z.enum(['date', 'answer', 'location', 'manual', 'sequential']),
  unlock_date: z.string().optional(), // For date-based unlocks
  order_index: z.number().min(0),
});

type TaskFormData = z.infer<typeof taskSchema>;

  const [hints, setHints] = useState<Array<{ text: string; cost?: number }>>(
    task?.hints || []
  );
  const [newHint, setNewHint] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      instructions: task?.instructions || '',
      correct_answer: task?.correct_answer || '',
      points: task?.points || 10,
      unlock_trigger: task?.unlock_trigger || 'sequential',
      unlock_date: task?.unlock_condition?.date as string | undefined,
      order_index: orderIndex,
    },
  });

  const unlockTrigger = watch('unlock_trigger');

  const addHint = () => {
    if (newHint.trim()) {
      setHints([...hints, { text: newHint.trim() }]);
      setNewHint('');
    }
  };

  const removeHint = (index: number) => {
    setHints(hints.filter((_, i) => i !== index));
  };

  const onSubmit = (data: TaskFormData) => {
    const unlockCondition: Record<string, unknown> = {};
    
    // For existing tasks with date trigger, preserve the date
    if (task?.unlock_trigger === 'date' && task?.unlock_condition?.date) {
      unlockCondition.date = task.unlock_condition.date;
    } else if (data.unlock_trigger === 'date' && data.unlock_date) {
      unlockCondition.date = data.unlock_date;
    }

    // Preserve unlock trigger if it's date-based (for Christmas calendars)
    const unlockTrigger = task?.unlock_trigger === 'date' ? 'date' : data.unlock_trigger;

    // Ensure title is always provided (required by database)
    const taskTitle = data.title?.trim() || (task?.title || `Day ${data.order_index + 1}`);

    onSave({
      quest_id: questId,
      title: taskTitle,
      description: data.description,
      instructions: data.instructions,
      task_type: 'answer',
      unlock_trigger: unlockTrigger,
      unlock_condition: unlockCondition,
      correct_answer: data.correct_answer,
      points: data.points,
      order_index: data.order_index,
      hints,
      metadata: {},
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-deep-teal">
          {task ? t('editTaskTitle') : t('newTask')} - {t('day')} {orderIndex + 1}
        </h3>
        <div className="flex gap-2">
          {task && onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
          <button type="button" onClick={onCancel} className="text-stormy-sky hover:text-deep-teal">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-stormy-sky mb-2">
          {task?.unlock_trigger === 'date' ? t('titleOptional') : t('titleRequired')}
        </label>
        <input
          type="text"
          {...register('title')}
          className="input"
          placeholder={task?.unlock_trigger === 'date' ? t('dayRiddlePlaceholder') : t('taskTitlePlaceholder')}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-stormy-sky mb-2">{t('taskDescription')}</label>
        <textarea
          {...register('description')}
          rows={2}
          className="input"
          placeholder={t('taskDescriptionPlaceholder')}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-stormy-sky mb-2">
          {t('riddleQuestion')}
        </label>
        <textarea
          {...register('instructions')}
          rows={4}
          className="input"
          placeholder={t('enterRiddle')}
        />
        <p className="text-xs text-stormy-sky mt-1">
          {t('participantsWillSee')}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-stormy-sky mb-2">
            {t('unlockTrigger')}
          </label>
          <select {...register('unlock_trigger')} className="input" disabled={task?.unlock_trigger === 'date'}>
            <option value="sequential">{t('sequential')}</option>
            <option value="date">{t('dateBased')}</option>
            <option value="answer">{t('answerBased')}</option>
            <option value="manual">{t('manual')}</option>
          </select>
          {task?.unlock_trigger === 'date' && (
            <p className="text-xs text-stormy-sky mt-1">{t('dateBasedUnlock')}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-stormy-sky mb-2">{t('points')}</label>
          <input
            type="number"
            {...register('points', { valueAsNumber: true })}
            className="input"
            min="0"
          />
        </div>
      </div>

      {unlockTrigger === 'date' && (
        <div>
          <label className="block text-sm font-medium text-stormy-sky mb-2">{t('unlockDate')}</label>
          <input type="date" {...register('unlock_date')} className="input" />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-stormy-sky mb-2">
          {t('correctAnswerLabel')}
        </label>
        <input
          type="text"
          {...register('correct_answer')}
          className="input"
          placeholder={t('correctAnswerPlaceholder')}
        />
        <p className="text-xs text-stormy-sky mt-1">
          {t('participantsMustEnter')}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-stormy-sky mb-2">{t('hints')}</label>
        <div className="space-y-2">
          {hints.map((hint, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={hint.text}
                readOnly
                className="input flex-1"
              />
              <button
                type="button"
                onClick={() => removeHint(index)}
                className="text-red-600 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <div className="flex gap-2">
            <input
              type="text"
              value={newHint}
              onChange={(e) => setNewHint(e.target.value)}
              className="input flex-1"
              placeholder={t('addHintPlaceholder')}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addHint();
                }
              }}
            />
            <button type="button" onClick={addHint} className="btn-secondary">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button type="submit" className="btn-primary flex-1">
          {task ? t('updateTask') : t('createTask')}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          {t('cancel')}
        </button>
      </div>
    </form>
  );
}

