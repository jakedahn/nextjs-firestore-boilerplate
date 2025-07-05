import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';
import { auth } from './client';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './client';

// Auth providers
export const googleProvider = new GoogleAuthProvider();

// Sign up with email and password
export async function signUp(email: string, password: string, displayName?: string) {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update display name if provided
    if (displayName) {
      await updateProfile(user, { displayName });
    }
    
    // Send verification email
    await sendEmailVerification(user);
    
    // Create user profile in Firestore
    await createUserProfile(user);
    
    return { user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
}

// Sign in with email and password
export async function signIn(email: string, password: string) {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return { user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
}

// Sign in with Google
export async function signInWithGoogle() {
  try {
    const { user } = await signInWithPopup(auth, googleProvider);
    
    // Create user profile if it doesn't exist
    const profileExists = await checkUserProfile(user.uid);
    if (!profileExists) {
      await createUserProfile(user);
    }
    
    return { user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
}

// Sign out
export async function logOut() {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
}

// Send password reset email
export async function resetPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
}

// Update user password
export async function updateUserPassword(currentPassword: string, newPassword: string) {
  try {
    const user = auth.currentUser;
    if (!user || !user.email) throw new Error('No authenticated user');
    
    // Re-authenticate user
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    
    // Update password
    await updatePassword(user, newPassword);
    
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
}

// Create user profile in Firestore
async function createUserProfile(user: User) {
  const userRef = doc(db, 'users', user.uid);
  
  const userData = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || null,
    photoURL: user.photoURL || null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    emailVerified: user.emailVerified,
  };
  
  await setDoc(userRef, userData, { merge: true });
}

// Check if user profile exists
async function checkUserProfile(uid: string): Promise<boolean> {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  return userSnap.exists();
}

// Get current user profile
export async function getUserProfile(uid: string) {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { profile: userSnap.data(), error: null };
    } else {
      return { profile: null, error: 'User profile not found' };
    }
  } catch (error: any) {
    return { profile: null, error: error.message };
  }
}

// Subscribe to auth state changes
export function onAuthStateChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// Get current user
export function getCurrentUser() {
  return auth.currentUser;
}