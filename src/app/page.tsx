'use client';

import { useAuth } from '@/lib/firebase/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Icons } from '@/components/ui/icons';

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-6xl">
          Next.js + Firestore Boilerplate
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          A modern starter template with authentication, real-time database, and more.
        </p>

        {loading ? (
          <Icons.spinner className="mx-auto h-8 w-8 animate-spin" />
        ) : user ? (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Welcome back, {user.email}!
            </p>
            <Link href="/dashboard">
              <Button size="lg">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex justify-center gap-4">
            <Link href="/auth/login">
              <Button size="lg">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="lg" variant="outline">
                Sign Up
              </Button>
            </Link>
          </div>
        )}
      </div>

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Firebase Authentication</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Secure authentication with email/password and social providers like Google.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Firestore Database</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Real-time NoSQL database with offline support and automatic synchronization.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Type-Safe Development</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Full TypeScript support with type-safe database queries and mutations.
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 text-center">
        <h2 className="mb-4 text-2xl font-semibold">Try it out!</h2>
        <Link href="/counter">
          <Button size="lg" variant="outline">
            <Icons.add className="mr-2 h-4 w-4" />
            Open Counter Demo
          </Button>
        </Link>
        <p className="mt-2 text-sm text-muted-foreground">
          A simple counter that syncs in real-time across devices
        </p>
      </div>
    </div>
  );
}