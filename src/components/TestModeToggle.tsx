import { useTestMode } from '@/contexts/TestModeContext';
import { TestTube } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function TestModeToggle() {
  const { t } = useTranslation();
  const { isTestMode, toggleTestMode } = useTestMode();

  return (
    <div className="fixed bottom-4 right-4 bg-white border-2 border-yellow-400 rounded-lg shadow-lg p-4 z-50">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <TestTube className="w-5 h-5 text-yellow-600" />
          <h3 className="font-semibold text-deep-teal">{t('testMode')}</h3>
        </div>
        <button
          onClick={toggleTestMode}
          className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
            isTestMode
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {isTestMode ? t('on') : t('off')}
        </button>
      </div>
      {isTestMode && (
        <p className="text-xs text-stormy-sky mt-2">
          {t('testModeDescription') || 'All calendar doors are unlocked for testing'}
        </p>
      )}
    </div>
  );
}

