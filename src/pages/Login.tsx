import { LoginForm } from '@/components/auth/LoginForm';
import { Gift } from 'lucide-react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

export default function Login() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-forest-dark px-4">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-md">
        <div className="card">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-deep-teal rounded-full mb-4">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-deep-teal mb-2">{t('welcomeBack')}</h1>
            <p className="text-stormy-sky">{t('signInToContinue')}</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

