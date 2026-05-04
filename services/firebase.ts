import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, serverTimestamp, getDocFromServer, onSnapshot, updateDoc, increment } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// CRITICAL: Validate Connection to Firestore as per integration guidelines
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error: any) {
    if (error?.message?.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();

const googleProvider = new GoogleAuthProvider();

export { onAuthStateChanged, onSnapshot };
export type { User };

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  importCount: number;
  optimizeCount: number;
  enhanceCount: number;
  importLimit: number;
  optimizeLimit: number;
  enhanceLimit: number;
  isPremium: boolean;
  planType?: 'free' | 'basic' | 'pro' | 'elite';
}

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Store/update user data in Firestore
    const userPath = `users/${user.uid}`;
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          displayName: user.displayName || 'User',
          email: user.email || '',
          photoURL: user.photoURL || '',
          lastLogin: serverTimestamp(),
          importCount: 0,
          optimizeCount: 0,
          enhanceCount: 0,
          importLimit: 2,
          optimizeLimit: 2,
          enhanceLimit: 5,
          isPremium: false,
          planType: 'free',
        });
      } else {
        const data = userDoc.data();
        await updateDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email || data.email || '',
          displayName: user.displayName || data.displayName || 'User',
          photoURL: user.photoURL || data.photoURL || '',
          lastLogin: serverTimestamp(),
          // Backfill new fields if missing
          importCount: data.importCount ?? 0,
          optimizeCount: data.optimizeCount ?? 0,
          enhanceCount: data.enhanceCount ?? 0,
          importLimit: data.importLimit ?? 2,
          optimizeLimit: data.optimizeLimit ?? 2,
          enhanceLimit: data.enhanceLimit ?? 5,
          isPremium: data.isPremium ?? false,
          planType: data.planType ?? 'free',
        });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, userPath);
    }
    
    return user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const incrementUsage = async (uid: string, field: 'importCount' | 'optimizeCount' | 'enhanceCount') => {
  const userPath = `users/${uid}`;
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    const data = userDoc.data();
    if (!data) throw new Error("User document not found");

    await updateDoc(doc(db, 'users', uid), {
      uid,
      email: data.email,
      [field]: increment(1),
      lastLogin: serverTimestamp()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, userPath);
  }
};

export const decrementUsage = async (uid: string, field: 'importLimit' | 'optimizeLimit' | 'enhanceLimit') => {
  const userPath = `users/${uid}`;
  try {
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, {
      [field]: increment(-1),
      lastActivity: serverTimestamp()
    });
  } catch (err) {
    console.error(`Error decrementing ${field}:`, err);
  }
};

export const refillUsage = async (uid: string, credits: { imports: number, audits: number, enhancements: number }, planType?: 'basic' | 'pro' | 'elite') => {
  const userPath = `users/${uid}`;
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    const data = userDoc.data();
    if (!data) throw new Error("User document not found");

    await updateDoc(doc(db, 'users', uid), {
      uid,
      email: data.email,
      importLimit: increment(credits.imports),
      enhanceLimit: increment(credits.enhancements),
      optimizeLimit: increment(credits.audits),
      isPremium: true,
      planType: planType || data.planType || 'basic',
      lastLogin: serverTimestamp()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, userPath);
  }
};

export const upgradeToPremium = async (uid: string) => {
  const userPath = `users/${uid}`;
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    const data = userDoc.data();
    if (!data) throw new Error("User document not found");

    await updateDoc(doc(db, 'users', uid), {
      uid,
      email: data.email,
      isPremium: true,
      lastLogin: serverTimestamp()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, userPath);
  }
};

