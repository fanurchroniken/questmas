import { useTestMode } from '@/contexts/TestModeContext';
import { TestTube, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function TestModeToggle() {
  const { t } = useTranslation();
  const { isTestMode, testDateOffset, toggleTestMode, setTestDateOffset, getTestDate } = useTestMode();

  const testDate = getTestDate();
  const isDecember = testDate.getMonth() === 11; // December is month 11
  const decemberDay = isDecember ? testDate.getDate() : null;

  return (
    <div className="fixed bottom-4 right-4 bg-white border-2 border-yellow-400 rounded-lg shadow-lg p-4 z-50 max-w-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TestTube className="w-5 h-5 text-yellow-600" />
          <h3 className="font-semibold text-deep-teal">{t('testMode')}</h3>
        </div>
        <button
          onClick={toggleTestMode}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            isTestMode
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {isTestMode ? t('on') : t('off')}
        </button>
      </div>

      {isTestMode && (
        <div className="space-y-3">
          <div className="text-sm">
            <p className="text-stormy-sky mb-1">{t('simulatedDate')}</p>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-deep-teal" />
              <span className="font-medium text-deep-teal">
                {testDate.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
            {isDecember && decemberDay && (
              <p className="text-xs text-green-600 mt-1">
                {t('decemberDayUnlocked', { day: decemberDay })}
              </p>
            )}
            {!isDecember && (
              <p className="text-xs text-yellow-600 mt-1">
                {t('notInDecember')}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs text-stormy-sky mb-1">
              {t('daysFromToday', { offset: testDateOffset > 0 ? `+${testDateOffset}` : testDateOffset })}
            </label>
            <input
              type="range"
              min="-365"
              max="365"
              value={testDateOffset}
              onChange={(e) => setTestDateOffset(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-stormy-sky mt-1">
              <span>{t('oneYear')}</span>
              <span>{t('todayLabel')}</span>
              <span>{t('plusOneYear')}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                // Set to December 1st of current year
                const dec1 = new Date(new Date().getFullYear(), 11, 1);
                const today = new Date();
                const diffDays = Math.ceil((dec1.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                setTestDateOffset(diffDays);
              }}
              className="btn-secondary text-xs py-1 px-2 flex-1"
            >
              {t('dec1')}
            </button>
            <button
              onClick={() => {
                // Set to December 24th of current year
                const dec24 = new Date(new Date().getFullYear(), 11, 24);
                const today = new Date();
                const diffDays = Math.ceil((dec24.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                setTestDateOffset(diffDays);
              }}
              className="btn-secondary text-xs py-1 px-2 flex-1"
            >
              {t('dec24')}
            </button>
            <button
              onClick={() => setTestDateOffset(0)}
              className="btn-secondary text-xs py-1 px-2 flex-1"
            >
              {t('todayLabel')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

