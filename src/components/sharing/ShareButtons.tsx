import { Facebook, Twitter, Linkedin, Mail, Link2, Copy } from 'lucide-react';
import { useState } from 'react';
import QRCode from 'qrcode';
import { useTranslation } from 'react-i18next';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  personalizedMessage?: string; // Optional personalized greeting message
}

export function ShareButtons({ url, title, description, personalizedMessage }: ShareButtonsProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  // Use personalized message if provided, otherwise use default
  const shareText = personalizedMessage || (description ? `${title} - ${description}` : title);
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(shareText);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: personalizedMessage || description || title,
          url,
        });
      } catch (error) {
        // User cancelled or error occurred
        console.error('Share failed:', error);
      }
    }
  };

  const handleShowQR = async () => {
    if (!showQR) {
      try {
        const dataUrl = await QRCode.toDataURL(url, {
          width: 256,
          margin: 2,
        });
        setQrCodeDataUrl(dataUrl);
        setShowQR(true);
      } catch (error) {
        console.error('Failed to generate QR code:', error);
      }
    } else {
      setShowQR(false);
    }
  };

  // For email, include the personalized message in the body
  const emailBody = personalizedMessage 
    ? `${encodeURIComponent(personalizedMessage)}\n\n${url}`
    : `${encodedText}\n\n${url}`;

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodedText}&body=${emailBody}`,
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {navigator.share && (
          <button
            onClick={handleShare}
            className="btn-primary flex items-center gap-2"
            title={t('shareTitle')}
          >
            <Link2 className="w-4 h-4" />
            {t('share')}
          </button>
        )}
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary flex items-center gap-2"
          title={t('shareOnFacebook')}
        >
          <Facebook className="w-4 h-4" />
          Facebook
        </a>
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary flex items-center gap-2"
          title={t('shareOnTwitter')}
        >
          <Twitter className="w-4 h-4" />
          Twitter
        </a>
        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary flex items-center gap-2"
          title={t('shareOnLinkedIn')}
        >
          <Linkedin className="w-4 h-4" />
          LinkedIn
        </a>
        <a
          href={shareLinks.email}
          className="btn-secondary flex items-center gap-2"
          title={t('shareViaEmail')}
        >
          <Mail className="w-4 h-4" />
          Email
        </a>
        <button
          onClick={handleCopyLink}
          className={`btn-secondary flex items-center gap-2 ${copied ? 'bg-green-100' : ''}`}
          title={t('copyLink')}
        >
          <Copy className="w-4 h-4" />
          {copied ? t('copied') : t('copyLink')}
        </button>
        <button
          onClick={handleShowQR}
          className="btn-secondary flex items-center gap-2"
          title={t('showQRCode')}
        >
          <Link2 className="w-4 h-4" />
          {t('qrCode')}
        </button>
      </div>

      {showQR && qrCodeDataUrl && (
        <div className="card text-center">
          <h3 className="font-semibold text-deep-teal mb-4">{t('qrCode')}</h3>
          <img src={qrCodeDataUrl} alt={t('qrCode')} className="mx-auto mb-4" />
          <p className="text-sm text-stormy-sky">{t('scanToAccess')}</p>
        </div>
      )}
    </div>
  );
}

