
import React from 'react';
import { SavedDuel } from '../types';

interface DashboardScreenProps {
  user: { email: string } | null;
  duels: SavedDuel[];
  onNewDuel: () => void;
  onViewDuel: (duel: SavedDuel) => void;
  onLogout: () => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ user, duels, onNewDuel, onViewDuel, onLogout }) => {
  return (
    <div className="flex flex-col h-screen w-full px-6 pt-16 pb-12 animate-in fade-in duration-500 overflow-y-auto">
      <div className="flex justify-between items-start w-full mb-10">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight text-duelist-black">Arena History</h1>
          <p className="text-zinc-400 text-sm font-light">Welcome back, {user?.email.split('@')[0]}</p>
        </div>
        <button 
          onClick={onLogout}
          className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 hover:text-black transition-colors pt-2"
        >
          Log Out
        </button>
      </div>

      <div className="flex-1 space-y-4 pb-24">
        {duels.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-zinc-300 font-serif text-2xl font-bold">?</span>
            </div>
            <p className="text-zinc-400 font-serif italic">Your arena is currently empty.</p>
            <p className="text-zinc-300 text-[10px] uppercase tracking-widest mt-2">Start your first duel below</p>
          </div>
        ) : (
          duels.map((duel) => (
            <button
              key={duel.id}
              onClick={() => onViewDuel(duel)}
              className="w-full bg-white rounded-2xl p-6 ios-shadow flex items-center justify-between group active:scale-[0.98] transition-all"
            >
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold tracking-tight">{duel.optionA}</span>
                  <span className="text-[10px] text-duelist-gold font-bold">VS</span>
                  <span className="text-sm font-semibold tracking-tight">{duel.optionB}</span>
                </div>
                <p className="text-[10px] uppercase tracking-widest text-zinc-400">
                  Winner: <span className="text-black font-bold">{duel.result.winner}</span>
                </p>
              </div>
              <div className="w-8 h-8 rounded-full border border-zinc-100 flex items-center justify-center group-hover:bg-duelist-black group-hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))
        )}
      </div>

      <div className="fixed bottom-10 left-0 right-0 px-6 flex justify-center pointer-events-none">
        <button 
          onClick={onNewDuel}
          className="pointer-events-auto w-full max-w-sm bg-duelist-black text-white font-bold py-5 rounded-2xl ios-shadow active:scale-[0.98] transition-transform flex items-center justify-center gap-3"
        >
          <span className="text-duelist-gold text-xl">+</span>
          <span className="uppercase tracking-[0.2em] text-xs">Enter New Duel</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardScreen;
