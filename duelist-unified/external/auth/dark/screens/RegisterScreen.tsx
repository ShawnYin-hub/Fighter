import React, { useState } from 'react';
import { Logo } from '../components/Logo';
import { Screen } from '../types';

interface RegisterScreenProps {
  onNavigate: (screen: Screen) => void;
  onRegister: (email: string, password: string, name: string) => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ onNavigate, onRegister }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && name) onRegister(email, password, name);
  };

  return (
    <div className="flex flex-col h-screen w-full px-8 pt-16 pb-12 items-center justify-between">
      <div className="flex flex-col items-center w-full mt-4">
        <Logo />
        <h1 className="text-3xl font-serif font-bold tracking-tight text-white mb-2">Duelist</h1>
        <p className="text-zinc-500 text-sm font-light tracking-wide">Join the Arena of Choice</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-4 max-w-sm">
        <div className="space-y-4">
          <div className="relative">
            <input 
              className="w-full glass-input rounded-xl py-4 px-5 text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-duelist-gold/50 transition-all" 
              placeholder="Name" 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
          Create Account
        </button>
        <div className="text-center pt-4">
          <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-4">By joining, you agree to the Rules of Engagement</p>
        </div>
      </form>

      <div className="w-full text-center space-y-6 max-w-sm">
        <div className="flex items-center gap-4 px-4">
          <div className="h-[0.5px] flex-1 bg-zinc-800"></div>
          <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-medium">Already Rank One</span>
          <div className="h-[0.5px] flex-1 bg-zinc-800"></div>
        </div>
        <button 
          onClick={() => onNavigate('login')}
          className="text-[11px] uppercase tracking-[0.2em] text-duelist-gold font-bold hover:text-duelist-gold-light transition-colors"
        >
          Sign In
        </button>
      </div>

      <div className="fixed bottom-1 w-32 h-1 bg-white/20 rounded-full left-1/2 -translate-x-1/2"></div>
    </div>
  );
};

