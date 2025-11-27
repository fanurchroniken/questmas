import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getQuestByShareCode, getQuestTasks, type Quest, type Task } from '@/lib/services/questService';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, Gift, Users, Clock, ArrowRight, LogIn } from 'lucide-react';
import { format } from 'date-fns';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

export default function QuestView() {
  const { t } = useTranslation();
  const { shareCode } = useParams<{ shareCode: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quest, setQuest] = useState<Quest | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (shareCode) {
      loadQuest();
    }
  }, [shareCode]);

  const loadQuest = async () => {
    if (!shareCode) return;
    setLoading(true);
    try {
      const questData = await getQuestByShareCode(shareCode);
      if (questData) {
        setQuest(questData);
        const tasksData = await getQuestTasks(questData.id);
        setTasks(tasksData);
      }
    } catch (error) {
      console.error('Error loading quest:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuest = () => {
    if (!quest) return;

    if (quest.requires_auth && !user) {
      navigate('/login', { state: { returnTo: `/q/${shareCode}` } });
      return;
    }

    navigate(`/quest/${quest.id}/participate`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-forest-dark flex items-center justify-center">
        <div className="text-stormy-sky">{t('loading')}</div>
      </div>
    );
  }

  if (!quest) {
    return (
      <div className="min-h-screen bg-forest-dark flex items-center justify-center">
        <div className="card text-center">
          <h1 className="text-2xl font-bold text-deep-teal mb-4">{t('questNotFound')}</h1>
          <p className="text-stormy-sky mb-4">{t('questNotAvailable')}</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            {t('goHome')}
          </button>
        </div>
      </div>
    );
  }

  const isChristmasCalendar = quest.quest_type === 'christmas_calendar';
  const taskCount = tasks.length;
  const recipientFirstName = quest.theme_config?.recipient_first_name as string | undefined;

  return (
    <div className="min-h-screen bg-forest-dark">
      <nav className="bg-cream shadow-sm border-b border-cream-dark/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Gift className="w-8 h-8 text-deep-teal" />
              <span className="text-xl font-primary font-bold bg-gradient-to-r from-christmas-red to-christmas-green bg-clip-text text-transparent">
                Questmas
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {recipientFirstName && (
          <div className="card mb-6 bg-gradient-to-r from-christmas-red/10 to-christmas-green/10 border-2 border-christmas-gold/30">
            <div className="text-center py-4">
              <h2 className="text-2xl font-bold text-deep-teal mb-2">
                {t('personalizedGreeting.hello', { name: recipientFirstName })} 🎄
              </h2>
              <p className="text-stormy-sky">
                {t('personalizedGreeting.welcomeMessage')}
              </p>
            </div>
          </div>
        )}
        <div className="card mb-8">
          <div className="text-center mb-8">
            {isChristmasCalendar && (
              <div className="inline-flex items-center justify-center w-20 h-20 bg-christmas-red rounded-full mb-4">
                <Gift className="w-10 h-10 text-white" />
              </div>
            )}
            <h1 className="text-4xl font-bold text-deep-teal mb-4">{quest.title}</h1>
            {quest.description && (
              <p className="text-lg text-stormy-sky max-w-2xl mx-auto">{quest.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-deep-teal rounded-full mb-3">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-deep-teal">{taskCount}</div>
              <div className="text-sm text-stormy-sky">
                {isChristmasCalendar ? t('doors') : t('tasks')}
              </div>
            </div>

            {quest.start_date && (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-sunset-orange rounded-full mb-3">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="text-sm font-semibold text-deep-teal">
                  {format(new Date(quest.start_date), 'MMM d')}
                </div>
                <div className="text-sm text-stormy-sky">{t('startDate')}</div>
              </div>
            )}

            {quest.end_date && (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-pirate-gold rounded-full mb-3">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <div className="text-sm font-semibold text-deep-teal">
                  {format(new Date(quest.end_date), 'MMM d')}
                </div>
                <div className="text-sm text-stormy-sky">{t('endDate')}</div>
              </div>
            )}
          </div>

          {isChristmasCalendar && (
            <div className="bg-gradient-to-r from-christmas-red to-christmas-green border-2 border-christmas-gold rounded-lg p-6 mb-8 text-center">
              <p className="text-lg font-semibold text-white mb-2">{t('adventCalendarAwaits')}</p>
              <p className="text-sm text-white text-opacity-95">
                {t('adventCalendarDescription')}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={handleStartQuest} className="btn-cta text-lg px-8 py-3 flex items-center justify-center gap-2">
              {quest.requires_auth && !user ? (
                <>
                  <LogIn className="w-5 h-5" />
                  {t('signInToStart')}
                </>
              ) : (
                <>
                  <ArrowRight className="w-5 h-5" />
                  {isChristmasCalendar ? t('startAdventCalendar') : t('startQuest')}
                </>
              )}
            </button>
          </div>
        </div>

        {quest.requires_auth && !user && (
          <div className="card bg-yellow-50 border border-yellow-200">
            <p className="text-sm text-yellow-700 text-center">
              {t('requiresAuth')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

