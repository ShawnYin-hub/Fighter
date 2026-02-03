
import React from 'react';
import { SavedDuel } from '../types';

interface DuelResultScreenProps {
  duel: SavedDuel | null;
  onBack: () => void;
}

const DuelResultScreen: React.FC<DuelResultScreenProps> = ({ duel, onBack }) => {
  if (!duel) return null;

  return (
    <div className="flex flex-col h-screen w-full px-6 pt-16 pb-12 animate-in zoom-in-95 duration-500 overflow-y-auto bg-gallery-white">
      <div className="flex items-center mb-8">
        <button onClick={onBack} className="p-2 -ml-2 text-duelist-black hover:opacity-50">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="flex-1 text-center font-serif font-bold text-lg uppercase tracking-[0.2em] pr-4">Duel Verdict</h1>
      </div>

      {/* Hero Section */}
      <div className="w-full flex flex-col items-center mb-10">
        <div className="w-24 h-24 rounded-full bg-duelist-black flex items-center justify-center badge-glow mb-6 animate-bounce">
          <span className="text-duelist-gold font-serif text-4xl font-bold tracking-tighter">🏆</span>
        </div>
        <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-400 mb-2">The Winner</h2>
        <h1 className="text-4xl font-serif font-bold text-duelist-black text-center">{duel.result.winner}</h1>
      </div>

      {/* Rationale */}
      <div className="bg-white rounded-3xl p-8 ios-shadow mb-8 relative">
        <div className="absolute -top-3 left-8 bg-duelist-black text-white text-[8px] uppercase tracking-widest font-bold py-1 px-3 rounded-full">Rationale</div>
        <p className="text-zinc-600 leading-relaxed font-light italic">"{duel.result.rationale}"</p>
      </div>

      {/* Comparative Lists */}
      <div className="space-y-12 pb-24">
        {/* Option A Analysis */}
        <section>
          <h3 className="text-xs uppercase tracking-widest font-bold text-zinc-400 mb-4 flex items-center gap-2">
            Analysis of <span className="text-black">{duel.optionA}</span>
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-[9px] uppercase tracking-widest font-bold text-green-500 block">Pros</span>
              {duel.result.prosA.map((pro, i) => (
                <div key={i} className="bg-green-50 text-[11px] p-3 rounded-xl border border-green-100/50 text-green-800">
                  {pro}
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <span className="text-[9px] uppercase tracking-widest font-bold text-red-400 block">Cons</span>
              {duel.result.consA.map((con, i) => (
                <div key={i} className="bg-red-50 text-[11px] p-3 rounded-xl border border-red-100/50 text-red-800">
                  {con}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Option B Analysis */}
        <section>
          <h3 className="text-xs uppercase tracking-widest font-bold text-zinc-400 mb-4 flex items-center gap-2">
            Analysis of <span className="text-black">{duel.optionB}</span>
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-[9px] uppercase tracking-widest font-bold text-green-500 block">Pros</span>
              {duel.result.prosB.map((pro, i) => (
                <div key={i} className="bg-green-50 text-[11px] p-3 rounded-xl border border-green-100/50 text-green-800">
                  {pro}
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <span className="text-[9px] uppercase tracking-widest font-bold text-red-400 block">Cons</span>
              {duel.result.consB.map((con, i) => (
                <div key={i} className="bg-red-50 text-[11px] p-3 rounded-xl border border-red-100/50 text-red-800">
                  {con}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className="fixed bottom-10 left-0 right-0 px-8">
        <button 
          onClick={onBack}
          className="w-full bg-duelist-black text-white font-bold py-5 rounded-2xl ios-shadow active:scale-[0.98] transition-transform text-center uppercase tracking-widest text-xs"
        >
          Return to Arena
        </button>
      </div>
    </div>
  );
};

export default DuelResultScreen;
