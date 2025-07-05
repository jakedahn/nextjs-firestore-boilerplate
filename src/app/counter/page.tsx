'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/firebase/auth-context';
import { FirestoreService } from '@/lib/firebase/firestore';
import { Counter, Collections } from '@/lib/firebase/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';

const countersService = new FirestoreService<Counter>(Collections.COUNTERS);

export default function CounterPage() {
  const { user, loading: authLoading } = useAuth();
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  // Use user ID if authenticated, otherwise use 'anonymous'
  const counterId = user ? user.uid : 'anonymous';

  useEffect(() => {
    // Subscribe to real-time updates for the counter
    const unsubscribe = countersService.subscribeToDoc(
      counterId,
      (counterData) => {
        if (counterData) {
          setCount(counterData.count);
        } else {
          // If no counter exists, initialize with 0
          setCount(0);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error subscribing to counter:', error);
        setError('Failed to load counter');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [counterId]);

  const updateCounter = async (newCount: number) => {
    setUpdating(true);
    setError(null);

    try {
      // Check if counter exists
      const existingCounter = await countersService.getById(counterId);

      if (existingCounter) {
        // Update existing counter
        await countersService.update(counterId, {
          count: newCount,
          lastUpdated: serverTimestamp() as any,
        });
      } else {
        // Create new counter with the document ID matching the user ID
        const counterRef = doc(db, Collections.COUNTERS, counterId);
        await setDoc(counterRef, {
          userId: counterId,
          count: newCount,
          lastUpdated: serverTimestamp(),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error('Error updating counter:', error);
      setError('Failed to update counter');
    } finally {
      setUpdating(false);
    }
  };

  const increment = () => updateCounter(count + 1);
  const decrement = () => updateCounter(count - 1);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Persistent Counter</CardTitle>
            <CardDescription>
              {user 
                ? `Your personal counter (${user.email})`
                : 'Shared anonymous counter'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
                {error}
              </div>
            )}
            
            <div className="text-center">
              <div className="text-6xl font-bold tabular-nums">
                {count}
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button
                size="lg"
                variant="outline"
                onClick={decrement}
                disabled={updating}
              >
                <Icons.remove className="h-4 w-4" />
              </Button>
              
              <Button
                size="lg"
                onClick={increment}
                disabled={updating}
              >
                <Icons.add className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              {updating && <Icons.spinner className="inline h-4 w-4 animate-spin mr-2" />}
              This counter is synced in real-time across all your devices
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Button variant="ghost" onClick={() => window.location.href = '/'}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}