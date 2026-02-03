import React, { useState } from 'react';
import { Logo } from '../components/Logo';
import { Screen } from '../types';

interface LoginScreenProps {
  onNavigate: (screen: Screen) => void;
  onLogin: (email: string, password: string) => void;
  onForgotPassword?: (email: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onNavigate, onLogin, onForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) onLogin(email, password);
  };

  return (
    <div className="flex flex-col h-screen w-full px-8 pt-20 pb-12 items-center justify-between">
      <div className="flex flex-col items-center w-full mt-10">
        <Logo />
        <h1 className="text-3xl font-serif font-bold tracking-tight text-white mb-2">Duelist</h1>
        <p className="text-zinc-500 text-sm font-light tracking-wide">Enter the Arena of Choice</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-4 max-w-sm">
        <div className="space-y-4">
          <div className="relative">
            <input 
              className="w-full glass-input rounded-xl py-4 px-5 text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-duelist-gold/50 transition-all" 
              placeholder="Email" 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <input 
              className="w-full glass-input rounded-xl py-4 px-5 text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-duelist-gold/50 transition-all" 
              placeholder="Password" 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <button 
          type="submit"
          className="w-full bg-white text-black font-bold py-4 rounded-xl ios-shadow active:scale-[0.98] transition-transform text-center mt-6"
        >
          Sign In
        </button>
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => onForgotPassword?.(email)}
            className="text-[11px] uppercase tracking-[0.15em] text-duelist-gold font-semibold hover:text-duelist-gold-light transition-colors"
          >
            Forgot Password?
          </button>
        </div>
      </form>

      <div className="w-full text-center space-y-6 max-w-sm">
        <div className="flex items-center gap-4 px-4">
          <div className="h-[0.5px] flex-1 bg-zinc-800"></div>
          <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-medium">New Associate</span>
          <div className="h-[0.5px] flex-1 bg-zinc-800"></div>
        </div>
        <button 
          onClick={() => onNavigate('register')}
          className="text-[11px] uppercase tracking-[0.2em] text-duelist-gold font-bold hover:text-duelist-gold-light transition-colors"
        >
          Create Account
        </button>
      </div>

      <div className="fixed bottom-1 w-32 h-1 bg-white/20 rounded-full left-1/2 -translate-x-1/2"></div>
    </div>
  );
};

