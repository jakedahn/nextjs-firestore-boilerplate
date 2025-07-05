import { Timestamp } from 'firebase/firestore';

// User profile type
export interface UserProfile {
  id?: string;
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  createdAt: Timestamp | { seconds: number; nanoseconds: number };
  updatedAt: Timestamp | { seconds: number; nanoseconds: number };
}

// Example Todo type for demonstration
export interface Todo {
  id?: string;
  title: string;
  description?: string;
  completed: boolean;
  userId: string;
  createdAt?: Timestamp | { seconds: number; nanoseconds: number };
  updatedAt?: Timestamp | { seconds: number; nanoseconds: number };
}

// Example Post type for demonstration
export interface Post {
  id?: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  published: boolean;
  tags: string[];
  likes: number;
  createdAt?: Timestamp | { seconds: number; nanoseconds: number };
  updatedAt?: Timestamp | { seconds: number; nanoseconds: number };
}

// Counter type for the counter app
export interface Counter {
  id?: string;
  userId: string;
  count: number;
  lastUpdated?: Timestamp | { seconds: number; nanoseconds: number };
  createdAt?: Timestamp | { seconds: number; nanoseconds: number };
  updatedAt?: Timestamp | { seconds: number; nanoseconds: number };
}

// Collection names enum
export enum Collections {
  USERS = 'users',
  TODOS = 'todos',
  POSTS = 'posts',
  COUNTERS = 'counters',
}

// Auth error types
export interface AuthError {
  code: string;
  message: string;
}

// Common response types
export interface AuthResponse<T = any> {
  data?: T;
  error?: string | null;
}

export interface FirestoreResponse<T = any> {
  data?: T;
  error?: string | null;
}