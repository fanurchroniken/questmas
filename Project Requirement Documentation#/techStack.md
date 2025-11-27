# Technology Stack Specification

## Overview

This document defines the **specific technologies, frameworks, libraries, and tools** used in **Captains Quest**. It serves as the single source of truth for technology decisions and helps maintain consistency across the codebase.

> 📘 **Related Documents**:
> - [architecture.md](./architecture.md) - Architectural patterns and design principles
> - [codingInstructions.md](./codingInstructions.md) - Universal coding principles
> - [appManifest.md](./appManifest.md) - Product vision and scope

---

## Core Technology Decisions

### Primary Programming Language

- **Language**: TypeScript 5.x
- **Runtime**: Node.js 20.x LTS (backend), ES2020+ (frontend)
- **Rationale**: Type safety, excellent tooling, large ecosystem, code sharing between frontend and backend

### Alternative/Secondary Languages

- **SQL**: PostgreSQL queries and migrations (via Supabase)
- **Note**: Python not required for stage 1

---

## Frontend Stack

### Framework & Build

- **Framework**: React 18.x
- **Build Tool**: Vite 5.x
- **Rationale**: Rapid development, excellent DX, blazingly fast builds, great HMR

### Internationalization (i18n)

- **Library**: i18next 23.x
- **React Binding**: react-i18next 13.x
- **Supported Languages (Stage 1)**: English (en), German (de)
- **Planned Additions**: French (fr), Italian (it), Spanish (es)
- **Configuration**: 
  - Language files stored in `public/locales/[lang]/translation.json`
  - Dynamic language switching
  - Browser language detection on first load
  - Persistent language preference in localStorage

### Styling & Theming

- **CSS Framework**: Tailwind CSS 3.x
- **Rationale**: Rapid component development + customizable theme configuration
- **Theme Customization**:
  - Core theme variables in `tailwind.config.js`
  - Support for multiple color schemes (light/dark/custom branding)
  - CSS variables for dynamic runtime theme switching
  - Brand colors, fonts, spacing customizable per client/deployment
- **Component Library**: Headless UI / Radix UI (for accessible base components)
- **Icons**: React Icons 4.x or Lucide React 0.x

### State Management

- **Library**: TanStack Query (React Query) 5.x
- **Rationale**: 
  - Excellent for server state (API calls, caching)
  - Reduces boilerplate compared to Redux
  - Native Supabase client integration
- **Local State**: React Context API + hooks (minimal state needed)

### HTTP & API Client

- **Library**: @supabase/supabase-js 2.x
- **Rationale**: 
  - Native integration with Supabase database, auth, storage, real-time subscriptions
  - Built-in TypeScript support
  - No need for separate HTTP client

### Form Handling & Validation

- **Form Library**: React Hook Form 7.x
- **Validation**: Zod 3.x
- **Rationale**: 
  - Minimal boilerplate, excellent performance
  - Runtime type validation matches backend schema
  - Client-side validation before server calls

### Real-Time Features

- **Service**: Supabase Realtime (PostgreSQL LISTEN/NOTIFY)
- **Use Cases**: 
  - Quest progress updates for participants
  - Admin dashboard live updates (near-real-time, not strict)
- **Refresh Rate**: 2-5 second polling acceptable; true real-time via WebSocket if needed
- **Implementation**: Supabase client's `on()` subscription API

---

## Backend & Logic Stack

### Serverless Functions

- **Service**: Supabase Edge Functions
- **Language**: TypeScript
- **Runtime**: Deno (Supabase Edge Functions runtime)
- **Rationale**: 
  - Minimal ops overhead
  - Auto-scales with demand
  - Pay per invocation
  - Integrated with Supabase database and auth
- **Limits**:
  - Execution time: 900 seconds (15 minutes)
  - Memory: 512 MB
  - Cold start: ~1-2 seconds (acceptable for most use cases)
- **Use Cases**: 
  - Quest progression logic
  - Trigger email/notifications
  - Image/content processing via external APIs (later stages)
  - Webhook handlers

### Database

#### Primary Database

