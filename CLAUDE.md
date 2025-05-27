# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 + Supabase boilerplate application using TypeScript, Tailwind CSS, and shadcn/ui components. The project uses App Router architecture with Server Components and Server Actions.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint

# Type-check (run TypeScript compiler)
npx tsc --noEmit
```

## Architecture

### Tech Stack
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript 5
- **Styling**: Tailwind CSS 4, shadcn/ui components
- **Backend**: Supabase (PostgreSQL, Auth, Real-time, Storage)
- **State Management**: React hooks and Server Components

### Key Directories
- `src/app/` - Next.js App Router pages and layouts
- `src/components/` - React components including 40+ shadcn/ui components
- `src/lib/supabase/` - Supabase client configurations (client, server, middleware)
- `supabase/` - Database migrations, functions, and configuration

### Supabase Integration
The project has three Supabase client configurations:
- `client.ts` - Browser client for client components
- `server.ts` - Server client for Server Components and Actions
- `middleware.ts` - Middleware client for auth checks

### Important Patterns

1. **Server Components by Default**: All components are Server Components unless marked with 'use client'

2. **Supabase Auth**: Authentication is handled via Supabase with middleware protection

3. **Database Access**: Use appropriate Supabase client based on context:
   ```typescript
   // In Server Components/Actions
   import { createClient } from '@/lib/supabase/server'
   
   // In Client Components
   import { createClient } from '@/lib/supabase/client'
   ```

4. **UI Components**: Use existing shadcn/ui components from `src/components/ui/` before creating new ones

5. **Type Safety**: TypeScript strict mode is enabled. Always define proper types for:
   - Database schemas
   - API responses
   - Component props
   - Server Action parameters

6. **Styling**: Use Tailwind CSS classes. Follow existing patterns in components.

## Database Guidelines

When working with Supabase:
- Place migrations in `supabase/migrations/`
- Use Row Level Security (RLS) policies
- Follow PostgreSQL naming conventions (snake_case for tables/columns)
- Define proper foreign key relationships
- Add appropriate indexes for query performance

## Component Development

When creating new components:
1. Check if a similar component exists in `src/components/ui/`
2. Follow the existing component patterns (forwardRef, className merging with cn())
3. Use TypeScript interfaces for props
4. Implement proper accessibility attributes
5. Support both light and dark themes