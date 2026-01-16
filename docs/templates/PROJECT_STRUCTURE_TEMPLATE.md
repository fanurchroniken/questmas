# Project Structure

## Overview

This document describes the recommended project structure for the Writer's SaaS Tool.

## Directory Structure

```
writers-tool/
├── .github/                    # GitHub workflows and templates
│   ├── workflows/
│   │   └── ci.yml
│   └── ISSUE_TEMPLATE/
├── docs/                       # Documentation
│   ├── templates/             # Template instruction files
│   ├── api/                   # API documentation
│   └── guides/                # User and developer guides
├── frontend/                   # Frontend application
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── components/        # React/Vue components
│   │   │   ├── worldbuilding/ # Worldbuilding UI components
│   │   │   │   ├── CharacterManager.tsx
│   │   │   │   ├── TimelineEditor.tsx
│   │   │   │   ├── LocationMapper.tsx
│   │   │   │   └── ObjectDatabase.tsx
│   │   │   ├── writing/      # Writing UI components
│   │   │   │   ├── ChapterEditor.tsx
│   │   │   │   ├── SpellChecker.tsx
│   │   │   │   ├── TagManager.tsx
│   │   │   │   └── WritingInterface.tsx
│   │   │   ├── publishing/   # Publishing UI components
│   │   │   │   ├── EbookExporter.tsx
│   │   │   │   ├── WordExporter.tsx
│   │   │   │   └── FormattingOptions.tsx
│   │   │   ├── common/        # Shared components
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   └── ...
│   │   │   └── layout/        # Layout components
│   │   │       ├── Header.tsx
│   │   │       ├── Sidebar.tsx
│   │   │       └── Footer.tsx
│   │   ├── pages/             # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Projects.tsx
│   │   │   ├── Worldbuilding.tsx
│   │   │   ├── Writing.tsx
│   │   │   └── Publishing.tsx
│   │   ├── lib/               # Libraries and utilities
│   │   │   ├── services/      # API service functions
│   │   │   │   ├── api.ts
│   │   │   │   ├── authService.ts
│   │   │   │   ├── projectService.ts
│   │   │   │   ├── chapterService.ts
│   │   │   │   ├── worldbuildingService.ts
│   │   │   │   └── publishingService.ts
│   │   │   ├── utils/         # Utility functions
│   │   │   │   ├── formatters.ts
│   │   │   │   ├── validators.ts
│   │   │   │   └── helpers.ts
│   │   │   └── hooks/         # Custom React hooks
│   │   │       ├── useAuth.ts
│   │   │       ├── useProjects.ts
│   │   │       └── ...
│   │   ├── contexts/          # React contexts
│   │   │   ├── AuthContext.tsx
│   │   │   ├── ProjectContext.tsx
│   │   │   └── ...
│   │   ├── types/             # TypeScript type definitions
│   │   │   ├── user.ts
│   │   │   ├── project.ts
│   │   │   ├── chapter.ts
│   │   │   ├── worldbuilding.ts
│   │   │   └── publishing.ts
│   │   ├── styles/            # Global styles
│   │   │   └── index.css
│   │   ├── App.tsx            # Main app component
│   │   └── main.tsx           # Entry point
│   ├── tests/                 # Test files
│   │   ├── components/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   ├── tsconfig.json          # TypeScript config
│   ├── vite.config.ts         # Vite config (if using Vite)
│   └── tailwind.config.js     # Tailwind config (if using)
├── backend/                    # Backend API
│   ├── src/
│   │   ├── routes/            # API routes
│   │   │   ├── auth.routes.ts
│   │   │   ├── projects.routes.ts
│   │   │   ├── chapters.routes.ts
│   │   │   ├── worldbuilding.routes.ts
│   │   │   └── publishing.routes.ts
│   │   ├── controllers/       # Route controllers
│   │   │   ├── authController.ts
│   │   │   ├── projectController.ts
│   │   │   ├── chapterController.ts
│   │   │   ├── worldbuildingController.ts
│   │   │   └── publishingController.ts
│   │   ├── services/          # Business logic
│   │   │   ├── authService.ts
│   │   │   ├── projectService.ts
│   │   │   ├── chapterService.ts
│   │   │   ├── worldbuildingService.ts
│   │   │   ├── publishingService.ts
│   │   │   ├── spellCheckService.ts
│   │   │   └── exportService.ts
│   │   ├── models/            # Data models
│   │   │   ├── User.ts
│   │   │   ├── Project.ts
│   │   │   ├── Chapter.ts
│   │   │   ├── Character.ts
│   │   │   ├── Timeline.ts
│   │   │   └── Location.ts
│   │   ├── middleware/        # Express middleware
│   │   │   ├── auth.ts
│   │   │   ├── validation.ts
│   │   │   ├── errorHandler.ts
│   │   │   └── rateLimiter.ts
│   │   ├── utils/             # Utility functions
│   │   │   ├── logger.ts
│   │   │   ├── errors.ts
│   │   │   └── helpers.ts
│   │   ├── config/            # Configuration
│   │   │   ├── database.ts
│   │   │   ├── storage.ts
│   │   │   └── index.ts
│   │   ├── migrations/        # Database migrations
│   │   │   └── ...
│   │   ├── seeds/             # Database seeds
│   │   │   └── ...
│   │   └── server.ts          # Server entry point
│   ├── tests/                 # Test files
│   │   ├── unit/
│   │   ├── integration/
│   │   └── e2e/
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── shared/                     # Shared code (if monorepo)
│   ├── types/                 # Shared TypeScript types
│   └── utils/                 # Shared utilities
├── scripts/                   # Utility scripts
│   ├── setup.sh
│   ├── migrate.sh
│   └── seed.sh
├── .gitignore
├── .env.example
├── docker-compose.yml         # Docker setup (if using)
├── Dockerfile                 # Dockerfile (if using)
├── README.md
└── package.json               # Root package.json (if monorepo)
```

