import React, { useState } from 'react';
import { Logo } from '../components/Logo';

interface SignUpScreenProps {
  onBackToLogin: () => void;
  onSignUpComplete: (email: string, password: string, name: string) => void;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ onBackToLogin, onSignUpComplete }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="flex flex-col h-screen w-full px-8 pt-20 pb-12 items-center justify-between max-w-md mx-auto animate-in slide-in-from-right duration-500">
      <div className="flex flex-col items-center w-full mt-6">
        <Logo />
        <h1 className="text-3xl font-serif font-bold tracking-tight text-duelist-black mb-2">Duelist</h1>
        <p className="text-zinc-500 text-sm font-light tracking-wide">Join the Arena of Choice</p>
      </div>

      <div className="w-full space-y-4">
        <div className="space-y-3">
          <div className="relative">
            <input 
              className="w-full ios-input rounded-xl py-4 px-5 text-black focus:outline-none transition-all" 
              placeholder="Name" 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="relative">
            <input 
              className="w-full ios-input rounded-xl py-4 px-5 text-black focus:outline-none transition-all" 
              placeholder="Email" 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative">
            <input 
              className="w-full ios-input rounded-xl py-4 px-5 text-black focus:outline-none transition-all" 
              placeholder="Password" 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <button 
          onClick={() => onSignUpComplete(email || 'newbie@duelist.com', password, name)}
          className="w-full bg-duelist-black text-white font-bold py-4 rounded-xl ios-shadow active:scale-[0.98] transition-transform text-center mt-6"
        >
          Create Account
        </button>
        <div className="text-center pt-2">
          <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-medium">By signing up, you agree to the Arena Terms</p>
        </div>
      </div>

      <div className="w-full text-center space-y-6">
        <div className="flex items-center gap-4 px-4">
          <div className="h-[0.5px] flex-1 bg-zinc-200"></div>
          <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-medium">Already Rank One?</span>
          <div className="h-[0.5px] flex-1 bg-zinc-200"></div>
        </div>
        <button 
          onClick={onBackToLogin}
          className="text-[11px] uppercase tracking-[0.2em] text-duelist-black font-serif font-bold hover:opacity-70 transition-opacity"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

export default SignUpScreen;

