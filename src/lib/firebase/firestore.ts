import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QueryConstraint,
  onSnapshot,
  serverTimestamp,
  writeBatch,
  DocumentReference,
  CollectionReference,
  QueryDocumentSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { db } from './client';

// Type for Firestore timestamps
export type FirestoreTimestamp = Timestamp | { seconds: number; nanoseconds: number };

// Base document interface
export interface BaseDocument {
  id?: string;
  createdAt?: FirestoreTimestamp;
  updatedAt?: FirestoreTimestamp;
}

// Generic CRUD operations
export class FirestoreService<T extends BaseDocument> {
  constructor(private collectionName: string) {}

  // Get collection reference
  private getCollectionRef(): CollectionReference {
    return collection(db, this.collectionName);
  }

  // Get document reference
  private getDocRef(id: string): DocumentReference {
    return doc(db, this.collectionName, id);
  }

  // Create a new document
  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = doc(this.getCollectionRef());
      const docData = {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      await setDoc(docRef, docData);
      return docRef.id;
    } catch (error) {
      console.error(`Error creating document in ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Get a document by ID
  async getById(id: string): Promise<T | null> {
    try {
      const docSnap = await getDoc(this.getDocRef(id));
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      }
      
      return null;
    } catch (error) {
      console.error(`Error getting document ${id} from ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Update a document
  async update(id: string, data: Partial<Omit<T, 'id' | 'createdAt'>>): Promise<void> {
    try {
      const updateData = {
        ...data,
        updatedAt: serverTimestamp(),
      };
      
      await updateDoc(this.getDocRef(id), updateData);
    } catch (error) {
      console.error(`Error updating document ${id} in ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Delete a document
  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(this.getDocRef(id));
    } catch (error) {
      console.error(`Error deleting document ${id} from ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Get all documents with optional constraints
  async getAll(constraints: QueryConstraint[] = []): Promise<T[]> {
    try {
      const q = query(this.getCollectionRef(), ...constraints);
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as T));
    } catch (error) {
      console.error(`Error getting documents from ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Get documents with pagination
  async getPaginated(
    constraints: QueryConstraint[] = [],
    pageSize: number = 10,
    lastDoc?: QueryDocumentSnapshot
  ): Promise<{ data: T[]; lastDoc: QueryDocumentSnapshot | null }> {
    try {
      const baseConstraints = [...constraints, limit(pageSize)];
      
      if (lastDoc) {
        baseConstraints.push(startAfter(lastDoc));
      }
      
      const q = query(this.getCollectionRef(), ...baseConstraints);
      const querySnapshot = await getDocs(q);
      
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as T));
      
      const lastDocument = querySnapshot.docs[querySnapshot.docs.length - 1] || null;
      
      return { data, lastDoc: lastDocument };
    } catch (error) {
      console.error(`Error getting paginated documents from ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Subscribe to real-time updates
  subscribe(
    constraints: QueryConstraint[] = [],
    onUpdate: (data: T[]) => void,
    onError?: (error: Error) => void
  ): () => void {
    const q = query(this.getCollectionRef(), ...constraints);
    
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as T));
        onUpdate(data);
      },
      (error) => {
        console.error(`Error in real-time subscription for ${this.collectionName}:`, error);
        onError?.(error);
      }
    );
    
    return unsubscribe;
  }

  // Subscribe to a single document
  subscribeToDoc(
    id: string,
    onUpdate: (data: T | null) => void,
    onError?: (error: Error) => void
  ): () => void {
    const docRef = this.getDocRef(id);
    
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          onUpdate({ id: docSnap.id, ...docSnap.data() } as T);
        } else {
          onUpdate(null);
        }
      },
      (error) => {
        console.error(`Error in real-time subscription for document ${id}:`, error);
        onError?.(error);
      }
    );
    
    return unsubscribe;
  }

  // Batch operations
  async batchCreate(items: Array<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>): Promise<string[]> {
    try {
      const batch = writeBatch(db);
      const ids: string[] = [];
      
      items.forEach(item => {
        const docRef = doc(this.getCollectionRef());
        const docData = {
          ...item,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        
        batch.set(docRef, docData);
        ids.push(docRef.id);
      });
      
      await batch.commit();
      return ids;
    } catch (error) {
      console.error(`Error batch creating documents in ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Batch update
  async batchUpdate(updates: Array<{ id: string; data: Partial<Omit<T, 'id' | 'createdAt'>> }>): Promise<void> {
    try {
      const batch = writeBatch(db);
      
      updates.forEach(({ id, data }) => {
        const docRef = this.getDocRef(id);
        const updateData = {
          ...data,
          updatedAt: serverTimestamp(),
        };
        
        batch.update(docRef, updateData);
      });
      
      await batch.commit();
    } catch (error) {
      console.error(`Error batch updating documents in ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Batch delete
  async batchDelete(ids: string[]): Promise<void> {
    try {
      const batch = writeBatch(db);
      
      ids.forEach(id => {
        const docRef = this.getDocRef(id);
        batch.delete(docRef);
      });
      
      await batch.commit();
    } catch (error) {
      console.error(`Error batch deleting documents from ${this.collectionName}:`, error);
      throw error;
    }
  }
}

// Export commonly used Firestore functions
export {
  collection,
  doc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  Timestamp,
};