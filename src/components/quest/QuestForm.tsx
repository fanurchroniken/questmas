import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const questSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  quest_type: z.enum(['christmas_calendar', 'treasure_hunt', 'onboarding', 'custom']),
  recipient_first_name: z.string().max(50, 'First name must be less than 50 characters').optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  is_public: z.boolean().default(true),
  requires_auth: z.boolean().default(false),
});

type QuestFormData = z.infer<typeof questSchema>;

interface QuestFormProps {
  onSubmit: (data: QuestFormData) => void;
  defaultValues?: Partial<QuestFormData>;
  loading?: boolean;
}

export function QuestForm({ onSubmit, defaultValues, loading }: QuestFormProps) {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<QuestFormData>({
    resolver: zodResolver(questSchema),
    defaultValues: {
      quest_type: 'christmas_calendar',
      is_public: true,
      requires_auth: false,
      ...defaultValues,
    },
  });

  const questType = watch('quest_type');
  const startDate = watch('start_date');
  const endDate = watch('end_date');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-stormy-sky mb-2">
          {t('questTitle')} *
        </label>
        <input
          id="title"
          type="text"
          {...register('title')}
          className="input"
          placeholder={questType === 'christmas_calendar' ? 'My Magical Christmas Calendar 2024' : 'My Quest'}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-stormy-sky mb-2">
          {t('questDescription')}
        </label>
        <textarea
          id="description"
          {...register('description')}
          rows={4}
          className="input"
          placeholder={questType === 'christmas_calendar' ? 'Describe your magical Christmas calendar adventure...' : 'Describe your quest...'}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      {questType === 'christmas_calendar' && (
        <div>
          <label htmlFor="recipient_first_name" className="block text-sm font-medium text-stormy-sky mb-2">
            {t('recipientFirstName')} {t('optional')}
          </label>
          <input
            id="recipient_first_name"
            type="text"
            {...register('recipient_first_name')}
            className="input"
            placeholder={t('recipientFirstNamePlaceholder')}
          />
          <p className="mt-1 text-sm text-stormy-sky">{t('recipientFirstNameHint')}</p>
          {errors.recipient_first_name && (
            <p className="mt-1 text-sm text-red-600">{errors.recipient_first_name.message}</p>
          )}
        </div>
      )}

      {/* Quest type is fixed to christmas_calendar for now */}
      <input type="hidden" {...register('quest_type')} value="christmas_calendar" />

      {questType === 'christmas_calendar' && (
        <div className="bg-gradient-to-r from-christmas-red/10 to-christmas-green/10 border-2 border-christmas-gold/30 rounded-lg p-4">
          <p className="text-sm text-christmas-red font-semibold">
            🎄 {t('christmasCalendar')} quests automatically run from December 1-24. Dates are set automatically. ✨
          </p>
        </div>
      )}

      {questType !== 'christmas_calendar' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="start_date" className="block text-sm font-medium text-stormy-sky mb-2">
              <Calendar className="inline w-4 h-4 mr-1" />
              Start Date
            </label>
            <input
              id="start_date"
              type="date"
              {...register('start_date')}
              className="input"
            />
            {errors.start_date && (
              <p className="mt-1 text-sm text-red-600">{errors.start_date.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="end_date" className="block text-sm font-medium text-stormy-sky mb-2">
              <Calendar className="inline w-4 h-4 mr-1" />
              End Date
            </label>
            <input
              id="end_date"
              type="date"
              {...register('end_date')}
              className="input"
              min={startDate || undefined}
            />
            {errors.end_date && (
              <p className="mt-1 text-sm text-red-600">{errors.end_date.message}</p>
            )}
          </div>
        </div>
      )}

      {startDate && endDate && new Date(endDate) < new Date(startDate) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">End date must be after start date.</p>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center">
          <input
            id="is_public"
            type="checkbox"
            {...register('is_public')}
            className="w-4 h-4 text-deep-teal border-stormy-sky rounded focus:ring-deep-teal"
          />
          <label htmlFor="is_public" className="ml-2 text-sm text-stormy-sky">
            Make quest publicly accessible
          </label>
        </div>

        <div className="flex items-center">
          <input
            id="requires_auth"
            type="checkbox"
            {...register('requires_auth')}
            className="w-4 h-4 text-deep-teal border-stormy-sky rounded focus:ring-deep-teal"
          />
          <label htmlFor="requires_auth" className="ml-2 text-sm text-stormy-sky">
            Require authentication to participate
          </label>
        </div>
      </div>

      <div className="flex gap-4">
        <button type="submit" disabled={loading} className="btn-primary flex-1">
          {loading ? t('loading') : t('save')} {t('quest')}
        </button>
      </div>
    </form>
  );
}

