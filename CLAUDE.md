# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 boilerplate with React 19, TypeScript, Supabase integration, and shadcn/ui components. It uses the App Router architecture.

## Essential Commands

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript compiler
npm run db:generate-types # Generate TypeScript types from Supabase
```

## Architecture

### Key Technologies
- **Frontend**: Next.js 15.3.2, React 19.1.0, TypeScript 5
- **Styling**: Tailwind CSS 4 (alpha), shadcn/ui components
- **Backend**: Supabase (PostgreSQL, Auth, Real-time, Storage)
- **Forms**: react-hook-form with zod validation

### Project Structure
- `src/app/` - Next.js App Router pages and layouts
- `src/components/` - React components
- `src/components/ui/` - 40+ shadcn/ui components (button, card, dialog, form, etc.)
- `src/lib/supabase/` - Supabase client configuration for server/client/middleware
- `src/hooks/` - Custom React hooks

### Path Mapping
- `@/*` maps to `./src/*` - always use this import pattern

## Important Patterns

### Supabase Usage
- Client components: Use `createClient()` from `@/lib/supabase/client`
- Server components: Use `createClient()` from `@/lib/supabase/server`
- Middleware: Use `createClient()` from `@/lib/supabase/middleware`
- Always handle errors: throw in Server Components, setState in Client Components
- Use real-time subscriptions only in Client Components

### Component Patterns
- Always prefer shadcn/ui components: `import { Button } from "@/components/ui/button"`
- Available components: Button, Card, Dialog, Form, Input, Select, Table, Alert, Badge, Tabs, Sheet, etc.
- Use proper component composition (e.g., Card with CardHeader, CardTitle, CardContent)
- TypeScript interfaces for props with `children: React.ReactNode`

### Server vs Client Components
- Default to Server Components
- Use `"use client"` directive only when needed (interactivity, browser APIs, real-time)
- Server Actions are preferred over API routes
- Data fetching in Server Components, real-time in Client Components

### Next.js App Router
- Use these file conventions in `src/app/`:
  - `page.tsx` for pages
  - `layout.tsx` for layouts
  - `loading.tsx` for loading states
  - `error.tsx` for error boundaries
  - `not-found.tsx` for 404 pages

### TypeScript Patterns
- Strict mode is enabled - always provide types
- Use generated database types: `type User = Database['public']['Tables']['users']['Row']`
- React event types: `React.FormEvent<HTMLFormElement>`

## Database Patterns
- Table naming: snake_case plurals (e.g., `users`, `user_profiles`)
- Column naming: snake_case singular (e.g., `user_id`, `created_at`)
- Foreign keys: `{table_singular}_id` format
- Always use `public` schema
- Enable RLS on all tables with policies
- Add table comments describing purpose
- Specify columns in queries instead of `select('*')`

## Deployment
- Optimized for Vercel deployment
- Environment variables required: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`