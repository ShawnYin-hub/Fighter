
export type Language = 'en' | 'zh';

export interface Decision {
  id: string;
  category: string;
  winner: string;
  options: string[];
  history: string[]; // List of defeated options in order
  date: string;
}

export interface DecisionBreakdown {
  options: string[];
  category: string;
  logicQuote: string;
}
