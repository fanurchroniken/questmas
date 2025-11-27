import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift, ArrowRight, Key } from 'lucide-react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function AccessCalendar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!code.trim()) {
      setError(t('pleaseEnterCode') || 'Please enter an invitation code');
      return;
    }

    // Navigate to the quest view using the share code
    navigate(`/q/${code.trim().toUpperCase()}`);
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
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="card text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-luxury-gold to-gold-light rounded-full mb-6">
              <Key className="w-10 h-10 text-forest-dark" />
            </div>
            <h1 className="text-4xl font-heading font-bold text-forest-dark mb-4">
              {t('accessCalendar') || 'Access a Calendar'}
            </h1>
            <p className="text-lg text-forest-dark/80">
              {t('enterInvitationCode') || 'Enter the invitation code you received to access your Christmas calendar'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="code" className="block text-sm font-semibold text-forest-dark mb-2 text-left">
                {t('invitationCode') || 'Invitation Code'}
              </label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder={t('enterCodePlaceholder') || 'e.g., ABC123'}
                className="input text-center text-2xl font-mono tracking-widest uppercase"
                autoFocus
              />
              {error && (
                <p className="mt-2 text-sm text-red-600 text-left">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="btn-cta w-full flex items-center justify-center gap-2 text-lg py-4"
            >
              <span>{t('accessCalendar') || 'Access Calendar'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-cream-dark/20">
            <p className="text-sm text-forest-dark/70 mb-4">
              {t('dontHaveCode') || "Don't have an invitation code?"}
            </p>
            <Link
              to="/"
              className="btn-secondary inline-flex items-center gap-2"
            >
              {t('backToHome') || 'Back to Home'}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

