# Next.js 15 Supabase Boilerplate

A modern, feature-rich boilerplate for building full-stack web applications with Next.js 15, Supabase, and shadcn/ui. Get started in minutes with authentication, database, and beautiful UI components already configured.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-green?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

## ✨ Features

### 🚀 Next.js 15 & React 19
- **App Router** with server and client components
- **Server Actions** for seamless data mutations
- **Streaming** with loading states and Suspense
- **React 19** features including `use()` hook

### 🎨 Beautiful UI Components
- **40+ shadcn/ui components** pre-configured
- **Tailwind CSS 4** with modern utility classes
- **Responsive design** patterns
- **Dark/light mode** theming support
- **Smooth animations** and micro-interactions

### 🔐 Authentication & Database
- **Supabase Auth** with email/password and OAuth
- **PostgreSQL database** with type-safe queries
- **Row Level Security (RLS)** policies
- **Real-time subscriptions** for live data
- **File storage** with upload progress

### 🛠 Developer Experience
- **TypeScript** with strict type checking
- **ESLint** and **Prettier** configuration
- **Auto-generated types** from Supabase schema
- **Path mapping** for clean imports (`@/components`)
- **Cursor Rules** for AI-assisted development

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/nextjs-supabase-boilerplate.git
cd nextjs-supabase-boilerplate
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env.local
```

Fill in your Supabase credentials in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Set up Supabase (Optional)
If you don't have a Supabase project:
```bash
# Install Supabase CLI
npm install -g supabase

# Initialize Supabase
supabase init

# Start local development
supabase start

# Push database schema
supabase db push
```

### 5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application!

## 📁 Project Structure

```
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Homepage
│   ├── components/          # React components
│   │   └── ui/              # shadcn/ui components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions
│   │   ├── supabase/        # Supabase client configuration
│   │   └── utils.ts         # General utilities
├── supabase/                # Supabase configuration
│   ├── migrations/          # Database migrations
│   └── config.toml          # Supabase config
├── .cursor/                 # Cursor AI rules
└── package.json
```

## 🎯 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler
- `npm run db:generate-types` - Generate TypeScript types from Supabase

## 🔧 Configuration

### Tailwind CSS
The project uses Tailwind CSS 4 with a custom configuration. Modify `tailwind.config.ts` to customize your design system.

### shadcn/ui Components
Add new components using the shadcn/ui CLI:
```bash
npx shadcn@latest add button
npx shadcn@latest add card
```

### Supabase Integration
- **Client setup**: `src/lib/supabase/client.ts`
- **Server setup**: `src/lib/supabase/server.ts`
- **Database types**: Generate with `npm run db:generate-types`

## 📚 Usage Examples

### Creating a Server Component with Data Fetching
```tsx
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function PostsPage() {
  const supabase = createClient()
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts?.map(post => (
        <Card key={post.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>{post.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{post.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
```

### Creating a Client Component with Real-time Data
```tsx
'use client'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export function LiveNotifications() {
  const [notifications, setNotifications] = useState([])
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload) => {
          setNotifications(prev => [payload.new, ...prev])
        }
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [supabase])

  return (
    <div className="space-y-4">
      {notifications.map(notification => (
        <div key={notification.id} className="p-4 border rounded-lg">
          {notification.message}
        </div>
      ))}
    </div>
  )
}
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add your environment variables in Vercel dashboard
4. Deploy automatically on every push

### Other Platforms
This project can be deployed to any platform that supports Next.js:
- **Netlify**: Use `@netlify/plugin-nextjs`
- **Railway**: Connect your GitHub repository
- **AWS Amplify**: Use the Next.js build settings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**Built with ❤️ by jakedahn**
