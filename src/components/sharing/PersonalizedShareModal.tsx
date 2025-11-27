import { useState } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { generatePersonalizedGreeting } from '@/lib/utils/personalizedGreeting';
import { ShareButtons } from './ShareButtons';

interface PersonalizedShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
  description?: string;
  sharerName: string;
  isChristmasCalendar?: boolean;
}

export function PersonalizedShareModal({
  isOpen,
  onClose,
  url,
  title,
  description,
  sharerName,
  isChristmasCalendar = true,
}: PersonalizedShareModalProps) {
  const { t } = useTranslation();
  const [recipientName, setRecipientName] = useState('');
  const [personalizedMessage, setPersonalizedMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerateMessage = () => {
    if (recipientName.trim()) {
      const message = generatePersonalizedGreeting(
        recipientName.trim(),
        sharerName,
        title,
        isChristmasCalendar
      );
      setPersonalizedMessage(message);
    }
  };

  const handleClose = () => {
    setRecipientName('');
    setPersonalizedMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-deep-teal">{t('personalizedShare')}</h2>
          <button
            onClick={handleClose}
            className="text-stormy-sky hover:text-deep-teal transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label htmlFor="recipientName" className="block text-sm font-medium text-deep-teal mb-2">
              {t('recipientName')}
            </label>
            <input
              id="recipientName"
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder={t('recipientNamePlaceholder')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-teal focus:border-transparent"
            />
            <p className="mt-2 text-sm text-stormy-sky">{t('recipientNameHint')}</p>
          </div>

          {!personalizedMessage && (
            <button
              onClick={handleGenerateMessage}
              disabled={!recipientName.trim()}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('generatePersonalizedMessage')}
            </button>
          )}

          {personalizedMessage && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-deep-teal mb-2">{t('personalizedMessage')}:</p>
                <p className="text-stormy-sky whitespace-pre-wrap">{personalizedMessage}</p>
              </div>

              <div>
                <ShareButtons
                  url={url}
                  title={title}
                  description={description}
                  personalizedMessage={personalizedMessage}
                />
              </div>

              <button
                onClick={() => {
                  setRecipientName('');
                  setPersonalizedMessage(null);
                }}
                className="btn-secondary w-full"
              >
                {t('createAnotherMessage')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

