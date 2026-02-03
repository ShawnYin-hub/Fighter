export enum Screen {
  PROFILE = 'PROFILE',
  DUEL = 'DUEL',
  HISTORY = 'HISTORY',
  SETTINGS = 'SETTINGS'
}

export interface UserStats {
  totalDuels: number;
  winRate: string;
  lastDecision: string;
  logicScore: string;
  clarityScore: number;
  associateId: string;
}

export interface DuelResult {
  score: number;
  verdict: string;
  analysis: string;
  timestamp: string;
}