## File Naming Conventions

### Components
- **React**: PascalCase (e.g., `CharacterManager.tsx`)
- **Vue**: PascalCase (e.g., `CharacterManager.vue`)

### Utilities
- **Functions**: camelCase (e.g., `formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.ts`)

### Types/Interfaces
- **Types**: PascalCase (e.g., `User.ts`, `Project.ts`)

### Routes/Controllers
- **Files**: camelCase with suffix (e.g., `authController.ts`, `projects.routes.ts`)

## Code Organization Principles

### Separation of Concerns
- **Components**: Only UI logic
- **Services**: Business logic and API calls
- **Models**: Data structure definitions
- **Utils**: Pure utility functions

### Feature-Based Organization (Alternative)
Some teams prefer organizing by feature:
```
src/
├── features/
│   ├── worldbuilding/
│   │   ├── components/
│   │   ├── services/
│   │   ├── types/
│   │   └── hooks/
│   ├── writing/
│   └── publishing/
```

## Import Organization

### Recommended Import Order
1. External libraries (React, etc.)
2. Internal components
3. Services/utilities
4. Types
5. Styles

### Example
```typescript
// External
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

// Internal components
import { Button } from '@/components/common/Button';
import { CharacterCard } from '@/components/worldbuilding/CharacterCard';

// Services
import { characterService } from '@/lib/services/characterService';

// Types
import type { Character } from '@/types/worldbuilding';

// Styles
import './CharacterManager.css';
```

## Configuration Files

### Frontend
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` / `webpack.config.js` - Build configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `.eslintrc` - ESLint configuration
- `.prettierrc` - Prettier configuration

### Backend
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `.env` - Environment variables
- Database config files (Prisma schema, TypeORM config, etc.)

## Notes

- Use absolute imports with path aliases (e.g., `@/components`)
- Keep components small and focused
- Extract reusable logic into hooks/services
- Use TypeScript for type safety
- Follow consistent naming conventions
- Document complex logic
