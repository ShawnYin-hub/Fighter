
export type Screen = 'login' | 'register' | 'dashboard';

export interface User {
  name?: string;
  email: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}