- **Database**: PostgreSQL 15+ (hosted on Supabase)
- **Access Method**: Supabase client (@supabase/supabase-js) + TypeScript
- **Rationale**: 
  - ACID compliance
  - JSON support for flexible quest metadata
  - Excellent for relational data (users, quests, progress)
  - Supabase provides managed backups, scaling, monitoring
  - Native RLS support for multi-tenant data isolation

#### Migrations

- **Tool**: Supabase CLI + SQL migrations
- **Workflow**: 
  1. Create migration via `supabase migration new [name]`
  2. Write SQL in `supabase/migrations/` folder
  3. Apply locally: `supabase db push`
  4. Production: Supabase dashboard or CLI

#### Row-Level Security (RLS)

- **Enabled**: Yes, mandatory for all tables
- **Purpose**: 
  - Enforce tenant isolation (B2B) via `tenant_id`
  - Prevent users from accessing other users' data
  - Enforce role-based access (admin, participant, etc.)
- **Policies**: Defined as SQL policies in migrations
- **Example**:
  ```sql
  CREATE POLICY "Users can view their own quests"
    ON quests FOR SELECT
    USING (tenant_id = current_user_id());
  ```

### Authentication & Authorization

- **Service**: Supabase Auth (managed)
- **Supported Methods**:
  - Email + password (primary for stage 1)
  - Social logins: Google, GitHub, Discord (enable as needed)
- **JWT**: Handled automatically by Supabase
- **Session Management**: Supabase client manages tokens + refresh
- **Multi-Tenant Support**: Tenant context inferred from user metadata or explicit tenant_id
- **Rationale**: Zero auth infrastructure to manage; integrates seamlessly with RLS policies

### File Storage

- **Service**: Supabase Storage
- **Access Control**: Private/public buckets with RLS policies
- **Use Cases**: 
  - Quest assets (images, PDFs)
  - User uploads (avatars, proof-of-completion)
- **Buckets**:
  - `quest-assets/` (public, CDN-cached)
  - `user-uploads/` (private, RLS-enforced)
- **SDK**: @supabase/supabase-js (includes storage client)

### Validation & Type Safety

- **Library**: Zod 3.x
- **Use Cases**: 
  - Validate Edge Function inputs
  - Runtime type checking for API responses
  - Ensure data consistency before writing to database
- **Shared Schemas**: Define in separate `lib/schemas.ts` file, import in frontend + backend

### Geolocation Features (if needed)

- **Library**: geolocation-utils or native `navigator.geolocation`
- **Comparison**: Client-side geo vs. server-side (IP-based)
- **For quests**: Client-side recommended (more accurate)

---

## Development Tools

### Package Management

- **Package Manager**: npm 10.x
- **Lock File**: `package-lock.json` (committed to repository)
- **Monorepo Consideration**: Keep frontend + backend in single repo with separate `src/` folders (stage 1); split if needed later

### Environment Configuration

- **Development**: `.env.local` (git-ignored, contains local Supabase URL + anon key)
- **Production**: Environment variables set in Coolify/deployment platform
- **Validation**: Zod schema for environment variables (catch config errors early)

### Code Quality

#### Linting

- **Linter**: ESLint 8.x
- **Preset**: `@typescript-eslint/recommended`
- **Config File**: `.eslintrc.cjs`
- **Rules**: Include no-unused-vars, prefer-const, no-console (warn)

#### Formatting

- **Formatter**: Prettier 3.x
- **Config**: `.prettierrc` (consistent spacing, quotes, semi-colons)
- **Pre-commit Hook** (optional): Use Husky + lint-staged to enforce before commits

#### Type Checking

- **Tool**: TypeScript Compiler (tsc)
- **Config**: `tsconfig.json` with strict mode enabled
- **CI Integration**: Run `tsc --noEmit` to catch type errors before deploy

### Testing

#### Unit Testing

- **Framework**: Vitest 1.x (faster than Jest, Vite-native)
- **Assertion Library**: Vitest (built-in)
- **Mocking**: Vitest mocking utilities
- **Coverage**: c8
- **Test Organization**: 
  - Unit tests co-located with source files (`component.test.ts`)
  - Edge Function tests in `supabase/functions/[name].test.ts`

#### Integration Testing

