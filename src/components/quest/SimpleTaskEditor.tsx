import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { Task } from '@/lib/services/questService';
import { useTranslation } from 'react-i18next';

export function SimpleTaskEditor({
  task,
  onSave,
  onCancel,
  loading,
}: SimpleTaskEditorProps) {
  const { t } = useTranslation();
  
  const simpleTaskSchema = z.object({
    title: z.string().optional(),
    instructions: z.string().min(1, t('challengeDescriptionRequired') || 'Challenge description is required'),
    location_description: z.string().optional(),
  });

type SimpleTaskFormData = z.infer<typeof simpleTaskSchema>;

interface SimpleTaskEditorProps {
  task: Task;
  onSave: (taskData: {
    title?: string;
    instructions: string;
    location_description?: string;
  }) => void;
  onCancel: () => void;
  loading?: boolean;
}

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SimpleTaskFormData>({
    resolver: zodResolver(simpleTaskSchema),
    defaultValues: {
      title: task?.title || '',
      instructions: task?.instructions || '',
      location_description: (task?.metadata as { location_description?: string })?.location_description || '',
    },
  });

  const onSubmit = (data: SimpleTaskFormData) => {
    onSave({
      title: data.title?.trim() || task.title,
      instructions: data.instructions,
      location_description: data.location_description?.trim(),
    });
  };

  const dayNumber = (task.order_index ?? 0) + 1;
  const unlockDate = task.unlock_trigger === 'date' && task.unlock_condition?.date
    ? new Date(task.unlock_condition.date as string)
    : null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-christmas-red to-christmas-green p-6 rounded-t-xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                Day {dayNumber}
                {unlockDate && (
                  <span className="text-lg font-normal ml-2">
                    - {unlockDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                  </span>
                )}
              </h2>
              <p className="text-white text-opacity-90">{t('addFestiveChallenge')}</p>
            </div>
            <button
              onClick={onCancel}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-deep-teal mb-2">
              {t('titleOptionalLabel')}
            </label>
            <input
              type="text"
              {...register('title')}
              className="input"
              placeholder={`${t('day')} ${dayNumber} ${t('riddleQuestion').split(' / ')[0]}`}
            />
            <p className="text-xs text-stormy-sky mt-1">
              {t('shortTitleExample')}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-deep-teal mb-2">
              {t('challengeDescription')} *
            </label>
            <textarea
              {...register('instructions')}
              rows={5}
              className="input"
              placeholder={t('challengeDescriptionPlaceholder')}
            />
            {errors.instructions && (
              <p className="mt-1 text-sm text-red-600">{errors.instructions.message}</p>
            )}
            <p className="text-xs text-stormy-sky mt-1">
              {t('participantsWillSeeDoor')}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-deep-teal mb-2">
              {t('locationHintOptional')}
            </label>
            <input
              type="text"
              {...register('location_description')}
              className="input"
              placeholder={t('locationHintPlaceholder')}
            />
            <p className="text-xs text-stormy-sky mt-1">
              {t('helpParticipantsFind')}
            </p>
          </div>

          <div className="flex gap-4 pt-4 border-t border-stormy-sky">
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary flex-1"
              disabled={loading}
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-cta flex-1 flex items-center justify-center gap-2"
            >
              {loading ? t('saving') : t('saveDay')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

