# Changelog

All notable changes to the Questmas MVP project will be documented in this file.

## [Unreleased]

### Added
- Hero image support on landing page
- Location hints (shown on request, not by default)
- Photo text editing before sharing
- Two-step photo upload flow (clue → "I found it" → photo)
- Personalized sharing with recipient name
- Weather-based personalized greetings
- Test mode for quest preview
- Modern Christmas theme (dark teal/green, cream, gold)
- Festive animations (snowfall, sparkles)
- Internationalization (English & German)

### Changed
- Landing page completely redesigned as modern one-pager
- "Free Forever" changed to "Free This Year"
- Overlay styling updated to match brand colors
- Button styles updated (transparent with borders for hero section)
- Location hints hidden by default, shown on request
- Photo upload flow separated into two steps

### Fixed
- CSS compilation errors (font-primary usage)
- Preview mode blank screen issues
- Task completion errors in preview
- Photo text not appearing in watermarked images
- Cursor position issues in text editing
- Modal background opacity and blur

## [MVP - January 2025]

### Added
- Initial MVP release
- User authentication (Supabase Auth)
- Quest creation and management
- Christmas calendar quest type (24 days)
- Task/challenge creation
- Quest participation flow
- Calendar view with door-opening
- Photo upload and watermarking
- Shareable links
- Basic analytics dashboard
- Internationalization support
- Responsive design

### Technical Details
- React 18 + Vite 5 + TypeScript 5
- Supabase (PostgreSQL, Auth, Storage)
- Tailwind CSS 3 with custom theme
- i18next for translations
- Canvas API for image watermarking

