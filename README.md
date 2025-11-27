# Captain's Quest - Questmas MVP

A modular quest-based SaaS platform enabling themed, interactive experiences. This MVP focuses on Questmas - shareable Christmas calendars with daily quests and challenges.

**Current Status**: MVP is functional and ready for testing. Core features for Christmas calendar creation and participation are implemented.

## Technology Stack

- **Frontend**: React 18, Vite 5, TypeScript 5
- **Styling**: Tailwind CSS 3 (with custom Christmas theme)
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **State Management**: TanStack Query 5
- **Forms**: React Hook Form 7, Zod 3
- **i18n**: i18next 23 (English & German supported)
- **Icons**: Lucide React
- **Fonts**: Playfair Display (headings), Inter (body)

## Implemented Features

### ✅ Core Functionality
- User authentication (email/password via Supabase Auth)
- Quest creation and management (Christmas calendar type)
- 24-day calendar structure with daily unlock schedule
- Task/challenge creation with instructions and location hints
- Quest publishing with shareable links
- Personalized sharing with recipient name
- Quest participation flow
- Calendar view with door-opening interface
- Task completion with photo upload
- Photo watermarking with custom text
- Test mode for previewing unpublished quests

### ✅ User Experience
- Modern, festive landing page with hero image
- Responsive design (mobile-first)
- Internationalization (English & German)
- Personalized greetings for quest recipients
- Two-step photo upload flow (clue → "I found it" → photo)
- Location hints (shown on request)
- Photo text editing before sharing
- Viral photo sharing with branded watermarks

### ✅ Admin Features
- Quest dashboard with quest listing
- Quest builder with grid/list view
- Task editor for daily challenges
- Quest preview functionality
- Quest deletion
- Analytics dashboard (basic)

### 🎨 Design & Theming
- Modern Christmas theme (dark teal/green backgrounds, cream cards, gold accents)
- Festive animations (snowfall, sparkles)
- Custom color palette matching brand
- Hero image support
- Modal overlays with blur effects

## Getting Started

### Prerequisites

- Node.js 20.x LTS
- npm 10.x
- Supabase CLI (for local development)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your Supabase credentials.

4. Start local Supabase (if using local development):
   ```bash
   supabase start
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking
- `npm test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage

## Project Structure

```
src/
  ├── components/     # React components
  ├── pages/         # Route components
  ├── hooks/         # Custom React hooks
  ├── lib/           # Utilities, Supabase client, schemas
  ├── styles/        # Global CSS, theme config
  ├── locales/       # i18n files (en, de)
  └── main.tsx       # Entry point
supabase/
  ├── migrations/    # SQL migrations
  ├── functions/     # Edge Functions
  └── config.toml
```

## Development

Follow the coding standards in `Project Requirement Documentation#/codinginstructions.md` and architecture guidelines in `Project Requirement Documentation#/architecture.md`.

## License

Proprietary - All rights reserved

