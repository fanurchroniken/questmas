import { Link } from 'react-router-dom';
import { Gift, Calendar, Share2, BarChart3, Sparkles, Star, CheckCircle, ArrowRight, Users, Zap, Globe, Heart, TrendingUp, Smartphone, Camera, MapPin, Quote, Lock, Unlock, Puzzle, Map, Lightbulb, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Sample riddles for preview
  const sampleRiddles = [
    {
      day: 1,
      riddle: 'Where we first met, where love began, find the gift where memories span.',
      location: 'First Date Spot',
      gift: '💍 Special Keepsake'
    },
    {
      day: 12,
      riddle: 'In the place where books whisper secrets old, your next treasure story will unfold.',
      location: 'Local Library',
      gift: '📚 Favorite Book'
    },
    {
      day: 24,
      riddle: 'Under the tree where we share our dreams, the final gift in moonlight gleams.',
      location: 'Special Tree',
      gift: '🎁 Grand Finale'
    }
  ];

  // Testimonials
  const testimonials = [
    {
      name: 'Sarah & Mike',
      text: 'This made our Christmas magical! Every day was a new adventure.',
      avatar: '👫'
    },
    {
      name: 'Emma & Tom',
      text: 'Best gift idea ever! The riddles were so personal and thoughtful.',
      avatar: '💑'
    },
    {
      name: 'Lisa & James',
      text: 'We\'re already planning next year\'s calendar. Absolutely love it!',
      avatar: '❤️'
    }
  ];

  return (
    <div className="min-h-screen bg-forest-dark relative">
      {/* Snowfall Effect - Visible in front of everything */}
      <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="snowflake"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 10}s`,
              fontSize: `${0.5 + Math.random() * 1}em`,
            }}
          >
            ❄
          </div>
        ))}
      </div>

      {/* Navigation */}
      <nav className="bg-cream/95 backdrop-blur-md shadow-lg border-b border-luxury-gold/20 sticky top-0 z-[90]" ref={menuRef}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between h-14 sm:h-16 items-center">
            <Link to="/" className="flex items-center gap-1 sm:gap-2 hover:opacity-80 transition-opacity">
              <div className="relative">
                <Gift className="w-6 h-6 sm:w-8 sm:h-8 text-christmas-red animate-float" />
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-luxury-gold absolute -top-1 -right-1 animate-sparkle" />
              </div>
              <span className="text-lg sm:text-2xl font-heading font-bold bg-gradient-to-r from-christmas-red via-luxury-gold to-sunset-orange bg-clip-text text-transparent">
                Questmas
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2 lg:gap-4">
              <LanguageSwitcher />
              {user ? (
                <>
                  <Link to="/dashboard" className="btn-secondary text-sm lg:text-base px-4 lg:px-6 py-1.5 lg:py-2">
                    {t('createCalendars') || 'Create Calendars'}
                  </Link>
                  <Link to="/access" className="btn-primary shadow-glow-gold text-sm lg:text-base px-4 lg:px-6 py-1.5 lg:py-2">
                    {t('accessCalendar') || 'Access a Calendar'}
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login" className="bg-deep-teal text-white px-4 lg:px-6 py-1.5 lg:py-2 rounded-lg font-medium hover:bg-forest-dark transition-colors text-sm lg:text-base">
                    {t('login')}
                  </Link>
                  <Link to="/signup" className="btn-primary shadow-glow-gold text-sm lg:text-base px-4 lg:px-6 py-1.5 lg:py-2">
                    {t('signup')}
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-forest-dark hover:bg-cream-dark rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-luxury-gold/20 py-4 space-y-3">
              <div className="px-2">
                <LanguageSwitcher fullWidth={true} />
              </div>
              {user ? (
                <>
                  <Link 
                    to="/dashboard" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="block btn-secondary text-base px-4 py-2 text-center"
                  >
                    {t('createCalendars') || 'Create Calendars'}
                  </Link>
                  <Link 
                    to="/access" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="block btn-primary shadow-glow-gold text-base px-4 py-2 text-center"
                  >
                    {t('accessCalendar') || 'Access a Calendar'}
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="block bg-deep-teal text-white px-4 py-2 rounded-lg font-medium hover:bg-forest-dark transition-colors text-base text-center"
                  >
                    {t('login')}
                  </Link>
                  <Link 
                    to="/signup" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="block btn-primary shadow-glow-gold text-base px-4 py-2 text-center"
                  >
                    {t('signup')}
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section - Full Width with Hero Image */}
        <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden">
          {/* Hero Image Background */}
          <div className="absolute inset-0 z-0">
            {/* Hero Image */}
            <img 
              src="https://cdn.pixabay.com/photo/2023/12/13/19/03/ai-generated-8447500_1280.png" 
              alt="Couple with Christmas calendar adventure" 
              className="w-full h-full object-cover brightness-90 contrast-110"
            />
            
            {/* Decorative festive elements overlay - Hidden on mobile */}
            <div className="absolute inset-0 opacity-10 pointer-events-none hidden sm:block">
              <div className="absolute top-20 left-10 text-cream text-6xl lg:text-9xl animate-pulse">🎄</div>
              <div className="absolute top-40 right-20 text-luxury-gold text-5xl lg:text-8xl animate-pulse delay-300">⭐</div>
              <div className="absolute bottom-40 left-1/4 text-cream text-4xl lg:text-7xl animate-pulse delay-700">🎁</div>
              <div className="absolute bottom-20 right-1/3 text-luxury-gold text-5xl lg:text-8xl animate-pulse delay-500">❄️</div>
            </div>
            
            {/* Overlay matching website branding - forest-dark gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-forest-dark/70 via-forest-dark/60 to-forest-dark/70" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12 sm:py-20">
            {/* Badge with Gold Accent */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-luxury-gold/20 via-sunset-orange/20 to-luxury-gold/20 backdrop-blur-sm px-6 py-3 rounded-full mb-8 border border-luxury-gold/40 shadow-glow-gold animate-fade-in">
              <Sparkles className="w-5 h-5 text-luxury-gold animate-sparkle" />
                <span className="text-sm font-semibold text-cream">
                  {t('freeThisYear') || '✨ Free This Year - No Credit Card Required'}
                </span>
              <Sparkles className="w-5 h-5 text-luxury-gold animate-sparkle" />
            </div>

            {/* Main Headline with Serif Font */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-heading font-bold mb-4 sm:mb-6 leading-[1.1] animate-slide-up">
              <span className="block text-cream mb-2 sm:mb-3 drop-shadow-2xl">
                {t('createMagicalCalendars') || 'Create Magical'}
              </span>
              <span className="block text-luxury-gold drop-shadow-[0_0_20px_rgba(212,175,55,0.8)] animate-gradient font-bold">
                {t('christmasAdventures') || 'Christmas Adventures'}
              </span>
            </h1>

            {/* Tagline Overlay */}
            <div className="mb-6 sm:mb-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-heading font-medium text-luxury-gold mb-3 sm:mb-4 italic drop-shadow-lg px-4">
                {t('loveStoryTagline') || '"Your love story, wrapped in riddles."'}
              </p>
            </div>

            {/* Subheadline */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-body font-semibold text-cream/95 mb-3 sm:mb-4 max-w-4xl mx-auto leading-relaxed animate-slide-up px-4" style={{ animationDelay: '0.2s' }}>
              {t('perfectForCouples') || 'Perfect for Couples - Create a Magical Gift Hunt'}
            </p>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-cream/85 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up px-4" style={{ animationDelay: '0.4s' }}>
              {t('coupleDescription') || 'One partner creates a personalized 24-day Christmas calendar with daily riddles. Each day, the recipient opens a new door to solve a riddle and find a hidden gift in the real world. Turn gift-giving into an unforgettable adventure!'}
            </p>

            {/* Primary CTA with Enhanced Styling */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-12 sm:mb-20 animate-slide-up px-4" style={{ animationDelay: '0.6s' }}>
              {user ? (
                <>
                  <Link 
                    to="/quests/new" 
                    className="group relative btn-cta text-base sm:text-lg lg:text-xl px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 flex items-center gap-2 sm:gap-3 shadow-2xl shadow-glow-orange transform hover:scale-110 transition-all overflow-hidden w-full sm:w-auto"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-luxury-gold/20 to-sunset-orange/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Gift className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-12 transition-transform relative z-10" />
                    <span className="relative z-10 font-heading font-semibold">
                      {t('createYourCalendar') || 'Create Your Calendar'}
                    </span>
                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-2 transition-transform relative z-10" />
                  </Link>
                  <Link 
                    to="/dashboard" 
                    className="bg-transparent text-base sm:text-lg lg:text-xl px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 border-2 border-white text-white hover:bg-white/10 font-heading rounded-lg transition-all w-full sm:w-auto text-center"
                  >
                    {t('goToDashboard')}
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    to="/signup" 
                    className="group relative btn-cta text-base sm:text-lg lg:text-xl px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 flex items-center justify-center gap-2 sm:gap-3 shadow-2xl shadow-glow-orange transform hover:scale-110 transition-all overflow-hidden w-full sm:w-auto"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-luxury-gold/20 to-sunset-orange/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-12 transition-transform relative z-10" />
                    <span className="relative z-10 font-heading font-semibold">
                      {t('startCreatingMagic') || 'Start Creating Magic'}
                    </span>
                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-2 transition-transform relative z-10" />
                  </Link>
                  <Link 
                    to="/login" 
                    className="bg-deep-teal text-white text-base sm:text-lg lg:text-xl px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 rounded-lg font-medium hover:bg-forest-dark transition-colors font-heading w-full sm:w-auto text-center"
                  >
                    {t('login')}
                  </Link>
                </>
              )}
            </div>

            {/* Hero Stats with Gold Accents */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto mt-12 sm:mt-20 animate-fade-in px-4" style={{ animationDelay: '0.8s' }}>
              <div className="bg-gradient-to-br from-cream/20 to-cream/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-6 sm:p-8 border-2 border-luxury-gold/30 shadow-glow-gold hover:scale-105 transition-transform">
                <div className="text-4xl sm:text-5xl font-bold text-luxury-gold mb-2 font-heading">24</div>
                <div className="text-cream/90 font-body text-base sm:text-lg">{t('dailyChallenges') || 'Daily Challenges'}</div>
              </div>
              <div className="bg-gradient-to-br from-cream/20 to-cream/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-6 sm:p-8 border-2 border-luxury-gold/30 shadow-glow-gold hover:scale-105 transition-transform">
                <div className="text-4xl sm:text-5xl font-bold text-luxury-gold mb-2 font-heading">∞</div>
                <div className="text-cream/90 font-body text-base sm:text-lg">{t('unlimitedQuests') || 'Unlimited Quests'}</div>
              </div>
              <div className="bg-gradient-to-br from-cream/20 to-cream/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-6 sm:p-8 border-2 border-luxury-gold/30 shadow-glow-gold hover:scale-105 transition-transform">
                <div className="text-4xl sm:text-5xl font-bold text-luxury-gold mb-2 font-heading">100%</div>
                  <div className="text-cream/90 font-body text-base sm:text-lg">{t('freeThisYear') || 'Free This Year'}</div>
              </div>
            </div>
          </div>
        </section>

        {/* The Adventure Process Section */}
        <section className="py-12 sm:py-16 lg:py-24 bg-forest-dark relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-10 right-10 text-cream/5 text-6xl sm:text-9xl animate-pulse">🎄</div>
            <div className="absolute bottom-10 left-10 text-cream/5 text-6xl sm:text-9xl animate-pulse delay-300">❄️</div>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12 lg:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-cream mb-4 sm:mb-6">
                {t('theAdventureProcess') || 'The Adventure Process'}
              </h2>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-cream/80 max-w-3xl mx-auto font-body px-4">
                {t('dailyGiftHunt') || 'Each day brings a new riddle leading to a hidden gift'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
              {/* Step 1 */}
              <div className="relative group">
                <div className="bg-gradient-to-br from-cream/15 to-cream/5 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border-2 border-luxury-gold/30 shadow-glow-gold text-center hover:scale-105 transition-all">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-luxury-gold to-gold-light rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-2xl sm:text-3xl lg:text-4xl font-bold text-forest-dark shadow-lg group-hover:scale-110 transition-transform">
                    1
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-cream mb-3 sm:mb-4">
                    {t('createCalendar') || 'Create Your Calendar'}
                  </h3>
                  <p className="text-cream/80 leading-relaxed font-body text-sm sm:text-base lg:text-lg">
                    {t('createCalendarDescription') || 'Set up 24 daily riddles, hide gifts at real-world locations, and personalize it for your partner'}
                  </p>
                </div>
                <div className="hidden md:block absolute top-1/2 -right-4 transform translate-y-1/2 z-20">
                  <ArrowRight className="w-8 lg:w-10 h-8 lg:h-10 text-luxury-gold/60" />
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative group">
                <div className="bg-gradient-to-br from-cream/15 to-cream/5 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border-2 border-luxury-gold/30 shadow-glow-gold text-center hover:scale-105 transition-all">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-sunset-orange to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-2xl sm:text-3xl lg:text-4xl font-bold text-white shadow-lg group-hover:scale-110 transition-transform">
                    2
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-cream mb-3 sm:mb-4">
                    {t('shareWithPartner') || 'Share With Your Partner'}
                  </h3>
                  <p className="text-cream/80 leading-relaxed font-body text-sm sm:text-base lg:text-lg">
                    {t('shareWithPartnerDescription') || 'Send them the link. Each day from Dec 1-24, they can open a new door to reveal a riddle'}
                  </p>
                </div>
                <div className="hidden md:block absolute top-1/2 -right-4 transform translate-y-1/2 z-20">
                  <ArrowRight className="w-8 lg:w-10 h-8 lg:h-10 text-luxury-gold/60" />
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative group">
                <div className="bg-gradient-to-br from-cream/15 to-cream/5 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border-2 border-luxury-gold/30 shadow-glow-gold text-center hover:scale-105 transition-all">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-christmas-green to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-2xl sm:text-3xl lg:text-4xl font-bold text-white shadow-lg group-hover:scale-110 transition-transform">
                    3
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-cream mb-3 sm:mb-4">
                    {t('solveAndFind') || 'Solve & Find Gifts'}
                  </h3>
                  <p className="text-cream/80 leading-relaxed font-body text-sm sm:text-base lg:text-lg">
                    {t('solveAndFindDescription') || 'They solve the daily riddle, visit the location, find the hidden gift, and share their discovery'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What's Inside - Sample Riddles Section */}
        <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-b from-cream via-cream-dark to-cream relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12 lg:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-forest-dark mb-4 sm:mb-6">
                {t('whatsInside') || 'What\'s Inside'}
              </h2>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-forest-dark/80 max-w-3xl mx-auto font-body px-4">
                {t('sampleRiddles') || 'Sample riddles and gift ideas to spark your creativity'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {sampleRiddles.map((sample, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-luxury-gold/20 hover:border-luxury-gold/40 hover:shadow-glow-gold transition-all group"
                >
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-luxury-gold to-gold-light rounded-full flex items-center justify-center text-forest-dark font-bold text-lg sm:text-xl font-heading">
                      {sample.day}
                    </div>
                    <div className="flex-1 h-1 bg-gradient-to-r from-luxury-gold to-sunset-orange rounded-full" />
                  </div>
                  <div className="mb-4">
                    <Puzzle className="w-6 h-6 sm:w-8 sm:h-8 text-luxury-gold mb-3" />
                    <p className="text-forest-dark/90 font-body text-base sm:text-lg italic leading-relaxed mb-4">
                      "{sample.riddle}"
                    </p>
                  </div>
                  <div className="space-y-2 pt-4 border-t border-luxury-gold/20">
                    <div className="flex items-center gap-2 text-forest-dark/80">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-sunset-orange" />
                      <span className="font-body text-sm sm:text-base">{sample.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-forest-dark/80">
                      <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-luxury-gold" />
                      <span className="font-body text-sm sm:text-base">{sample.gift}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Couples Love It - Testimonials */}
        <section className="py-12 sm:py-16 lg:py-24 bg-forest-dark relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 text-cream/5 text-5xl sm:text-8xl">💑</div>
            <div className="absolute bottom-20 right-20 text-cream/5 text-5xl sm:text-8xl">❤️</div>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12 lg:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-cream mb-4 sm:mb-6">
                {t('whyCouplesLoveIt') || 'Why Couples Love It'}
              </h2>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-cream/80 max-w-3xl mx-auto font-body px-4">
                {t('realStories') || 'Real stories from couples who made their Christmas magical'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index}
                  className="bg-gradient-to-br from-cream/15 to-cream/5 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 border-luxury-gold/30 shadow-glow-gold hover:scale-105 transition-all"
                >
                  <Quote className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-luxury-gold mb-3 sm:mb-4 opacity-50" />
                  <p className="text-cream/90 font-body text-base sm:text-lg leading-relaxed mb-4 sm:mb-6 italic">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-luxury-gold/20">
                    <div className="text-3xl sm:text-4xl">{testimonial.avatar}</div>
                    <div>
                      <div className="font-heading font-semibold text-cream text-sm sm:text-base">{testimonial.name}</div>
                      <div className="flex gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-luxury-gold fill-luxury-gold" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section - Enhanced */}
        <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-b from-cream to-cream-dark relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12 lg:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-forest-dark mb-4 sm:mb-6">
                {t('everythingYouNeed') || 'Everything You Need'}
              </h2>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-forest-dark/80 max-w-3xl mx-auto font-body px-4">
                {t('createViralExperiences') || 'Create viral experiences that people love to share'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Feature 1 */}
              <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl hover:shadow-glow-gold transition-all border-2 border-transparent hover:border-luxury-gold/30 group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-christmas-red to-red-600 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-heading font-bold text-forest-dark mb-2 sm:mb-3">
                  {t('dailyDoors') || 'Daily Unlocks'}
                </h3>
                <p className="text-forest-dark/80 leading-relaxed font-body text-sm sm:text-base">
                  {t('dailyDoorsDescription') || '24 magical doors that unlock day by day, building anticipation and excitement'}
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl hover:shadow-glow-gold transition-all border-2 border-transparent hover:border-luxury-gold/30 group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-sunset-orange to-orange-600 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Camera className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-heading font-bold text-forest-dark mb-2 sm:mb-3">
                  {t('viralPhotoSharing') || 'Viral Photo Sharing'}
                </h3>
                <p className="text-forest-dark/80 leading-relaxed font-body text-sm sm:text-base">
                  {t('viralPhotoSharingDescription') || 'Participants share photos with branded watermarks, creating viral marketing'}
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl hover:shadow-glow-gold transition-all border-2 border-transparent hover:border-luxury-gold/30 group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-luxury-gold to-gold-light rounded-2xl sm:rounded-3xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Share2 className="w-8 h-8 sm:w-10 sm:h-10 text-forest-dark" />
                </div>
                <h3 className="text-xl sm:text-2xl font-heading font-bold text-forest-dark mb-2 sm:mb-3">
                  {t('easySharing') || 'Easy Sharing'}
                </h3>
                <p className="text-forest-dark/80 leading-relaxed font-body text-sm sm:text-base">
                  {t('easySharingDescription') || 'One-click sharing with personalized links and QR codes'}
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl hover:shadow-glow-gold transition-all border-2 border-transparent hover:border-luxury-gold/30 group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-forest-light to-forest-dark rounded-2xl sm:rounded-3xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-heading font-bold text-forest-dark mb-2 sm:mb-3">
                  {t('trackEngagement') || 'Track Engagement'}
                </h3>
                <p className="text-forest-dark/80 leading-relaxed font-body text-sm sm:text-base">
                  {t('trackEngagementDescription') || 'See who\'s participating, completion rates, and engagement metrics'}
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl hover:shadow-glow-gold transition-all border-2 border-transparent hover:border-luxury-gold/30 group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Smartphone className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-heading font-bold text-forest-dark mb-2 sm:mb-3">
                  {t('mobileFirst') || 'Mobile First'}
                </h3>
                <p className="text-forest-dark/80 leading-relaxed font-body text-sm sm:text-base">
                  {t('mobileFirstDescription') || 'Optimized for phones - participants complete challenges on the go'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing / Free Section - Enhanced */}
        <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-forest-dark via-forest-light to-forest-dark relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 text-luxury-gold/10 text-6xl sm:text-9xl">💎</div>
            <div className="absolute bottom-20 right-20 text-luxury-gold/10 text-6xl sm:text-9xl">✨</div>
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-luxury-gold/20 to-sunset-orange/20 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-full mb-6 sm:mb-8 border-2 border-luxury-gold/40 shadow-glow-gold">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-luxury-gold" />
              <span className="text-sm sm:text-base lg:text-lg font-semibold text-cream font-heading">
                {t('freeThisYear') || 'Free This Year'}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-cream mb-4 sm:mb-6">
              {t('startCreatingToday') || 'Start Creating Today'}
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-cream/90 mb-8 sm:mb-12 max-w-3xl mx-auto font-body px-4">
              {t('noCreditCard') || 'No credit card required. Create unlimited Christmas calendars and share them with anyone.'}
            </p>
            <div className="bg-gradient-to-br from-cream to-cream-dark rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 xl:p-14 shadow-2xl border-4 border-luxury-gold/40 shadow-glow-gold">
              <div className="text-5xl sm:text-6xl lg:text-7xl font-bold text-luxury-gold mb-3 sm:mb-4 font-heading">$0</div>
              <div className="text-2xl sm:text-3xl font-semibold text-forest-dark mb-6 sm:mb-8 lg:mb-10 font-heading">
                {t('freeThisYear') || 'Free This Year'}
              </div>
              <ul className="text-left max-w-md mx-auto space-y-3 sm:space-y-4 lg:space-y-5 mb-6 sm:mb-8 lg:mb-10">
                <li className="flex items-start gap-3 sm:gap-4">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-christmas-green flex-shrink-0 mt-0.5" />
                  <span className="text-forest-dark/90 font-body text-sm sm:text-base lg:text-lg">{t('unlimitedQuests') || 'Unlimited Quests'}</span>
                </li>
                <li className="flex items-start gap-3 sm:gap-4">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-christmas-green flex-shrink-0 mt-0.5" />
                  <span className="text-forest-dark/90 font-body text-sm sm:text-base lg:text-lg">{t('unlimitedParticipants') || 'Unlimited Participants'}</span>
                </li>
                <li className="flex items-start gap-3 sm:gap-4">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-christmas-green flex-shrink-0 mt-0.5" />
                  <span className="text-forest-dark/90 font-body text-sm sm:text-base lg:text-lg">{t('allFeatures') || 'All Features Included'}</span>
                </li>
                <li className="flex items-start gap-3 sm:gap-4">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-christmas-green flex-shrink-0 mt-0.5" />
                  <span className="text-forest-dark/90 font-body text-sm sm:text-base lg:text-lg">{t('noAds') || 'No Ads, No Limits'}</span>
                </li>
              </ul>
              {!user && (
                <Link 
                  to="/signup" 
                  className="group relative btn-cta text-base sm:text-lg lg:text-xl px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 inline-flex items-center gap-2 sm:gap-3 shadow-2xl shadow-glow-orange transform hover:scale-110 transition-all overflow-hidden w-full sm:w-auto"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-luxury-gold/20 to-sunset-orange/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative z-10 font-heading font-semibold">
                    {t('getStartedFree') || 'Get Started Free'}
                  </span>
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 relative z-10 group-hover:translate-x-2 transition-transform" />
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-cream to-cream-dark">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-forest-dark mb-4 sm:mb-6">
              {t('readyToCreate') || 'Ready to Create Magic?'}
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-forest-dark/80 mb-8 sm:mb-10 font-body px-4">
              {t('startNow') || 'Start your magical Christmas calendar adventure today'}
            </p>
            {!user && (
              <Link 
                to="/signup" 
                className="group relative btn-cta text-base sm:text-lg lg:text-xl px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 inline-flex items-center gap-2 sm:gap-3 shadow-2xl shadow-glow-orange transform hover:scale-110 transition-all overflow-hidden w-full sm:w-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-luxury-gold/20 to-sunset-orange/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Gift className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-12 transition-transform relative z-10" />
                <span className="relative z-10 font-heading font-semibold">
                  {t('createYourCalendar') || 'Create Your Calendar'}
                </span>
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 relative z-10 group-hover:translate-x-2 transition-transform" />
              </Link>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-forest-dark border-t border-luxury-gold/20 py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Gift className="w-6 h-6 text-luxury-gold" />
                  <span className="text-xl font-heading font-bold text-cream">Questmas</span>
                </div>
                <p className="text-cream/70 text-sm font-body">
                  {t('createMagicalCalendars') || 'Create magical Christmas adventures'}
                </p>
              </div>
              <div>
                <h4 className="text-cream font-heading font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-cream/70 font-body">
                  <li><Link to="/" className="hover:text-luxury-gold transition-colors">Features</Link></li>
                  <li><Link to="/" className="hover:text-luxury-gold transition-colors">Pricing</Link></li>
                  <li><Link to="/" className="hover:text-luxury-gold transition-colors">Examples</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-cream font-heading font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-cream/70 font-body">
                  <li><Link to="/" className="hover:text-luxury-gold transition-colors">About</Link></li>
                  <li><Link to="/" className="hover:text-luxury-gold transition-colors">Blog</Link></li>
                  <li><Link to="/" className="hover:text-luxury-gold transition-colors">Contact</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-cream font-heading font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-cream/70 font-body">
                  <li><Link to="/privacy" className="hover:text-luxury-gold transition-colors">Datenschutz</Link></li>
                  <li><Link to="/imprint" className="hover:text-luxury-gold transition-colors">Impressum</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-luxury-gold/20 pt-8 text-center text-sm text-cream/70 font-body">
              <p>© 2024 Questmas. {t('allRightsReserved') || 'All rights reserved.'}</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
