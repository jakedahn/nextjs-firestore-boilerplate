# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 boilerplate with React 19, TypeScript, Firebase/Firestore integration, and shadcn/ui components. It uses the App Router architecture.

## Essential Commands

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript compiler
```

## Architecture

### Key Technologies
- **Frontend**: Next.js 15.3.5, React 19.1.0, TypeScript 5
- **Styling**: Tailwind CSS 4 (alpha), shadcn/ui components
- **Backend**: Firebase (Firestore, Auth, Storage)
- **Forms**: react-hook-form with zod validation

### Project Structure
- `src/app/` - Next.js App Router pages and layouts
- `src/app/auth/` - Authentication pages (login, register, logout)
- `src/app/dashboard/` - Protected dashboard pages
- `src/components/` - React components
- `src/components/ui/` - 40+ shadcn/ui components (button, card, dialog, form, etc.)
- `src/lib/firebase/` - Firebase client configuration and utilities
- `src/hooks/` - Custom React hooks

### Path Mapping
- `@/*` maps to `./src/*` - always use this import pattern

## Important Patterns

### Firebase/Firestore Usage
- Client components: Use imports from `@/lib/firebase/client`
- Server components: Use imports from `@/lib/firebase/server`
- Auth utilities: Use imports from `@/lib/firebase/auth`
- Database operations: Use `FirestoreService` class from `@/lib/firebase/firestore`
- Type definitions: Import from `@/lib/firebase/types`

### Authentication Patterns
- Use `AuthProvider` context for accessing user state
- Protected routes are handled by middleware.ts
- Authentication flows:
  - Email/Password signup with email verification
  - Email/Password signin
  - Google OAuth signin
  - Password reset via email

### Component Patterns
- Always prefer shadcn/ui components: `import { Button } from "@/components/ui/button"`
- Available components: Button, Card, Dialog, Form, Input, Select, Table, Alert, Badge, Tabs, Sheet, etc.
- Use proper component composition (e.g., Card with CardHeader, CardTitle, CardContent)
- TypeScript interfaces for props with `children: React.ReactNode`

### Server vs Client Components
- Default to Server Components
- Use `"use client"` directive only when needed (interactivity, browser APIs, real-time)
- Data fetching in Server Components, real-time subscriptions in Client Components

### Next.js App Router
- Use these file conventions in `src/app/`:
  - `page.tsx` for pages
  - `layout.tsx` for layouts
  - `loading.tsx` for loading states
  - `error.tsx` for error boundaries
  - `not-found.tsx` for 404 pages
  - `route.ts` for API routes

### TypeScript Patterns
- Strict mode is enabled - always provide types
- Use defined types from `@/lib/firebase/types`
- React event types: `React.FormEvent<HTMLFormElement>`

## Firestore Patterns
- Collection naming: lowercase, plural (e.g., `users`, `todos`, `posts`)
- Document structure:
  - Always include `createdAt` and `updatedAt` timestamps
  - Use `serverTimestamp()` for automatic timestamps
- Use `FirestoreService` class for CRUD operations:
  ```typescript
  const todosService = new FirestoreService<Todo>(Collections.TODOS);
  await todosService.create({ title: 'New Todo', userId: user.uid });
  ```
- Real-time subscriptions:
  ```typescript
  const unsubscribe = todosService.subscribe(
    [where('userId', '==', user.uid)],
    (todos) => setTodos(todos)
  );
  ```
- Always handle errors appropriately

## Security Patterns
- Environment variables:
  - `NEXT_PUBLIC_FIREBASE_*` for client-side config
  - `FIREBASE_SERVICE_ACCOUNT_KEY` for server-side admin SDK
- Never expose service account credentials
- Use Firebase Security Rules for Firestore
- Validate user permissions in server-side code

## Deployment
- Optimized for Vercel deployment
- Required environment variables:
  - `NEXT_PUBLIC_FIREBASE_API_KEY`
  - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
  - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
  - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
  - `NEXT_PUBLIC_FIREBASE_APP_ID`
  - `FIREBASE_SERVICE_ACCOUNT_BASE64` (base64 encoded service account JSON for production)

## Development Workflow Reminders
- Do not try to run the dev server, it is always running in another tab

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.