- **Framework**: Vitest + Supabase local environment
- **Database**: Supabase local Docker (via `supabase start`)
- **Auth Mocking**: Test with Supabase JWT tokens
- **Rationale**: Full integration test in local environment before deploy

#### End-to-End Testing (Optional, Stage 2+)

- **Framework**: Playwright 1.x
- **Rationale**: Test full user workflows (login, quest progression, etc.)
- **Execution**: Against staging environment before production deploy

### API Documentation

- **Tool**: Swagger/OpenAPI 3.0
- **Implementation**: 
  - Document Edge Functions via JSDoc comments
  - Generate OpenAPI spec from JSDoc
  - Host docs on `/api/docs` endpoint (optional)
- **Alternative**: Postman Collections for simpler documentation

---

## DevOps & Deployment

### Version Control

- **Platform**: GitHub
- **Repository**: `user/captains-quest`
- **Branching Strategy**: 
  - `main` (production)
  - `develop` (staging/pre-release)
  - Feature branches: `feature/[name]`, `fix/[name]`
- **Commit Convention**: Conventional Commits (optional, helps with changelog generation)

### CI/CD Pipeline (Stage 1: Manual, Stage 2+: GitHub Actions)

**Stage 1 (Current)**:
- Local testing before `git push`
- Deploy manually to Coolify via GitHub push

**Stage 2+ (Future)**:
- GitHub Actions workflow: Lint → Type Check → Unit Tests → Build → Deploy to Staging → (Manual) Deploy to Production
- Auto-deploy `main` branch to production

### Deployment Platform

- **Platform**: Coolify (self-hosted Docker orchestration)
- **Infrastructure**: Your VPS/server (wherever you host Coolify)
- **Deployment Process**:
  1. Push code to GitHub
  2. Coolify detects GitHub webhook
  3. Builds Docker image from `Dockerfile`
  4. Runs tests (optional)
  5. Deploys to running container
  6. Automatic rollback on failure (optional feature)
- **Cost**: Only VPS cost (~$5-10/month for small instance)

### Containerization

- **Tool**: Docker 24.x
- **File**: `Dockerfile` (multi-stage build: build React frontend, serve with Node backend)
- **Docker Compose**: Development environment only (local Postgres, Redis if needed)
- **Registry**: GitHub Container Registry (GHCR) for storing images

### Environment Management

#### Local Development

```
Database: Supabase local (via `supabase start`)
Auth: Supabase local with test accounts
Storage: Supabase local storage
Frontend: Vite dev server (localhost:5173)
Backend: Supabase Edge Functions emulated locally
```

#### Staging

```
Database: Supabase hosted (staging tenant)
Auth: Supabase Auth (staging)
Storage: Supabase Storage (staging bucket)
Frontend: Deployed to Coolify staging instance
Backend: Edge Functions running on Supabase staging
```

#### Production

```
Database: Supabase hosted (production tenant)
Auth: Supabase Auth (production)
Storage: Supabase Storage (production bucket)
Frontend: Deployed to Coolify production instance
Backend: Edge Functions running on Supabase production
```

### Monitoring & Observability

#### Application Monitoring

- **Supabase Dashboards**: 
  - Query performance
  - Auth metrics (login rate, social provider stats)
  - Storage usage
  - Function execution logs
- **Logging**: Console logs from Edge Functions (visible in Supabase dashboard)
- **Error Tracking**: Sentry (optional, stage 2+)

#### Frontend Monitoring (Optional, Stage 2+)

- **Error Reporting**: Sentry SDK
- **Performance**: Web Vitals + Sentry Performance Monitoring
- **User Analytics**: PostHog or Plausible (privacy-focused)

#### Database Monitoring

- **Tool**: Supabase built-in monitoring
- **Metrics**: Query count, cache hit rate, connection pool usage
- **Alerts**: Supabase Pro plan includes alert configuration

---

## Security Tools

### Dependency Scanning

- **Tool**: npm audit + Dependabot
- **Frequency**: Weekly automated checks via Dependabot on GitHub
- **Process**: Review alerts, update dependencies, test before merge

### Static Application Security Testing (SAST)

