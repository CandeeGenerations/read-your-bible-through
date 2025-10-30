# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Read Your Bible Through is a Bible reading application that helps users read through the entire Bible in one year. The application consists of:

- **Client**: Next.js 15 React application with NextAuth authentication
- **Server**: Express.js REST API with Prisma ORM
- **Database**: MongoDB for user data and reading progress tracking

## Prerequisites

- Node.js 22.x (managed via fnm - `.nvmrc` files in root, client, and server)
- PNPM 10.x (managed via corepack)
- [phase.dev CLI](https://docs.phase.dev/quickstart#2-install-the-cli) for environment variable management

## Initial Setup

```sh
# 1. Install/enable corepack if needed
corepack -v || brew install corepack
corepack enable pnpm
corepack use pnpm

# 2. Install all dependencies
pnpm run install:all

# 3. Configure phase.dev for environment variables
cd client && phase init
cd ../server && phase init
```

## Development Commands

### Root Level
- `pnpm run install:all` - Install dependencies for root, client, and server
- `pnpm run install:ci` - Install dependencies without scripts (for CI)
- `pnpm eslint` - Run ESLint on both client and server
- `pnpm prettier` - Format code in both client and server
- `pnpm prettier:ci` - Check code formatting
- `pnpm release` - Create a new release using standard-version

### Client (`cd client`)
- `pnpm run dev` - Start development server with phase.dev environment (default port 3000)
- `pnpm run build` - Build production Next.js application
- `pnpm run start` - Start production server
- `pnpm run eslint` - Lint TypeScript files
- `pnpm run fix` - Run linting and formatting together

### Server (`cd server`)
- `pnpm run start` - Start development server with ts-node-dev hot reload
- `pnpm run build` - Build TypeScript to JavaScript in `dist/`
- `pnpm run generate` - Generate Prisma client from schema
- `pnpm run db:push` - Push Prisma schema changes to MongoDB
- `pnpm run eslint` - Lint TypeScript files
- `pnpm run fix` - Run linting and formatting together

## Architecture

### Client Structure

The client uses Next.js Pages Router architecture:

- **pages/** - Next.js page routes
  - `pages/api/auth/[...nextauth].ts` - NextAuth authentication endpoint with Google, Facebook, and Azure AD providers
  - `pages/_app.tsx` - Application wrapper with providers
  - `pages/index.tsx` - Home page with reading plan
- **components/** - Reusable React components (layout, logo, buttonLink, SEO)
- **helpers/** - Utility functions and constants
  - `getBibleReading()` - Generates 365-day reading plan with OT/NT balance
  - `createCalendar()` - Calendar generation for date selection
  - Calendar logic: Sundays read 3 OT + 2 NT chapters, weekdays read 2 OT + 1 NT chapter
- **providers/** - React context providers (user management)
- **libs/** - External library configurations

### Server Structure

The server uses a domain-driven Express.js architecture:

- **src/domains/** - Feature modules organized by domain
  - `books/` - Bible books data endpoints
  - `user/` - User CRUD operations
  - `track/` - Reading progress tracking (nested under user routes)
  - `ping/` - Health check endpoint
  - Each domain has: `routes.ts`, `service.ts`
- **src/common/** - Shared utilities
  - `config.ts` - Environment configuration (PORT, Bible API settings)
  - `client.ts` - Prisma client initialization
  - `logger.ts` - Winston logger setup
  - `helpers.ts` - Shared utility functions
- **src/index.ts** - Express app initialization and route registration

Route registration pattern: Routes are dynamically registered using `useRoute()` which auto-formats route names (e.g., `userRoutes` becomes `/api/user`). Track routes are specially nested under user: `/api/user/:userId/track`.

### Database Models (Prisma)

```prisma
model User {
  id    String   @id @default(auto()) @map("_id") @db.ObjectId
  email String   @unique
  name  String
  passageTracks PassageTrack[]
}

model PassageTrack {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  userId      String?  @db.ObjectId
  trackDate   String   # Date user marked passage as read
  passageDate String   # Date in reading plan
  user        User?
}
```

## Environment Variables

Both client and server use phase.dev for environment variable management. After running `phase init`, phase.dev will inject variables at runtime via `phase run` commands.

**Client requires:**
- `NEXT_PUBLIC_API_URL` - Server API base URL
- OAuth provider credentials (GOOGLE_CLIENT_ID, FACEBOOK_CLIENT_ID, AZURE_AD_CLIENT_ID, etc.)

**Server requires:**
- `PORT` - Server port (default: 1701)
- `DATABASE_URL` - MongoDB connection string
- `BIBLE_API_KEY`, `BIBLE_API_URL`, `BIBLE_ID` - External Bible API configuration

## Authentication Flow

The app uses NextAuth with three OAuth providers (Google, Facebook, Azure AD). On sign-in:
1. NextAuth callback checks if user exists via `/api/user/email`
2. If user exists, updates their name
3. If new user, creates user record via POST `/api/user`

## Reading Plan Algorithm

The application generates a 365-day Bible reading plan:
- Old Testament chapters are read linearly
- New Testament chapters are read linearly in parallel
- Sundays: 3 OT chapters + 2 NT chapters (5 total)
- Weekdays: 2 OT chapters + 1 NT chapter (3 total)
- When NT is exhausted, remaining days add extra OT chapters

Users track progress by marking passages as read, stored in the PassageTrack model.

## Deployment

- **Client**: Deployed to Netlify (see `netlify.toml`)
- **Server**: Deployed as Docker container to Azure
- **CI/CD**: GitHub Actions builds Docker image and pushes to Azure Container Registry
- Docker build: Multi-stage build (deps → builder → runner) using Node 22 Alpine

## Git Workflow

- Main branch: `main`
- Conventional Commits enforced via commitlint and husky
- Lint-staged runs on pre-commit
- Releases managed via standard-version (semantic versioning)

## Important Notes

- The project uses PNPM workspaces (lerna.json present but managed via PNPM)
- Node version must be 22+ (enforced via preinstall scripts and `.nvmrc`)
- Prisma client must be regenerated after schema changes: `cd server && pnpm generate`
- Client and server have separate `.nvmrc` files - use `fnm use` when switching directories
- Plan markdown files should be saved in the `plans/` directory
