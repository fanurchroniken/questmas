import i18n from '../i18n';

/**
 * Generates a random weather-based greeting for personalized messages
 */
export function getWeatherGreeting(): string {
  const t = i18n.t;
  const greetings = [
    t('weatherGreeting.snowyDay'),
    t('weatherGreeting.cozyEvening'),
    t('weatherGreeting.frostyMorning'),
    t('weatherGreeting.warmAfternoon'),
    t('weatherGreeting.magicalMoment'),
    t('weatherGreeting.festiveDay'),
    t('weatherGreeting.winterWonderland'),
    t('weatherGreeting.holidayCheer'),
  ];
  return greetings[Math.floor(Math.random() * greetings.length)];
}

/**
 * Generates a personalized greeting message for sharing a quest
 */
export function generatePersonalizedGreeting(
  recipientName: string,
  sharerName: string,
  questTitle: string,
  isChristmasCalendar: boolean = true
): string {
  const t = i18n.t;
  const weatherGreeting = getWeatherGreeting();
  const greeting = `${weatherGreeting} ${recipientName}`;
  
  if (isChristmasCalendar) {
    return t('personalizedGreeting.christmasCalendar', {
      greeting,
      sharerName,
    });
  } else {
    return t('personalizedGreeting.quest', {
      greeting,
      sharerName,
      questTitle,
    });
  }
}

