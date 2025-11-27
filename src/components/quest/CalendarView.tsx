import { Task } from '@/lib/services/questService';
import { TaskCompletion } from '@/lib/services/participationService';
import { format, parseISO, startOfDay, isBefore, isAfter } from 'date-fns';
import { Gift, Lock, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTestMode } from '@/contexts/TestModeContext';

interface CalendarViewProps {
  tasks: Task[];
  completions: TaskCompletion[];
  onTaskClick: (task: Task) => void;
  isTaskUnlocked: (task: Task) => boolean;
  isTaskCompleted: (taskId: string) => boolean;
}

export function CalendarView({
  tasks,
  completions,
  onTaskClick,
  isTaskUnlocked,
  isTaskCompleted,
}: CalendarViewProps) {
  const { t } = useTranslation();
  const { getTestDate } = useTestMode();
  // Sort tasks by order_index and ensure we have 24 for Christmas calendar
  const sortedTasks = [...tasks].sort((a, b) => a.order_index - b.order_index);
  const calendarDays = Array.from({ length: 24 }, (_, i) => i + 1);

  const getTaskForDay = (day: number): Task | undefined => {
    return sortedTasks.find((task) => {
      if (task.unlock_trigger === 'date' && task.unlock_condition?.date) {
        const unlockDate = parseISO(task.unlock_condition.date as string);
        // Check if it's December and the day matches
        return unlockDate.getMonth() === 11 && unlockDate.getDate() === day;
      }
      return task.order_index === day - 1;
    });
  };

  const getDayStatus = (day: number): 'locked' | 'unlocked' | 'completed' => {
    const task = getTaskForDay(day);
    if (!task) return 'locked';
    const completed = isTaskCompleted(task.id);
    if (completed) return 'completed';
    const unlocked = isTaskUnlocked(task);
    if (unlocked) return 'unlocked';
    return 'locked';
  };

  return (
    <div>
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-cream mb-2">{t('yourAdventCalendar')}</h2>
        <p className="text-cream/90 text-lg">{t('openDoors')}</p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {calendarDays.map((day) => {
          const task = getTaskForDay(day);
          const status = getDayStatus(day);
          const today = getTestDate();
          const isToday = today.getDate() === day && today.getMonth() === 11;

          return (
            <div
              key={day}
              onClick={() => {
                if (task && (status === 'unlocked' || status === 'completed')) {
                  onTaskClick(task);
                }
              }}
              className={`
                aspect-square rounded-lg p-4 flex flex-col items-center justify-center
                transition-all cursor-pointer relative
                ${
                  status === 'locked'
                    ? 'bg-gray-200 border-2 border-gray-300 cursor-not-allowed opacity-60'
                    : status === 'completed'
                      ? 'bg-green-100 border-2 border-green-400 hover:bg-green-200'
                      : 'bg-christmas-red border-2 border-christmas-red hover:bg-red-600 hover:scale-105'
                }
                ${isToday && status !== 'locked' ? 'ring-4 ring-christmas-gold' : ''}
              `}
            >
              {status === 'locked' ? (
                <>
                  <Lock className="w-8 h-8 text-gray-500 mb-2" />
                  <span className="text-lg font-bold text-gray-600">{day}</span>
                </>
              ) : status === 'completed' ? (
                <>
                  <CheckCircle className="w-8 h-8 text-green-600 mb-2" />
                  <span className="text-lg font-bold text-green-700">{day}</span>
                </>
              ) : (
                <>
                  <Gift className="w-8 h-8 text-white mb-2" />
                  <span className="text-lg font-bold text-white">{day}</span>
                  {isToday && (
                    <span className="absolute -top-1 -right-1 bg-christmas-gold text-white text-xs px-2 py-0.5 rounded-full font-bold">
                      {t('today')}
                    </span>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 card">
        <h3 className="font-semibold text-forest-dark mb-4">{t('doorStatus')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 border-2 border-gray-300 rounded"></div>
            <span className="text-forest-dark">{t('stillLocked')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-christmas-red border-2 border-christmas-red rounded"></div>
            <span className="text-forest-dark">{t('readyToOpen')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-100 border-2 border-green-400 rounded"></div>
            <span className="text-forest-dark">{t('completedWellDone')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

