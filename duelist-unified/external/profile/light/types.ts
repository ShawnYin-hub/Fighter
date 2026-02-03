export interface UserStats {
  totalDuels: string;
  winRate: string;
  lastDecision: string;
  logicScore: number;
  clarityLevel: number;
  associateId: string;
  progress: number;
}

export interface DecisionAnalysis {
  style: string;
  summary: string;
  recommendation: string;
  logicalFallacies: string[];
}