- **Tool**: GitHub CodeQL (free tier)
- **Integration**: Automatic on every push to GitHub
- **Supplements**: ESLint security rules

### Secrets Management

- **Development**: `.env.local` (never committed)
- **Production**: Coolify secrets management or environment variables set directly in Coolify dashboard
- **Supabase Credentials**: Anon key (public, safe to expose) + Service role key (secret, never expose)

### SSL/TLS

- **Certificate**: Coolify manages via Let's Encrypt
- **Auto-renewal**: Automatic

### API Security

- **Rate Limiting**: Implement via Supabase RLS + Edge Function middleware (stage 2+)
- **CORS**: Configured on Supabase via dashboard
- **Input Validation**: Zod schemas validate all inputs before processing

---

## Third-Party Libraries & Utilities

### Date/Time Handling

- **Library**: date-fns 2.x
- **Rationale**: Lightweight, tree-shakeable, excellent TypeScript support
- **Use Cases**: Format quest dates, schedule triggers, calculate quest duration

### UUID Generation

- **Library**: uuid 9.x
- **Use Cases**: Unique identifiers for quests, participants, progress records

### Environment Variable Validation

- **Library**: Zod 3.x (same as form validation)
- **Usage**: Define schema for `process.env`, validate on app startup
- **Benefit**: Catch missing/invalid env vars before runtime

### Email Service (Stage 2+)

- **Service**: Supabase Auth handles auth emails
- **Custom Email**: Use Supabase Edge Functions + SendGrid or Resend (when needed)
- **For Stage 1**: Not required

### AI/LLM Integration (Stage 2+)

- **Provider**: OpenAI API (not hardcoded; configurable via env var for multi-provider support)
- **SDK**: openai 4.x
- **Service**: Called from Supabase Edge Function (keeps API keys server-side safe)
- **Use Cases**: Generate quest content, AI-powered clues

---

## Development Workflow

### Local Setup

```bash
# Clone repository
git clone https://github.com/user/captains-quest.git
cd captains-quest

# Install dependencies
npm install

# Setup local Supabase
supabase start

# Create .env.local with local Supabase credentials
cp .env.example .env.local

# Start development servers
npm run dev
# Frontend: http://localhost:5173
# Backend: Edge Functions via supabase-cli
```

### Quick Commands

```bash
# Frontend only
npm run dev

# Type check
npm run type-check

# Lint
npm run lint

# Format
npm run format

# Test
npm run test

# Build for production
npm run build

# Supabase commands
supabase start           # Start local environment
supabase stop            # Stop local environment
supabase migration new   # Create migration
supabase functions deploy [name]  # Deploy Edge Function
```

### Code Organization

```
captains-quest/
├── src/
│   ├── pages/              # React pages (route components)
│   ├── components/         # Reusable React components
│   ├── hooks/              # Custom React hooks
│   ├── lib/
│   │   ├── supabase.ts     # Supabase client instance
│   │   ├── schemas.ts      # Zod schemas (shared validation)
│   │   └── utils.ts        # Utility functions
│   ├── styles/             # Global CSS + theme config
│   ├── locales/            # i18n translation files
│   └── main.tsx            # Entry point
├── supabase/
│   ├── migrations/         # SQL migration files
│   ├── functions/          # Edge Function code (TypeScript)
│   └── config.toml         # Supabase config
├── public/
│   └── locales/            # i18n JSON files (en, de, fr, it)
├── Dockerfile              # Production container
├── docker-compose.yml      # Local dev environment
├── tailwind.config.js      # Tailwind theme config
├── tsconfig.json           # TypeScript config
├── eslint.config.js        # ESLint config
├── .prettierrc              # Prettier config
├── vite.config.ts          # Vite config
└── package.json            # Dependencies & scripts
```

---

## Technology Decisions Record

