import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, Upload, X, Share2, Instagram, Linkedin, Twitter, Facebook, MessageCircle, Edit2 } from 'lucide-react';

interface PhotoUploadProps {
  onPhotoUploaded: (photoUrl: string) => void;
  questTitle?: string;
  taskTitle?: string;
  loading?: boolean;
}

export function PhotoUpload({
  onPhotoUploaded,
  questTitle,
  taskTitle,
  loading,
}: PhotoUploadProps) {
  const { i18n, t } = useTranslation();
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showEditTextModal, setShowEditTextModal] = useState(false);
  const [customFoundMessage, setCustomFoundMessage] = useState<string | null>(null);
  const [previewWatermarkedUrl, setPreviewWatermarkedUrl] = useState<string | null>(null);
  const [isUpdatingPreview, setIsUpdatingPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be less than 10MB');
      return;
    }

    setError(null);
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setPhoto(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const [showCamera, setShowCamera] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleCameraCapture = () => {
    // Check if we're on HTTPS (required for camera access on mobile)
    const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    if (!isSecure) {
      setError('Camera access requires HTTPS. Please use file upload or enable HTTPS for your site.');
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Camera not available in this browser. Please use file upload instead.');
      return;
    }

    setShowCamera(true);
    setError(null);
    
    // Request camera with more flexible constraints for better mobile compatibility
    navigator.mediaDevices
      .getUserMedia({ 
        video: { 
          facingMode: 'user', // Use front camera on mobile
          // More flexible constraints for better compatibility
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 }
        } 
      })
      .then((stream) => {
        streamRef.current = stream;
        setVideoReady(false);
        // Use a small delay to ensure video element is ready
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch((playErr) => {
              console.error('Error playing video:', playErr);
              setError('Could not start camera preview. Please try again.');
              setShowCamera(false);
              setVideoReady(false);
              if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
                streamRef.current = null;
              }
            });
          }
        }, 100);
      })
      .catch((err) => {
        console.error('Error accessing camera:', err);
        setShowCamera(false);
        
        // Provide more specific error messages
        let errorMessage = 'Could not access camera. ';
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          errorMessage += 'Please allow camera access in your browser settings and try again.';
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          errorMessage += 'No camera found on this device.';
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          errorMessage += 'Camera is being used by another application.';
        } else if (err.name === 'OverconstrainedError' || err.name === 'ConstraintNotSatisfiedError') {
          errorMessage += 'Camera does not support the requested settings.';
        } else {
          errorMessage += 'Please use file upload instead.';
        }
        
        setError(errorMessage);
      });
  };

  const capturePhoto = () => {
    if (!videoRef.current || !streamRef.current) {
      setError('Camera not ready. Please wait a moment and try again.');
      return;
    }

    const videoWidth = videoRef.current.videoWidth;
    const videoHeight = videoRef.current.videoHeight;

    // Check if video has valid dimensions
    if (!videoWidth || !videoHeight || videoWidth === 0 || videoHeight === 0) {
      setError('Video not ready yet. Please wait a moment and try again.');
      return;
    }

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setError('Could not create canvas. Please try again.');
        return;
      }

      // Maintain 9:16 aspect ratio for portrait mode
      const targetAspectRatio = 9 / 16; // Portrait 9:16
      
      let width = videoWidth;
      let height = videoHeight;
      let sourceX = 0;
      let sourceY = 0;
      let sourceWidth = videoWidth;
      let sourceHeight = videoHeight;
      
      // Calculate dimensions to maintain 9:16 aspect ratio
      const currentAspectRatio = videoWidth / videoHeight;
      
      if (currentAspectRatio > targetAspectRatio) {
        // Video is wider than 9:16, crop width
        sourceWidth = videoHeight * targetAspectRatio;
        sourceX = (videoWidth - sourceWidth) / 2;
        width = sourceWidth;
        height = videoHeight;
      } else {
        // Video is taller than 9:16, crop height
        sourceHeight = videoWidth / targetAspectRatio;
        sourceY = (videoHeight - sourceHeight) / 2;
        width = videoWidth;
        height = sourceHeight;
      }
      
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(videoRef.current, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, width, height);

      // Stop the camera stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setVideoReady(false);

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
          setPhotoFile(file);
          setPhoto(canvas.toDataURL('image/jpeg'));
          setShowCamera(false);
          setError(null);
        } else {
          setError('Failed to capture photo. Please try again.');
        }
      }, 'image/jpeg', 0.9);
    } catch (err) {
      console.error('Error capturing photo:', err);
      setError('Failed to capture photo. Please try again.');
    }
  };

  const cancelCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
    setVideoReady(false);
  };

  const getRandomFoundMessage = (): string => {
    const currentLang = i18n.language || 'en';
    const langCode = currentLang.split('-')[0]; // Get 'en' from 'en-US'
    
    const messagesByLang: Record<string, string[]> = {
      en: [
        '🎯 Found it! Mission accomplished!',
        '🎄 Treasure located! Christmas magic activated!',
        '✅ Quest complete! I am the champion!',
        '🎁 Found the spot! Santa would be proud!',
        '🔍 Mystery solved! Location discovered!',
        '🎅 I found it! The elves would be jealous!',
        '✨ Mission success! Christmas quest complete!',
        '🏆 Victory! I found the hidden treasure!',
        '🎪 Found it! The hunt is over!',
        '🎨 Location unlocked! Achievement unlocked!',
        '🎭 Mystery location found! Case closed!',
        '🎬 Scene found! Action!',
        '🎸 Rock star location discovered!',
        '🎯 Bullseye! Found the target!',
        '🎲 Lucky find! The dice were in my favor!',
      ],
      de: [
        '🎯 Gefunden! Mission erfüllt!',
        '🎄 Schatz gefunden! Weihnachtsmagie aktiviert!',
        '✅ Quest abgeschlossen! Ich bin der Champion!',
        '🎁 Der Ort gefunden! Der Weihnachtsmann wäre stolz!',
        '🔍 Rätsel gelöst! Location entdeckt!',
        '🎅 Ich hab\'s gefunden! Die Elfen wären neidisch!',
        '✨ Mission erfolgreich! Weihnachtsquest abgeschlossen!',
        '🏆 Sieg! Ich habe den versteckten Schatz gefunden!',
        '🎪 Gefunden! Die Jagd ist vorbei!',
        '🎨 Location freigeschaltet! Erfolg freigeschaltet!',
        '🎭 Geheimnisvoller Ort gefunden! Fall abgeschlossen!',
        '🎬 Szene gefunden! Action!',
        '🎸 Rockstar-Location entdeckt!',
        '🎯 Volltreffer! Das Ziel gefunden!',
        '🎲 Glücksfund! Die Würfel waren auf meiner Seite!',
      ],
    };
    
    const messages = messagesByLang[langCode] || messagesByLang.en;
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const getFoundMessage = (): string => {
    return customFoundMessage || getRandomFoundMessage();
  };

  const addWatermark = (imageUrl: string, customMessage?: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Calculate font sizes based on image dimensions
        const baseFontSize = Math.max(24, canvas.width / 30);
        const mediumFontSize = Math.max(20, canvas.width / 35);
        const smallFontSize = Math.max(16, canvas.width / 45);
        const padding = Math.max(20, canvas.width / 50);

        // Use the custom message parameter if provided and not empty, otherwise use random
        // The caller should always pass the message they want to use
        const foundMessage = (customMessage && customMessage.trim()) 
          ? customMessage.trim() 
          : getRandomFoundMessage();

        // Add semi-transparent background for watermark area (taller for the message)
        const watermarkHeight = baseFontSize * 4.5 + padding * 2;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, canvas.height - watermarkHeight, canvas.width, watermarkHeight);

        // Add gradient overlay for better text visibility
        const gradient = ctx.createLinearGradient(0, canvas.height - watermarkHeight, 0, canvas.height);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, canvas.height - watermarkHeight, canvas.width, watermarkHeight);

        // Add main branding text
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `bold ${baseFontSize}px Poppins, sans-serif`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        let yPos = canvas.height - padding;
        
        // Add hashtags at the bottom
        ctx.font = `bold ${smallFontSize}px Poppins, sans-serif`;
        const hashtags = '#Questmas #ChristmasCalendar #Adventure';
        ctx.fillText(hashtags, padding, yPos);
        yPos -= smallFontSize + 8;

        // Add quest title if available
        if (questTitle) {
          ctx.font = `${smallFontSize}px Poppins, sans-serif`;
          ctx.fillText(questTitle, padding, yPos);
          yPos -= smallFontSize + 8;
        }

        // Add random funny "found it" message (prominent)
        ctx.fillStyle = '#FFD700'; // Gold color for emphasis
        ctx.font = `bold ${mediumFontSize}px Poppins, sans-serif`;
        ctx.fillText(foundMessage, padding, yPos);
        yPos -= mediumFontSize + 12;

        // Add main branding text at top of watermark area
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `bold ${baseFontSize}px Poppins, sans-serif`;
        ctx.fillText('🎄 Questmas', padding, yPos);

        // Add decorative border
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = Math.max(3, canvas.width / 200);
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              resolve(url);
            } else {
              reject(new Error('Failed to create blob'));
            }
          },
          'image/jpeg',
          0.9
        );
      };
      img.onerror = reject;
      img.src = imageUrl;
    });
  };

  const handleEditText = async () => {
    if (!photo) return;
    
    // Initialize with random message if no custom message set
    if (!customFoundMessage) {
      setCustomFoundMessage(getRandomFoundMessage());
    }
    
    // Generate preview
    try {
      const messageToUse = (customFoundMessage && customFoundMessage.trim()) 
        ? customFoundMessage.trim() 
        : getRandomFoundMessage();
      const previewUrl = await addWatermark(photo, messageToUse);
      setPreviewWatermarkedUrl(previewUrl);
      setShowEditTextModal(true);
    } catch (err) {
      console.error('Error generating preview:', err);
      setError('Failed to generate preview. Please try again.');
    }
  };

  // Auto-generate watermarked preview when photo is first loaded
  useEffect(() => {
    if (photo && !previewWatermarkedUrl && !showEditTextModal) {
      const generateInitialPreview = async () => {
        try {
          const messageToUse = (customFoundMessage && customFoundMessage.trim()) 
            ? customFoundMessage.trim() 
            : getRandomFoundMessage();
          const previewUrl = await addWatermark(photo, messageToUse);
          setPreviewWatermarkedUrl(previewUrl);
          // Set the message if not already set
          if (!customFoundMessage) {
            setCustomFoundMessage(messageToUse);
          }
        } catch (err) {
          console.error('Error generating initial preview:', err);
        }
      };
      generateInitialPreview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photo]);

  const handleUpdatePreview = useCallback(async () => {
    if (!photo) return;
    
    // Use custom message if available, otherwise use random
    const messageToUse = (customFoundMessage && customFoundMessage.trim()) 
      ? customFoundMessage.trim() 
      : getRandomFoundMessage();
    
    setIsUpdatingPreview(true);
    try {
      const previewUrl = await addWatermark(photo, messageToUse);
      setPreviewWatermarkedUrl((oldUrl) => {
        // Revoke old preview URL
        if (oldUrl) {
          URL.revokeObjectURL(oldUrl);
        }
        return previewUrl;
      });
      // Set cursor to end after update
      setTimeout(() => {
        if (textareaRef.current && customFoundMessage) {
          const length = customFoundMessage.length;
          textareaRef.current.setSelectionRange(length, length);
          textareaRef.current.focus();
        }
      }, 0);
    } catch (err) {
      console.error('Error updating preview:', err);
    } finally {
      setIsUpdatingPreview(false);
    }
  }, [photo, customFoundMessage]);

  // Update preview only when explicitly requested (not automatically on text change)

  const handleComplete = async () => {
    if (!photo) return;

    setUploading(true);
    setError(null);

    try {
      // Add watermark to photo with custom message
      const messageToUse = (customFoundMessage && customFoundMessage.trim()) 
        ? customFoundMessage.trim() 
        : getRandomFoundMessage();
      const watermarkedUrl = await addWatermark(photo, messageToUse);

      // Convert watermarked image to data URL for storage
      const response = await fetch(watermarkedUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        // Store the watermarked photo as data URL
        onPhotoUploaded(dataUrl);
        setPhoto(null);
        setPhotoFile(null);
        setUploading(false);
      };
      
      reader.onerror = () => {
        setError('Failed to process photo. Please try again.');
        setUploading(false);
      };
      
      reader.readAsDataURL(blob);
      
      // Clean up
      URL.revokeObjectURL(watermarkedUrl);
    } catch (err) {
      console.error('Error processing photo:', err);
      setError('Failed to process photo. Please try again.');
      setUploading(false);
    }
  };

  const getViralMessage = (platform: 'linkedin' | 'instagram' | 'general' = 'general'): string => {
    if (platform === 'linkedin') {
      return `🎄 I just completed a Questmas challenge! 🎄

${taskTitle ? `Today's challenge: ${taskTitle}` : 'Another day, another adventure!'}

${questTitle ? `Quest: ${questTitle}` : 'Join the quest!'}

This interactive Christmas calendar experience combines real-world exploration with digital challenges. Each day unlocks a new location-based quest that takes you on an adventure in your city.

Perfect for:
✨ Team building activities
✨ Community engagement
✨ Holiday marketing campaigns
✨ Family fun and bonding

Who else is up for the challenge? 🎯

#Questmas #ChristmasCalendar #Adventure #TeamBuilding #CommunityEngagement #HolidayMarketing #InteractiveExperience #DigitalInnovation #Christmas2024 #LocationBased #Gamification`;
    }

    if (platform === 'instagram') {
      // Instagram-optimized message (shorter, more emojis, hashtags at the end)
      return `🎄✨ Just completed a Questmas challenge! ✨🎄

${taskTitle ? `Challenge: ${taskTitle}` : 'Another day, another adventure!'}

${questTitle ? `Quest: ${questTitle}` : 'Join the quest!'}

This is SO fun! 🔥 Each day unlocks a new location-based challenge. It's like a treasure hunt meets Christmas calendar! 

Who's joining me? 👇

#Questmas #ChristmasCalendar #Adventure #QuestChallenge #HolidayFun #Christmas2024 #LocationBased #Gamification #InteractiveExperience #ViralChallenge #ChristmasAdventure #DailyChallenge #ExploreYourCity #HolidayVibes #ChristmasQuest #AdventureTime #HolidayAdventure`;
    }

    // General/viral message for Twitter, Facebook, etc.
    return `🎄✨ I just completed a Questmas challenge! ✨🎄

${taskTitle ? `Challenge: ${taskTitle}` : 'Another day, another adventure!'}

${questTitle ? `Quest: ${questTitle}` : 'Join the quest!'}

This is SO fun! 🔥 Each day unlocks a new location-based challenge that takes you on an adventure. It's like a treasure hunt meets Christmas calendar! 

Who's joining me? 👇

#Questmas #ChristmasCalendar #Adventure #QuestChallenge #HolidayFun #Christmas2024 #LocationBased #Gamification #InteractiveExperience #ViralChallenge #ChristmasAdventure #DailyChallenge #ExploreYourCity #HolidayVibes`;
  };

  const handleShare = () => {
    if (!photo) return;
    setShowShareModal(true);
  };

  const handleServiceShare = async (service: 'instagram' | 'linkedin' | 'twitter' | 'facebook' | 'native' | 'copy') => {
    if (!photo) return;

    setShowShareModal(false);
    setShowEditTextModal(false);

    try {
      // Create watermarked version for sharing with custom message
      const messageToUse = (customFoundMessage && customFoundMessage.trim()) 
        ? customFoundMessage.trim() 
        : getRandomFoundMessage();
      const watermarkedUrl = await addWatermark(photo, messageToUse);
      const response = await fetch(watermarkedUrl);
      const blob = await response.blob();
      const file = new File([blob], 'questmas-challenge.jpg', { type: 'image/jpeg' });

      // Get appropriate message for service
      let platform: 'instagram' | 'linkedin' | 'general' = 'general';
      if (service === 'instagram') platform = 'instagram';
      else if (service === 'linkedin') platform = 'linkedin';
      
      const shareText = getViralMessage(platform);

      if (service === 'native') {
        // Use native share API
        if (navigator.share) {
          try {
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
              await navigator.share({
                files: [file],
                title: 'Questmas Challenge Completed! 🎄',
                text: shareText,
              });
              return;
            } else {
              await navigator.share({
                title: 'Questmas Challenge Completed! 🎄',
                text: shareText,
              });
              downloadPhoto(file, shareText, platform);
              return;
            }
          } catch (shareError: any) {
            if (shareError.name !== 'AbortError') {
              console.log('Share error:', shareError);
            }
          }
        }
        // Fallback if native share not available
        downloadPhoto(file, shareText, platform);
      } else if (service === 'copy') {
        // Just copy to clipboard and download
        downloadPhoto(file, shareText, platform);
      } else if (service === 'instagram') {
        // Instagram Stories instructions
        downloadPhoto(file, shareText, 'instagram');
        showInstagramStoriesInstructions(shareText);
      } else {
        // Other services - download and copy
        downloadPhoto(file, shareText, platform);
      }
    } catch (err) {
      console.error('Error sharing photo:', err);
      setError('Failed to share photo. Please try again.');
    }
  };

  const showInstagramStoriesInstructions = (shareText: string) => {
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
      background: linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%);
      border-radius: 16px;
      padding: 32px;
      max-width: 500px;
      color: white;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    `;

    const title = document.createElement('h2');
    title.textContent = '📸 Share to Instagram Stories';
    title.style.cssText = 'font-size: 24px; font-weight: bold; margin-bottom: 20px;';

    const steps = document.createElement('div');
    steps.innerHTML = `
      <ol style="margin: 0; padding-left: 20px; line-height: 1.8;">
        <li>Open Instagram app</li>
        <li>Tap the "+" button or swipe right</li>
        <li>Select "Story"</li>
        <li>Tap the photo icon and select the downloaded image</li>
        <li>Add stickers, text, or effects</li>
        <li>Tap "Your Story" to share</li>
        <li style="margin-top: 12px; font-weight: bold;">Paste the caption text (copied to clipboard) in the story!</li>
      </ol>
    `;
    steps.style.cssText = 'margin-bottom: 20px; font-size: 16px;';

    const textarea = document.createElement('textarea');
    textarea.value = shareText;
    textarea.style.cssText = `
      width: 100%;
      min-height: 120px;
      padding: 12px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 8px;
      font-size: 14px;
      font-family: inherit;
      resize: vertical;
      margin-bottom: 16px;
      background: rgba(255, 255, 255, 0.95);
      color: #333;
    `;
    textarea.readOnly = true;

    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'display: flex; gap: 12px;';

    const copyButton = document.createElement('button');
    copyButton.textContent = '📋 Copy Caption';
    copyButton.style.cssText = `
      flex: 1;
      padding: 14px;
      background: white;
      color: #833ab4;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      font-size: 16px;
    `;
    copyButton.onclick = () => {
      textarea.select();
      document.execCommand('copy');
      copyButton.textContent = '✅ Copied!';
      setTimeout(() => {
        copyButton.textContent = '📋 Copy Caption';
      }, 2000);
    };

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Got it!';
    closeButton.style.cssText = `
      flex: 1;
      padding: 14px;
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 2px solid white;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      font-size: 16px;
    `;
    closeButton.onclick = () => {
      document.body.removeChild(modal);
    };

    content.appendChild(title);
    content.appendChild(steps);
    content.appendChild(textarea);
    buttonContainer.appendChild(copyButton);
    buttonContainer.appendChild(closeButton);
    content.appendChild(buttonContainer);
    modal.appendChild(content);
    document.body.appendChild(modal);

    // Auto-select and copy text
    setTimeout(() => {
      textarea.select();
      document.execCommand('copy');
      copyButton.textContent = '✅ Copied!';
      setTimeout(() => {
        copyButton.textContent = '📋 Copy Caption';
      }, 2000);
    }, 100);
  };

  const ShareServiceModal = () => {
    if (!showShareModal) return null;

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-deep-teal">Share Your Quest</h2>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-stormy-sky hover:text-deep-teal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => handleServiceShare('instagram')}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-pink-300 hover:bg-pink-50 transition-colors"
              >
                <Instagram className="w-8 h-8 text-pink-600" />
                <span className="font-semibold text-stormy-sky">Instagram</span>
                <span className="text-xs text-stormy-sky">Stories/Post</span>
              </button>

              <button
                onClick={() => handleServiceShare('linkedin')}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <Linkedin className="w-8 h-8 text-blue-600" />
                <span className="font-semibold text-stormy-sky">LinkedIn</span>
                <span className="text-xs text-stormy-sky">Professional</span>
              </button>

              <button
                onClick={() => handleServiceShare('twitter')}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-sky-300 hover:bg-sky-50 transition-colors"
              >
                <Twitter className="w-8 h-8 text-sky-500" />
                <span className="font-semibold text-stormy-sky">Twitter</span>
                <span className="text-xs text-stormy-sky">Tweet</span>
              </button>

              <button
                onClick={() => handleServiceShare('facebook')}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-blue-400 hover:bg-blue-50 transition-colors"
              >
                <Facebook className="w-8 h-8 text-blue-600" />
                <span className="font-semibold text-stormy-sky">Facebook</span>
                <span className="text-xs text-stormy-sky">Post</span>
              </button>
            </div>

            <div className="border-t border-stormy-sky pt-4 space-y-2">
              <button
                onClick={() => handleServiceShare('native')}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-deep-teal hover:bg-deep-teal hover:text-white transition-colors"
              >
                <Share2 className="w-5 h-5" />
                <span className="font-semibold">Share via System</span>
              </button>

              <button
                onClick={() => handleServiceShare('copy')}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-stormy-sky hover:bg-stormy-sky hover:text-white transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="font-semibold">Copy & Download</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const showSuccessNotification = (platform: 'linkedin' | 'instagram' | 'general') => {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
      color: white;
      padding: 20px 24px;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      z-index: 10001;
      max-width: 350px;
      animation: slideIn 0.3s ease-out;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);

    const platformName = platform === 'linkedin' ? 'LinkedIn' : platform === 'instagram' ? 'Instagram' : 'Social Media';
    
    notification.innerHTML = `
      <div style="display: flex; align-items: start; gap: 12px;">
        <div style="font-size: 24px;">✅</div>
        <div style="flex: 1;">
          <div style="font-weight: 600; font-size: 16px; margin-bottom: 4px;">Photo Downloaded!</div>
          <div style="font-size: 14px; opacity: 0.95;">Viral message copied to clipboard</div>
          <div style="font-size: 13px; opacity: 0.9; margin-top: 4px;">Ready for ${platformName}!</div>
        </div>
        <button style="background: none; border: none; color: white; cursor: pointer; font-size: 20px; padding: 0; line-height: 1;">&times;</button>
      </div>
    `;

    const closeBtn = notification.querySelector('button');
    closeBtn?.addEventListener('click', () => {
      notification.remove();
      style.remove();
    });

    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      notification.remove();
      style.remove();
    }, 5000);
  };

  const downloadPhoto = (file: File, shareText?: string, platform: 'linkedin' | 'instagram' | 'general' = 'general') => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'questmas-challenge.jpg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Copy share text to clipboard if available
    if (shareText && navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(() => {
        // Show success notification (non-blocking)
        showSuccessNotification(platform);
      }).catch(() => {
        // Fallback: show the text in a better format
        showShareTextModal(shareText, platform);
      });
    } else if (shareText) {
      // No clipboard API - show modal
      showShareTextModal(shareText, platform);
    }
  };

  const showShareTextModal = (shareText: string, platform: 'linkedin' | 'instagram' | 'general') => {
    // Create a modal to display the share text
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
      background: white;
      border-radius: 12px;
      padding: 24px;
      max-width: 600px;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    `;

    const title = document.createElement('h2');
    title.textContent = '🚀 Your Viral Share Message';
    title.style.cssText = 'font-size: 24px; font-weight: bold; margin-bottom: 16px; color: #1a5f7a;';

    const platformBadge = document.createElement('div');
    let platformName = '📱 Social Media';
    if (platform === 'linkedin') platformName = '💼 LinkedIn';
    else if (platform === 'instagram') platformName = '📸 Instagram';
    platformBadge.textContent = platformName;
    platformBadge.style.cssText = 'background: #f0f0f0; padding: 8px 12px; border-radius: 6px; margin-bottom: 16px; display: inline-block; font-weight: 600;';

    const textarea = document.createElement('textarea');
    textarea.value = shareText;
    textarea.style.cssText = `
      width: 100%;
      min-height: 200px;
      padding: 12px;
      border: 2px solid #ddd;
      border-radius: 8px;
      font-size: 14px;
      font-family: inherit;
      resize: vertical;
      margin-bottom: 16px;
    `;
    textarea.readOnly = true;

    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'display: flex; gap: 12px;';

    const copyButton = document.createElement('button');
    copyButton.textContent = '📋 Copy to Clipboard';
    copyButton.style.cssText = `
      flex: 1;
      padding: 12px;
      background: #1a5f7a;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      font-size: 16px;
    `;
    copyButton.onclick = () => {
      textarea.select();
      document.execCommand('copy');
      copyButton.textContent = '✅ Copied!';
      copyButton.style.background = '#22c55e';
      setTimeout(() => {
        copyButton.textContent = '📋 Copy to Clipboard';
        copyButton.style.background = '#1a5f7a';
      }, 2000);
    };

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.cssText = `
      flex: 1;
      padding: 12px;
      background: #f0f0f0;
      color: #333;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      font-size: 16px;
    `;
    closeButton.onclick = () => {
      document.body.removeChild(modal);
    };

    content.appendChild(title);
    content.appendChild(platformBadge);
    content.appendChild(textarea);
    buttonContainer.appendChild(copyButton);
    buttonContainer.appendChild(closeButton);
    content.appendChild(buttonContainer);
    modal.appendChild(content);
    document.body.appendChild(modal);

    // Auto-select text
    setTimeout(() => {
      textarea.select();
    }, 100);
  };

  // Handle video element when camera is shown
  useEffect(() => {
    if (showCamera && videoRef.current && streamRef.current) {
      const video = videoRef.current;
      video.srcObject = streamRef.current;
      
      const handleLoadedMetadata = () => {
        // Video metadata is loaded, check if dimensions are valid
        if (video.videoWidth > 0 && video.videoHeight > 0) {
          setVideoReady(true);
        }
      };

      const handleError = (err: Event) => {
        console.error('Error playing video stream:', err);
        setError('Could not start camera preview. Please try again.');
        setVideoReady(false);
      };

      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('error', handleError);
      
      video.play().catch((err) => {
        console.error('Error playing video:', err);
        setError('Could not start camera preview. Please try again.');
        setVideoReady(false);
      });

      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('error', handleError);
      };
    }
  }, [showCamera]);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  const EditTextModal = () => {
    if (!showEditTextModal || !photo) return null;

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-deep-teal">{t('editPhotoText')}</h2>
              <button
                onClick={() => {
                  setShowEditTextModal(false);
                  if (previewWatermarkedUrl) {
                    URL.revokeObjectURL(previewWatermarkedUrl);
                    setPreviewWatermarkedUrl(null);
                  }
                }}
                className="text-stormy-sky hover:text-deep-teal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Preview */}
              <div className="space-y-4">
                <h3 className="font-semibold text-deep-teal">{t('photoPreview')}</h3>
                {isUpdatingPreview ? (
                  <div className="border-2 border-dashed border-stormy-sky rounded-lg p-8 text-center text-stormy-sky">
                    {t('generatingPreview')}
                  </div>
                ) : previewWatermarkedUrl ? (
                  <div className="relative border-2 border-stormy-sky rounded-lg overflow-hidden">
                    <img
                      key={previewWatermarkedUrl} // Force re-render only the image
                      src={previewWatermarkedUrl}
                      alt={t('photoPreview')}
                      className="w-full h-auto"
                    />
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-stormy-sky rounded-lg p-8 text-center text-stormy-sky">
                    {t('generatingPreview')}
                  </div>
                )}
              </div>

              {/* Text Editor */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stormy-sky mb-2">
                    {t('customMessage')}
                  </label>
                  <textarea
                    ref={textareaRef}
                    value={customFoundMessage || ''}
                    onChange={(e) => {
                      setCustomFoundMessage(e.target.value);
                      // Set cursor to end after state update
                      setTimeout(() => {
                        if (textareaRef.current) {
                          const length = e.target.value.length;
                          textareaRef.current.setSelectionRange(length, length);
                        }
                      }, 0);
                    }}
                    rows={4}
                    className="input w-full"
                    placeholder={getRandomFoundMessage()}
                    autoFocus
                    disabled={isUpdatingPreview}
                  />
                  <p className="text-xs text-stormy-sky mt-1">
                    {t('customMessageHint')}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={async () => {
                      const randomMessage = getRandomFoundMessage();
                      setCustomFoundMessage(randomMessage);
                      // Set cursor to end
                      setTimeout(() => {
                        if (textareaRef.current) {
                          const length = randomMessage.length;
                          textareaRef.current.setSelectionRange(length, length);
                        }
                      }, 0);
                      // Update preview immediately when using random
                      if (photo) {
                        try {
                          setIsUpdatingPreview(true);
                          const previewUrl = await addWatermark(photo, randomMessage);
                          setPreviewWatermarkedUrl((oldUrl) => {
                            if (oldUrl) URL.revokeObjectURL(oldUrl);
                            return previewUrl;
                          });
                        } catch (err) {
                          console.error('Error updating preview:', err);
                        } finally {
                          setIsUpdatingPreview(false);
                        }
                      }
                    }}
                    className="btn-secondary flex-1 w-full sm:w-auto"
                  >
                    {t('useRandom')}
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      if (photo && customFoundMessage) {
                        await handleUpdatePreview();
                      }
                    }}
                    disabled={isUpdatingPreview || !customFoundMessage}
                    className="btn-secondary flex-1 w-full sm:w-auto"
                  >
                    {isUpdatingPreview ? t('processing') : t('updatePreview')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditTextModal(false);
                    }}
                    className="btn-cta flex-1 w-full sm:w-auto"
                  >
                    {t('done')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewWatermarkedUrl) {
        URL.revokeObjectURL(previewWatermarkedUrl);
      }
    };
  }, [previewWatermarkedUrl]);

  return (
    <>
      <ShareServiceModal />
      <EditTextModal />
      <div className="space-y-4">
      {showCamera ? (
        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full max-h-[80vh] object-contain"
              style={{ aspectRatio: '9/16' }}
              onError={(e) => {
                console.error('Video element error:', e);
                setError('Camera preview failed. Please try again or use file upload.');
              }}
            />
            <div className="absolute top-4 right-4">
              <button
                type="button"
                onClick={cancelCamera}
                className="bg-red-600 text-white rounded-full p-2 hover:bg-red-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={cancelCamera}
              className="btn-secondary flex-1 w-full sm:w-auto"
            >
              {t('cancel')}
            </button>
            <button
              type="button"
              onClick={capturePhoto}
              className="btn-cta flex-1 w-full sm:w-auto flex items-center justify-center gap-2"
              disabled={!streamRef.current || !videoReady}
            >
              <Camera className="w-5 h-5" />
              {t('capturePhoto')}
            </button>
          </div>
        </div>
      ) : !photo ? (
        <div className="space-y-3">
          {window.location.protocol !== 'https:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
              <p className="text-sm font-semibold mb-1">⚠️ Camera requires HTTPS</p>
              <p className="text-xs">Camera access is only available over HTTPS. Please enable HTTPS for your site or use the file upload option.</p>
            </div>
          )}
          <div className="border-2 border-dashed border-stormy-sky rounded-lg p-8 text-center">
                <Camera className="w-12 h-12 text-stormy-sky mx-auto mb-4" />
            <p className="text-stormy-sky mb-4">
              📸 {t('findAndCaptureMoment')} 🎄
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
              <button
                type="button"
                onClick={handleCameraCapture}
                className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <Camera className="w-4 h-4" />
                {t('takePhoto')}
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn-secondary flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <Upload className="w-4 h-4" />
                {t('uploadPhoto')}
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <img
              src={previewWatermarkedUrl || photo}
              alt="Upload preview"
              className="w-full rounded-lg border-2 border-stormy-sky"
            />
            <button
              type="button"
              onClick={() => {
                setPhoto(null);
                setPhotoFile(null);
                setError(null);
                setCustomFoundMessage('');
                setPreviewWatermarkedUrl(null);
                if (previewWatermarkedUrl) {
                  URL.revokeObjectURL(previewWatermarkedUrl);
                }
              }}
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 hover:bg-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleEditText}
              className="btn-secondary flex items-center justify-center gap-2 flex-1 w-full sm:w-auto"
              disabled={uploading || loading}
            >
              <Edit2 className="w-4 h-4" />
              {t('editText')}
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="btn-secondary flex items-center justify-center gap-2 flex-1 w-full sm:w-auto"
              disabled={uploading || loading}
            >
              <Share2 className="w-4 h-4" />
              {t('sharePhoto')}
            </button>
            <button
              type="button"
              onClick={handleComplete}
              className="btn-cta flex items-center justify-center gap-2 flex-1 w-full sm:w-auto"
              disabled={uploading || loading}
            >
              {uploading ? t('processing') : t('completeChallenge')}
            </button>
          </div>
        </div>
      )}
      </div>
    </>
  );
}

