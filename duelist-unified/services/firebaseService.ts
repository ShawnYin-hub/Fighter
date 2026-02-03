import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  FacebookAuthProvider,
  TwitterAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  Firestore
} from 'firebase/firestore';
import { Decision } from '../types';

// Firebase 配置（需要用户提供）
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || '',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.FIREBASE_APP_ID || ''
};

// 初始化 Firebase
let app: any = null;
let auth: any = null;
let db: Firestore | null = null;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.warn('Firebase initialization failed. Using local storage only.', error);
}

// 认证方法
export const authService = {
  // 邮箱密码登录
  signInWithEmail: async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase not initialized');
    return await signInWithEmailAndPassword(auth, email, password);
  },

  // 邮箱密码注册
  signUpWithEmail: async (email: string, password: string, displayName?: string) => {
    if (!auth) throw new Error('Firebase not initialized');
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      try {
        await updateProfile(cred.user, { displayName });
      } catch (e) {
        // ignore profile update issues
      }
    }
    return cred;
  },

  // 重置密码邮件
  sendPasswordReset: async (email: string) => {
    if (!auth) throw new Error('Firebase not initialized');
    return await sendPasswordResetEmail(auth, email);
  },

  // Google 登录
  signInWithGoogle: async () => {
    if (!auth) throw new Error('Firebase not initialized');
    const provider = new GoogleAuthProvider();
    return await signInWithPopup(auth, provider);
  },

  // Facebook 登录
  signInWithFacebook: async () => {
    if (!auth) throw new Error('Firebase not initialized');
    const provider = new FacebookAuthProvider();
    return await signInWithPopup(auth, provider);
  },

  // Twitter 登录
  signInWithTwitter: async () => {
    if (!auth) throw new Error('Firebase not initialized');
    const provider = new TwitterAuthProvider();
    return await signInWithPopup(auth, provider);
  },

  // GitHub 登录
  signInWithGithub: async () => {
    if (!auth) throw new Error('Firebase not initialized');
    const provider = new GithubAuthProvider();
    return await signInWithPopup(auth, provider);
  },

  // 登出
  signOut: async () => {
    if (!auth) throw new Error('Firebase not initialized');
    return await signOut(auth);
  },

  // 监听认证状态
  onAuthStateChanged: (callback: (user: User | null) => void) => {
    if (!auth) {
      callback(null);
      return () => {};
    }
    return onAuthStateChanged(auth, callback);
  },

  // 获取当前用户
  getCurrentUser: () => {
    return auth?.currentUser || null;
  }
};

export interface UserProfileDoc {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: any;
  updatedAt: any;
}

export const userService = {
  ensureUserProfile: async (user: User) => {
    if (!db) return null;
    const ref = doc(db, 'users', user.uid);
    const snap = await getDoc(ref);
    if (snap.exists()) return snap.data() as UserProfileDoc;
    const docData: UserProfileDoc = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    await setDoc(ref, docData, { merge: true });
    return docData;
  },

  getUserProfile: async (uid: string) => {
    if (!db) return null;
    const ref = doc(db, 'users', uid);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as UserProfileDoc) : null;
  },

  updateUserProfile: async (uid: string, patch: Partial<UserProfileDoc>) => {
    if (!db) return null;
    const ref = doc(db, 'users', uid);
    await setDoc(ref, { ...patch, updatedAt: Timestamp.now() }, { merge: true });
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as UserProfileDoc) : null;
  }
};

// 数据库方法
export const dbService = {
  // 保存决策
  saveDecision: async (decision: Decision) => {
    if (!db) {
      // 降级到 localStorage
      const saved = localStorage.getItem('duelist_history');
      const history = saved ? JSON.parse(saved) : [];
      history.unshift(decision);
      localStorage.setItem('duelist_history', JSON.stringify(history));
      return decision;
    }

    const user = auth?.currentUser;
    if (!user) throw new Error('User not authenticated');

    const decisionRef = doc(db, 'decisions', decision.id);
    await setDoc(decisionRef, {
      ...decision,
      userId: user.uid,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });

    return decision;
  },

  // 获取用户的决策列表
  getDecisions: async (userId: string, limitCount: number = 50) => {
    if (!db) {
      // 降级到 localStorage
      const saved = localStorage.getItem('duelist_history');
      return saved ? JSON.parse(saved) : [];
    }

    const decisionsRef = collection(db, 'decisions');
    const q = query(
      decisionsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  // 获取单个决策
  getDecision: async (decisionId: string) => {
    if (!db) {
      const saved = localStorage.getItem('duelist_history');
      const history = saved ? JSON.parse(saved) : [];
      return history.find((d: Decision) => d.id === decisionId) || null;
    }

    const decisionRef = doc(db, 'decisions', decisionId);
    const snapshot = await getDoc(decisionRef);
    return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
  },

  // 更新决策
  updateDecision: async (decision: Decision) => {
    if (!db) {
      const saved = localStorage.getItem('duelist_history');
      const history = saved ? JSON.parse(saved) : [];
      const index = history.findIndex((d: Decision) => d.id === decision.id);
      if (index !== -1) {
        history[index] = decision;
        localStorage.setItem('duelist_history', JSON.stringify(history));
      }
      return decision;
    }

    const user = auth?.currentUser;
    if (!user) throw new Error('User not authenticated');

    const decisionRef = doc(db, 'decisions', decision.id);
    await setDoc(decisionRef, {
      ...decision,
      userId: user.uid,
      updatedAt: Timestamp.now()
    }, { merge: true });

    return decision;
  }
};