| Technology | Decision | Rationale | Alternatives Considered |
|-----------|----------|-----------|------------------------|
| **Frontend Framework** | React 18 | Rapid dev with Vite, large ecosystem, Supabase integrations | Vue 3, Svelte |
| **Build Tool** | Vite 5 | Blazing fast builds, excellent HMR, modern | Webpack, Turbopack |
| **Database** | Supabase (PostgreSQL) | Managed ops, built-in auth + RLS, cost-effective | Firebase, PlanetScale |
| **Auth** | Supabase Auth | Native RLS integration, social login, no ops | NextAuth, Auth0 |
| **Backend Logic** | Supabase Edge Functions | Zero-ops serverless, integrated with DB, fast cold starts | Azure Functions, AWS Lambda |
| **Styling** | Tailwind CSS | Rapid component dev, customizable theme, excellent DX | Material UI, Styled Components |
| **i18n** | i18next | Industry standard, large community, dynamic switching | react-intl, lingui |
| **Deployment** | Coolify | Self-hosted, Docker-native, minimal cost | Vercel, Heroku, Railway |
| **State Management** | TanStack Query | Server state focus, minimal boilerplate, Supabase-native | Redux, Zustand |
| **Validation** | Zod | Runtime type safety, TypeScript-first, minimal overhead | Joi, Yup |

---

## Eliminated Technologies

| Technology | Reason for Elimination |
|-----------|------------------------|
| **Azure Services** | Simplified stack to single provider (Supabase); reduced cost & complexity |
| **Azure App Service** | Replaced by Coolify self-hosted deployment |
| **Azure Functions** | Replaced by Supabase Edge Functions (simpler, integrated) |
| **Express.js Backend** | Replaced by Supabase Edge Functions + serverless pattern |
| **Prisma ORM** | Replaced by Supabase client (simpler RLS integration) |
| **SendGrid (Email)** | Supabase Auth handles auth emails; future stages use Resend or SendGrid via Edge Functions |

---

## Version Policy

### Version Pinning

- **Development Dependencies**: `^` (minor version updates allowed)
- **Production Dependencies**: Exact version pinning recommended for critical libraries
- **Security Patches**: Update immediately on CVE notification

### Update Cadence

- **Patch Updates**: Monthly review
- **Minor Updates**: Quarterly review, test in local environment
- **Major Updates**: Semi-annual review, plan migration carefully

### Node.js LTS Policy

- Use Active LTS version (currently Node 20.x)
- Plan upgrade 3 months before EOL

---

## Cost Breakdown (Monthly Estimate)

| Service | Cost | Notes |
|---------|------|-------|
| **Supabase** | $25 | Hosted PostgreSQL + Edge Functions (Pro plan) |
| **Coolify VPS** | $5-10 | Self-hosted Docker orchestration |
| **GitHub** | Free | Public repo + Actions (free tier adequate) |
| **Domain** | ~$10 | Your domain registrar |
| **Optional Services** | $0-20 | Sentry, analytics, AI API calls (if used) |
| **Total** | ~$40-65 | Much lower than multi-vendor cloud stack |

---

## Future Technology Considerations (Stage 2+)

- **GitHub Actions**: Automated CI/CD pipeline (lint, test, deploy)
- **Sentry**: Error tracking and performance monitoring
- **PostHog/Plausible**: User analytics and feature tracking
- **Resend or SendGrid**: Transactional email (when non-auth emails needed)
- **Mobile App**: React Native / Expo (code sharing with React frontend)
- **Vector Database**: Pinecone or pgvector (Supabase) for AI-powered search (if needed)

---

## Maintenance

- **Review Frequency**: Quarterly
- **Last Updated**: November 26, 2025
- **Next Review**: February 2026
- **Maintained By**: Captains Quest Development Team

---

## Quick Links

- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [i18next Documentation](https://www.i18next.com)
- [Zod Documentation](https://zod.dev)
- [Coolify Documentation](https://coolify.io/docs)
- [Project Architecture](./architecture.md)
- [Project Manifest](./appManifest.md)

---

## Notes

This tech stack is **stage 1 optimized** for rapid development and minimal ops overhead. All technology choices prioritize:

1. ✅ **Developer Experience** (quick local setup, fast feedback loops)
2. ✅ **Cost Efficiency** (no expensive managed services)
3. ✅ **Scalability** (serverless, auto-scaling infrastructure)
4. ✅ **Type Safety** (TypeScript throughout)
5. ✅ **Future Flexibility** (can evolve to mobile, multi-provider, advanced analytics)

Deviations from this stack require team consensus and documented rationale.
