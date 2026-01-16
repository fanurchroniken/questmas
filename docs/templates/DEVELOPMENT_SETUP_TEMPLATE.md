# Development Setup Guide

## Prerequisites

### Required Software
- **Node.js**: Version _______
  - [ ] Install from nodejs.org
  - [ ] Or use nvm: `nvm install <version>`
- **Package Manager**: [ ] npm [ ] yarn [ ] pnpm
- **Git**: Version _______
- **Database**: [ ] PostgreSQL [ ] MySQL [ ] MongoDB [ ] Other: _______
  - Version: _______
- **Code Editor**: [ ] VS Code [ ] Other: _______

### Optional but Recommended
- **Docker**: For containerized development
- **Postman/Insomnia**: For API testing
- **Database GUI**: [ ] pgAdmin [ ] DBeaver [ ] MongoDB Compass [ ] Other: _______

## Initial Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd <project-directory>
```

### 2. Install Dependencies

#### Frontend
```bash
cd frontend  # or src if monorepo
npm install  # or yarn/pnpm
```

#### Backend
```bash
cd backend  # or api if monorepo
npm install  # or yarn/pnpm
```

### 3. Environment Configuration

#### Frontend `.env.local`
```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Writer's Tool (Dev)
VITE_ENVIRONMENT=development
```

#### Backend `.env`
```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/writers_tool_dev
# or for MongoDB
MONGODB_URI=mongodb://localhost:27017/writers_tool_dev

# Authentication
JWT_SECRET=your-dev-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# File Storage (use local storage in dev)
STORAGE_TYPE=local
STORAGE_PATH=./uploads

# Third-party Services (optional for dev)
SPELL_CHECK_API_KEY=your-api-key
```

### 4. Database Setup

#### PostgreSQL
```bash
# Create database
createdb writers_tool_dev

# Run migrations
npm run migrate
# or
npx prisma migrate dev
```

#### MongoDB
```bash
# Start MongoDB (if not running as service)
mongod

# Database will be created automatically on first connection
```

### 5. Run Development Servers

#### Frontend
```bash
npm run dev
# Usually runs on http://localhost:5173
```

#### Backend
```bash
npm run dev
# Usually runs on http://localhost:3000
```

## Project Structure

```
project-root/
├── frontend/          # Frontend application
│   ├── src/
│   │   ├── components/
│   │   │   ├── worldbuilding/
│   │   │   ├── writing/
│   │   │   └── publishing/
│   │   ├── pages/
│   │   ├── lib/
│   │   │   ├── services/
│   │   │   └── utils/
│   │   ├── contexts/
│   │   └── types/
│   ├── public/
│   └── package.json
├── backend/           # Backend API
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── utils/
│   ├── migrations/
│   └── package.json
├── docs/              # Documentation
│   └── templates/    # Template files
└── package.json      # Root package.json (if monorepo)
```

## Development Workflow

### Code Style
- **Linter**: [ ] ESLint [ ] Prettier [ ] Biome [ ] Other: _______
- **Format on Save**: [ ] Enabled [ ] Disabled

### Git Workflow
- **Branch Strategy**: [ ] Git Flow [ ] GitHub Flow [ ] Trunk-based [ ] Other: _______
- **Commit Convention**: [ ] Conventional Commits [ ] Custom [ ] None

### Running Tests
```bash
# Frontend tests
npm run test

# Backend tests
npm run test

# E2E tests
npm run test:e2e
```

### Database Migrations

#### Creating Migrations
```bash
# Prisma example
npx prisma migrate dev --name migration_name

# TypeORM example
npm run migration:create -- migration_name
```

#### Running Migrations
```bash
npm run migrate
```

## Common Tasks

### Adding a New Feature
1. Create feature branch: `git checkout -b feature/feature-name`
2. Implement feature
3. Write tests
4. Run linter: `npm run lint`
5. Run tests: `npm run test`
6. Commit changes
7. Create pull request

### Debugging

#### Frontend
- **DevTools**: Browser DevTools
- **React DevTools**: Install browser extension
- **Debugger**: VS Code debugger configuration

#### Backend
- **Debugger**: VS Code debugger or Node.js inspector
- **Logging**: Console logs or Winston/Pino
- **Database**: Check queries with database GUI

### Database Seeding
```bash
# Seed development data
npm run seed
```

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Find process using port
lsof -i :3000  # or netstat -ano | findstr :3000 (Windows)

# Kill process
kill -9 <PID>
```

#### Database Connection Issues
- Check database is running
- Verify connection string in `.env`
- Check firewall/network settings

#### Dependency Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Development Tools

### Recommended VS Code Extensions
- [ ] ESLint
- [ ] Prettier
- [ ] TypeScript (if using TS)
- [ ] GitLens
- [ ] REST Client (for API testing)
- [ ] Database client extension

### Useful Commands

#### Database
```bash
# PostgreSQL
psql -d writers_tool_dev

# MongoDB
mongosh writers_tool_dev
```

#### Docker (if using)
```bash
# Start services
docker-compose up

# Stop services
docker-compose down
```

## Next Steps

After setup:
1. [ ] Read architecture documentation
2. [ ] Review API design
3. [ ] Set up your development environment
4. [ ] Create your first feature branch
5. [ ] Start coding!

## Getting Help

- **Documentation**: Check `/docs` folder
- **Issues**: Create GitHub issue
- **Team**: Contact team members
