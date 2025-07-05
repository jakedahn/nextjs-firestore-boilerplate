import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

// Initialize Firebase Admin
function initializeFirebaseAdmin() {
  if (getApps().length === 0) {
    // In development, use default credentials (for emulator)
    if (process.env.NODE_ENV === 'development') {
      return initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
    }
    
    // In production, use base64 encoded service account
    if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
      try {
        const decoded = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf-8');
        const serviceAccount = JSON.parse(decoded);
        
        return initializeApp({
          credential: cert(serviceAccount),
          storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        });
      } catch (error) {
        console.error('Failed to decode base64 service account:', error);
        throw new Error('Invalid Firebase service account configuration');
      }
    }
    
    throw new Error('Firebase Admin SDK credentials not configured. Please set FIREBASE_SERVICE_ACCOUNT_BASE64 environment variable.');
  }
  
  return getApps()[0];
}

const adminApp = initializeFirebaseAdmin();

// Initialize services
export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
export const adminStorage = getStorage(adminApp);

// Configure Firestore settings
adminDb.settings({
  ignoreUndefinedProperties: true,
});

// Helper function to verify ID tokens
export async function verifyIdToken(token: string) {
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return { user: decodedToken, error: null };
  } catch (error) {
    return { user: null, error };
  }
}

// Helper function to create custom tokens
export async function createCustomToken(uid: string, claims?: object) {
  try {
    const token = await adminAuth.createCustomToken(uid, claims);
    return { token, error: null };
  } catch (error) {
    return { token: null, error };
  }
}

// Helper function to get user by email
export async function getUserByEmail(email: string) {
  try {
    const user = await adminAuth.getUserByEmail(email);
    return { user, error: null };
  } catch (error) {
    return { user: null, error };
  }
}

// Helper function to create a new user
export async function createUser(email: string, password: string, displayName?: string) {
  try {
    const user = await adminAuth.createUser({
      email,
      password,
      displayName,
      emailVerified: false,
    });
    return { user, error: null };
  } catch (error) {
    return { user: null, error };
  }
}

export { adminApp };