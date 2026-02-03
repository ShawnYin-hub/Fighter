export type Language = 'en' | 'zh';
export type Theme = 'light' | 'dark';

export enum DecisionStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  COMPLETED = 'completed'
}

export interface Decision {
  id: string;
  title: string;
  category: string;
  date: string;
  status: DecisionStatus;
  options: string[];
  eliminated: string[];
  winner?: string;
  summary?: string;
  efficiency?: number;
  history?: string[]; // For backward compatibility with duelist
  userId?: string; // Firebase user ID
  createdAt?: any; // Firestore timestamp
  updatedAt?: any; // Firestore timestamp
  tags?: string[]; // auto or AI-assigned tags (scene, etc.)
  pinned?: boolean; // whether user pinned this decision in history
  reflection?: string; // user-written post-mortem
  reflectionAdvice?: string; // AI advice for future similar decisions
}

export interface DecisionBreakdown {
  options: string[];
  category: string;
  logicQuote: string;
}

export type ViewState = 'HISTORY' | 'INPUT' | 'EDITOR' | 'ARENA' | 'JOURNEY' | 'MAP';
