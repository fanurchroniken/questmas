import { useState } from 'react';
import { Task } from '@/lib/services/questService';
import { ArrowLeft, CheckCircle, Lightbulb, MapPin } from 'lucide-react';
import { PhotoUpload } from './PhotoUpload';
import { useTranslation } from 'react-i18next';

interface TaskDisplayProps {
  task: Task;
  isCompleted: boolean;
  onComplete: (answer?: string, photoUrl?: string) => void;
  onBack: () => void;
  loading?: boolean;
  questTitle?: string;
  questType?: string;
}

export function TaskDisplay({
  task,
  isCompleted,
  onComplete,
  onBack,
  loading,
  questTitle,
  questType,
}: TaskDisplayProps) {
  const { t } = useTranslation();
  const [answer, setAnswer] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [hasFoundIt, setHasFoundIt] = useState(false);
  const [showLocationHint, setShowLocationHint] = useState(false);
  const isPhotoTask = questType === 'christmas_calendar' || (task.metadata as { requires_photo?: boolean })?.requires_photo;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isPhotoTask) {
      if (!photoUrl) {
        setError(t('pleaseUploadPhoto'));
        return;
      }
      onComplete(undefined, photoUrl);
    } else if (task.correct_answer) {
      const normalizedAnswer = answer.trim().toLowerCase();
      const normalizedCorrect = task.correct_answer.trim().toLowerCase();

      if (normalizedAnswer === normalizedCorrect) {
        onComplete(answer);
      } else {
        setError(t('incorrectAnswer'));
      }
    } else {
      // No correct answer required, just submit
      onComplete(answer);
    }
  };

  const handlePhotoUploaded = (url: string) => {
    setPhotoUrl(url);
    // Auto-submit when photo is uploaded
    onComplete(undefined, url);
  };

  const handleShowHint = () => {
    if (task.hints && hintIndex < task.hints.length) {
      setShowHint(true);
      setHintIndex(hintIndex + 1);
    }
  };

  if (isCompleted) {
    return (
      <div className="card">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-deep-teal mb-2">{t('taskCompleted')}</h2>
          <p className="text-stormy-sky mb-6">{t('alreadyCompleted')}</p>
          <button onClick={onBack} className="btn-primary">
            {t('backToCalendar')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="text-stormy-sky hover:text-deep-teal">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold text-deep-teal">
          {task.title || `${t('day')} ${(task.order_index ?? 0) + 1}`}
        </h2>
      </div>

      {task.description && (
        <div className="mb-6">
          <p className="text-stormy-sky">{task.description}</p>
        </div>
      )}

      {task.instructions ? (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-deep-teal mb-2">{t('yourChristmasChallenge')}</h3>
          <p className="text-stormy-sky mb-2">{task.instructions}</p>
          {(task.metadata as { location_description?: string })?.location_description && (
            <>
              {!showLocationHint ? (
                <button
                  type="button"
                  onClick={() => setShowLocationHint(true)}
                  className="mt-3 flex items-center gap-2 text-sm text-deep-teal hover:text-christmas-red transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  <span>{t('needHelpFindingLocation') || 'Need help finding the location?'}</span>
                </button>
              ) : (
                <div className="flex items-start gap-2 mt-3 pt-3 border-t border-blue-300">
                  <MapPin className="w-5 h-5 text-christmas-red flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-deep-teal">{t('locationHint')}</p>
                    <p className="text-sm text-stormy-sky">
                      {(task.metadata as { location_description?: string }).location_description}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      ) : isPhotoTask ? (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-stormy-sky">{t('noInstructionsYet')}</p>
          <p className="text-xs text-stormy-sky mt-1">{t('pleaseWaitForChallenge')}</p>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-stormy-sky">{t('noInstructionsYet')}</p>
        </div>
      )}

      {showHint && task.hints && hintIndex > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-800 mb-1">{t('hint', { number: hintIndex })}</h3>
              <p className="text-yellow-700">{task.hints[hintIndex - 1]?.text}</p>
            </div>
          </div>
        </div>
      )}

      {isPhotoTask ? (
        <div className="space-y-4">
          {!hasFoundIt ? (
            <>
              {/* Show instructions and hint option first */}
              {task.hints && hintIndex < task.hints.length && (
                <button
                  type="button"
                  onClick={handleShowHint}
                  className="btn-secondary flex items-center gap-2 w-full"
                  disabled={loading}
                >
                  <Lightbulb className="w-4 h-4" />
                  {t('showHint')}
                </button>
              )}
              <button
                type="button"
                onClick={() => setHasFoundIt(true)}
                className="btn-cta w-full flex items-center justify-center gap-2"
                disabled={loading}
              >
                {t('iHaveFoundIt')}
              </button>
            </>
          ) : (
            <>
              {/* Show photo upload after "I have found it" is clicked */}
              {task.instructions ? (
                <PhotoUpload
                  onPhotoUploaded={handlePhotoUploaded}
                  questTitle={questTitle}
                  taskTitle={task.title}
                  loading={loading}
                />
              ) : (
                <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                  <p className="text-stormy-sky mb-4">{t('noInstructionsYet')}</p>
                  <p className="text-sm text-stormy-sky">{t('pleaseWaitForChallenge')}</p>
                </div>
              )}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
              <button
                type="button"
                onClick={() => setHasFoundIt(false)}
                className="btn-secondary w-full"
              >
                {t('backToChallenge')}
              </button>
            </>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {task.correct_answer && (
            <div>
              <label htmlFor="answer" className="block text-sm font-medium text-stormy-sky mb-2">
                {t('yourAnswer')}
              </label>
              <input
                id="answer"
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="input"
                placeholder={t('enterYourAnswer')}
                disabled={loading}
              />
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            {task.hints && hintIndex < task.hints.length && (
              <button
                type="button"
                onClick={handleShowHint}
                className="btn-secondary flex items-center gap-2"
              >
                <Lightbulb className="w-4 h-4" />
                {t('showHint')}
              </button>
            )}
            <button
              type="submit"
              disabled={loading || (task.correct_answer && !answer.trim())}
              className="btn-primary flex-1"
            >
              {loading ? t('completing') : task.correct_answer ? t('submitAnswer') : t('markComplete')}
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 pt-6 border-t border-stormy-sky">
        <div className="flex items-center justify-between text-sm text-stormy-sky">
          <span>{t('points')}: {task.points}</span>
          {task.hints && task.hints.length > 0 && (
            <span>{t('hintsAvailable', { count: task.hints.length - hintIndex })}</span>
          )}
        </div>
      </div>
    </div>
  );
}

