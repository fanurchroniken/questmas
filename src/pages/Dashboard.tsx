import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Plus, Gift, Edit, Eye, Share2, Calendar, BarChart3, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getUserQuests, deleteQuest, type Quest } from '@/lib/services/questService';
import { format } from 'date-fns';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const { t } = useTranslation();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingQuestId, setDeletingQuestId] = useState<string | null>(null);

  useEffect(() => {
    loadQuests();
  }, []);

  const loadQuests = async () => {
    try {
      const data = await getUserQuests();
      setQuests(data);
    } catch (error) {
      console.error('Error loading quests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getShareUrl = (quest: Quest) => {
    if (quest.share_code) {
      return `${window.location.origin}/q/${quest.share_code}`;
    }
    return '';
  };

  const handleDelete = async (quest: Quest) => {
    if (!user || quest.creator_id !== user.id) {
      alert('You do not have permission to delete this quest.');
      return;
    }

    const confirmMessage = quest.status === 'published'
      ? 'Are you sure you want to delete this published quest? This action cannot be undone and all participants will lose access.'
      : 'Are you sure you want to delete this quest? This action cannot be undone.';

    if (!confirm(confirmMessage)) return;

    setDeletingQuestId(quest.id);
    try {
      await deleteQuest(quest.id);
      // Remove quest from list
      setQuests(quests.filter((q) => q.id !== quest.id));
    } catch (error) {
      console.error('Error deleting quest:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete quest. Please try again.';
      alert(errorMessage);
    } finally {
      setDeletingQuestId(null);
    }
  };

  return (
    <div className="min-h-screen bg-forest-dark">
      <nav className="bg-cream shadow-sm border-b border-cream-dark/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Gift className="w-8 h-8 text-forest-dark" />
              <span className="text-xl font-primary font-bold bg-gradient-to-r from-christmas-red to-christmas-green bg-clip-text text-transparent">
                Questmas
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <span className="text-forest-dark">{user?.email}</span>
              <button
                onClick={() => signOut()}
                className="btn-secondary flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                {t('logout')}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-cream mb-2">{t('yourQuests')}</h1>
          <p className="text-cream/90">{t('createAndManage')}</p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-cream">{t('loading')}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              to="/quests/new"
              className="card hover:shadow-lg transition-shadow cursor-pointer border-2 border-dashed border-stormy-sky flex flex-col items-center justify-center min-h-[200px] text-center"
            >
              <Plus className="w-12 h-12 text-forest-dark/70 mb-4" />
              <h3 className="text-xl font-semibold text-forest-dark mb-2">{t('createNewQuestCard')}</h3>
              <p className="text-forest-dark/80">{t('startBuilding')}</p>
            </Link>

            {quests.map((quest) => (
              <div key={quest.id} className="card hover:shadow-lg transition-shadow overflow-hidden">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold text-forest-dark mb-1 truncate">{quest.title}</h3>
                    {quest.description && (
                      <p className="text-sm text-forest-dark/80 line-clamp-2">{quest.description}</p>
                    )}
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full flex-shrink-0 ml-2 ${
                      quest.status === 'published'
                        ? 'bg-green-100 text-green-700'
                        : quest.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {quest.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-forest-dark/70 mb-4 flex-wrap">
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-shrink-0">
                    {quest.created_at && format(new Date(quest.created_at), 'MMM d, yyyy')}
                  </span>
                  {quest.quest_type === 'christmas_calendar' && (
                    <span className="px-2 py-0.5 bg-christmas-red text-white rounded flex-shrink-0">
                      {t('christmasCalendar')}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Link
                      to={`/quests/${quest.id}/edit`}
                      className="btn-secondary flex-1 flex items-center justify-center gap-2 text-sm w-full sm:w-auto"
                    >
                      <Edit className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{t('edit')}</span>
                    </Link>
                    {quest.status === 'published' && quest.share_code && (
                      <Link
                        to={`/q/${quest.share_code}`}
                        target="_blank"
                        className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm w-full sm:w-auto"
                      >
                        <Eye className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{t('view')}</span>
                      </Link>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    {quest.status === 'published' && quest.share_code && (
                      <Link
                        to={`/quests/${quest.id}/analytics`}
                        className="btn-secondary flex-1 flex items-center justify-center gap-2 text-sm w-full sm:w-auto"
                      >
                        <BarChart3 className="w-4 h-4" />
                        <span>{t('analytics') || 'Analytics'}</span>
                      </Link>
                    )}
                    <button
                      onClick={() => handleDelete(quest)}
                      disabled={deletingQuestId === quest.id}
                      className={`btn-secondary flex items-center justify-center gap-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 disabled:opacity-50 w-full sm:w-auto ${quest.status === 'published' && quest.share_code ? 'flex-1' : ''}`}
                      title={t('delete')}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>{deletingQuestId === quest.id ? t('loading') : t('delete')}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {quests.length === 0 && (
              <div className="col-span-full card text-center py-12">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-forest-dark/50" />
                <p className="text-forest-dark/80">{t('noQuestsYet')}</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

