import { Task } from '@/lib/services/questService';
import { TaskCompletion } from '@/lib/services/participationService';
import { format, parseISO } from 'date-fns';
import { Gift, Lock, CheckCircle, Edit2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface TaskGridProps {
  tasks: Task[];
  completions?: TaskCompletion[];
  onTaskClick: (task: Task) => void;
  isTaskCompleted?: (taskId: string) => boolean;
  questType?: string;
}

export function TaskGrid({
  tasks,
  onTaskClick,
  isTaskCompleted,
  questType,
}: TaskGridProps) {
  const { t } = useTranslation();
  const sortedTasks = [...tasks].sort((a, b) => a.order_index - b.order_index);
  const isChristmasCalendar = questType === 'christmas_calendar';

  const getTaskStatus = (task: Task): 'empty' | 'partial' | 'complete' => {
    const hasRiddle = !!task.instructions?.trim();
    const hasLocation = !!(task.metadata as { location_description?: string })?.location_description;
    const hasHints = task.hints && task.hints.length > 0;

    // For Christmas calendars, we only need instructions (challenge description)
    if (isChristmasCalendar) {
      if (hasRiddle) return 'complete';
      return 'empty';
    }

    // For other quest types, check for answer
    const hasAnswer = !!task.correct_answer?.trim();
    if (hasAnswer && hasRiddle) return 'complete';
    if (hasAnswer || hasRiddle || hasHints) return 'partial';
    return 'empty';
  };

  if (isChristmasCalendar) {
    // Show 24-day calendar grid
    const calendarDays = Array.from({ length: 24 }, (_, i) => i + 1);

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-deep-teal mb-2">{t('your24Days')}</h3>
          <p className="text-stormy-sky">{t('clickToAddChallenge')}</p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {calendarDays.map((day) => {
            const task = sortedTasks.find((t) => {
              if (t.unlock_trigger === 'date' && t.unlock_condition?.date) {
                const unlockDate = parseISO(t.unlock_condition.date as string);
                return unlockDate.getDate() === day;
              }
              return t.order_index === day - 1;
            });

            const status = task ? getTaskStatus(task) : 'empty';
            const completed = task && isTaskCompleted ? isTaskCompleted(task.id) : false;
            const unlockDate = task?.unlock_trigger === 'date' && task.unlock_condition?.date
              ? parseISO(task.unlock_condition.date as string)
              : null;

            return (
              <button
                key={day}
                onClick={() => task && onTaskClick(task)}
                className={`
                  aspect-square rounded-xl p-3 flex flex-col items-center justify-center
                  transition-all relative group
                  ${
                    status === 'empty'
                      ? 'bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-dashed border-gray-300 hover:border-christmas-red'
                      : status === 'partial'
                        ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-300 hover:border-yellow-400'
                        : 'bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-400 hover:border-green-500'
                  }
                  ${completed ? 'ring-4 ring-green-300' : ''}
                  hover:scale-105 hover:shadow-lg
                `}
              >
                {status === 'empty' ? (
                  <>
                    <Lock className="w-6 h-6 text-gray-400 mb-1 group-hover:text-christmas-red transition-colors" />
                    <span className="text-lg font-bold text-gray-600">{day}</span>
                    <span className="text-xs text-gray-500 mt-1">{t('empty')}</span>
                  </>
                ) : status === 'partial' ? (
                  <>
                    <Edit2 className="w-6 h-6 text-yellow-600 mb-1" />
                    <span className="text-lg font-bold text-yellow-700">{day}</span>
                    <span className="text-xs text-yellow-600 mt-1">{t('incomplete')}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-6 h-6 text-green-600 mb-1" />
                    <span className="text-lg font-bold text-green-700">{day}</span>
                    <span className="text-xs text-green-600 mt-1">{t('ready')}</span>
                  </>
                )}
                {unlockDate && (
                  <span className="absolute -top-1 -right-1 bg-christmas-red text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    {format(unlockDate, 'MMM d')}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-100 border-2 border-dashed border-gray-300 rounded"></div>
            <span className="text-stormy-sky">{t('emptyDoor')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-50 border-2 border-yellow-300 rounded"></div>
            <span className="text-stormy-sky">{t('almostReady')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-50 border-2 border-green-400 rounded"></div>
            <span className="text-stormy-sky">{t('completeReady')}</span>
          </div>
        </div>
      </div>
    );
  }

  // List view for non-calendar quests
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sortedTasks.map((task, index) => {
        const status = getTaskStatus(task);
        return (
          <button
            key={task.id}
            onClick={() => onTaskClick(task)}
            className={`
              text-left p-4 rounded-lg border-2 transition-all
              ${
                status === 'empty'
                  ? 'border-dashed border-gray-300 bg-gray-50 hover:border-deep-teal'
                  : status === 'partial'
                    ? 'border-yellow-300 bg-yellow-50 hover:border-yellow-400'
                    : 'border-green-400 bg-green-50 hover:border-green-500'
              }
              hover:shadow-md
            `}
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-sm font-medium text-deep-teal">{t('taskNumber', { number: index + 1 })}</span>
              {status === 'complete' && <CheckCircle className="w-4 h-4 text-green-600" />}
            </div>
            <h4 className="font-semibold text-deep-teal mb-1">
              {task.title || t('taskNumber', { number: index + 1 })}
            </h4>
            {status === 'empty' && (
              <p className="text-xs text-gray-500">{t('clickToAddContent')}</p>
            )}
          </button>
        );
      })}
    </div>
  );
}

