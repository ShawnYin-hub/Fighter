
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
  options: string[]; // Current active pool
  eliminated: string[]; // Graveyard
  winner?: string;
  summary?: string;
  efficiency?: number;
}

export type ViewState = 'HISTORY' | 'INPUT' | 'EDITOR' | 'ARENA' | 'JOURNEY';
