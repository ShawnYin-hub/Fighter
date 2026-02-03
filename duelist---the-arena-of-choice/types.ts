
export enum Screen {
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
  DASHBOARD = 'DASHBOARD',
  NEW_DUEL = 'NEW_DUEL',
  DUEL_RESULT = 'DUEL_RESULT'
}

export interface DuelResult {
  winner: string;
  loser: string;
  rationale: string;
  prosA: string[];
  prosB: string[];
  consA: string[];
  consB: string[];
}

export interface SavedDuel {
  id: string;
  optionA: string;
  optionB: string;
  result: DuelResult;
  timestamp: number;
}
