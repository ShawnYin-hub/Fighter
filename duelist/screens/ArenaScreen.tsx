
import React, { useState, useEffect } from 'react';
import { Decision, DecisionBreakdown, Language } from '../types';
import { getAIAdvice } from '../services/geminiService';
import { t } from '../App';

interface ArenaScreenProps {
  breakdown: DecisionBreakdown | null;
  onComplete: (decision: Decision) => void;
  lang: Language;
}

const ArenaScreen: React.FC<ArenaScreenProps> = ({ breakdown, onComplete, lang }) => {
  const [remainingOptions, setRemainingOptions] = useState<string[]>([]);
  const [currentWinner, setCurrentWinner] = useState<string | null>(null);
  const [nextChallenger, setNextChallenger] = useState<string | null>(null);
  const [graveyard, setGraveyard] = useState<string[]>([]);
  const [advice, setAdvice] = useState<string | null>(null);
  const [isAdviceLoading, setIsAdviceLoading] = useState(false);
  const [showGraveyard, setShowGraveyard] = useState(false);
  const ui = t[lang];

  useEffect(() => {
    if (breakdown) {
      const opts = [...breakdown.options];
      setCurrentWinner(opts[0]);
      setNextChallenger(opts[1]);
      setRemainingOptions(opts.slice(2));
    }
  }, [breakdown]);

  const handleSelect = (winner: 'A' | 'B') => {
    const chosen = winner === 'A' ? currentWinner! : nextChallenger!;
    const loser = winner === 'A' ? nextChallenger! : currentWinner!;
    
    setGraveyard([loser, ...graveyard]);
    setAdvice(null);

    if (remainingOptions.length === 0) {
      const decision: Decision = {
        id: Math.random().toString(36).substr(2, 9),
        category: breakdown?.category || "Unknown",
        winner: chosen,
        options: breakdown?.options || [],
        history: [loser, ...graveyard],
        date: new Date().toLocaleDateString()
      };
      onComplete(decision);
    } else {
      const next = remainingOptions[0];
      setCurrentWinner(chosen);
      setNextChallenger(next);
      setRemainingOptions(remainingOptions.slice(1));
    }
  };

  const revive = (revivedOption: string) => {
    const updatedGraveyard = graveyard.filter(o => o !== revivedOption);
    if (nextChallenger) updatedGraveyard.push(nextChallenger);
    setNextChallenger(revivedOption);
    setGraveyard(updatedGraveyard);
    setShowGraveyard(false);
  };

  const handleShowAdvice = async () => {
    if (!currentWinner || !nextChallenger) return;
    setIsAdviceLoading(true);
    const result = await getAIAdvice(currentWinner, nextChallenger, lang);
    setAdvice(result);
    setIsAdviceLoading(false);
  };

  if (!currentWinner || !nextChallenger) return null;

  return (
    <div className="flex-1 flex flex-col bg-off-white animate-in fade-in duration-500 overflow-hidden relative">
      <header className="w-full px-6 pt-12 pb-2 flex justify-between items-center z-50 shrink-0">
        <button onClick={() => window.history.back()} className="w-10 h-10 rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-2xl text-black">close</span>
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-ios-gray">{ui.duel}</span>
          <div className="flex gap-1 mt-1">
            {new Array(remainingOptions.length + 1).fill(0).map((_, i) => (
              <div key={i} className={`h-1 w-2 rounded-full ${i === 0 ? 'bg-black' : 'bg-black/10'}`}></div>
            ))}
          </div>
        </div>
        <button onClick={() => setShowGraveyard(true)} className="w-10 h-10 rounded-full flex items-center justify-center relative">
          <span className="material-symbols-outlined text-2xl text-black">history_edu</span>
          {graveyard.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-off-white"></span>}
        </button>
      </header>

      <main className="flex-1 w-full flex flex-col items-center px-6 relative overflow-hidden">
        <div className="w-full mt-4 mb-6 z-30">
          <div className="glass-comment rounded-2xl p-4 flex gap-3 items-start shadow-ios animate-in slide-in-from-top-2 duration-700">
            <span className="material-symbols-outlined text-black text-xl shrink-0">auto_awesome</span>
            <p className="text-[13px] leading-relaxed font-medium text-black">
              {advice || (lang === 'zh' ? "两种路径碰撞。唯有一者能够胜出。" : "Two paths collide. Only one can prevail.")}
            </p>
          </div>
        </div>

        <div className="flex-1 w-full flex gap-3 relative items-center mb-6">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
            <div className="vs-badge w-12 h-12 rounded-full flex items-center justify-center shadow-2xl border-4 border-off-white"><span className="text-sm italic">VS</span></div>
          </div>
          <button onClick={() => handleSelect('A')} className="flex-1 h-full max-h-[480px] bg-deep-charcoal rounded-[2rem] shadow-card-left flex flex-col items-center justify-between py-12 relative overflow-hidden transition-all active:scale-[0.98] animate-in slide-in-from-left-4">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold italic">{ui.champion}</span>
            <h2 className="font-serif text-3xl text-white font-bold px-4 text-center leading-tight">{currentWinner}</h2>
            <div className="w-1 h-10 rounded-full bg-gradient-to-b from-white/20 to-transparent"></div>
          </button>
          <button onClick={() => handleSelect('B')} className="flex-1 h-full max-h-[480px] bg-pure-white rounded-[2rem] shadow-card-right border border-black/5 flex flex-col items-center justify-between py-12 relative overflow-hidden transition-all active:scale-[0.98] animate-in slide-in-from-right-4">
            <span className="text-[10px] uppercase tracking-[0.3em] text-black/20 font-bold">{ui.challenger}</span>
            <h2 className="font-serif text-3xl text-black font-bold px-4 text-center leading-tight">{nextChallenger}</h2>
            <div className="w-1 h-10 rounded-full bg-gradient-to-b from-black/20 to-transparent"></div>
          </button>
        </div>
      </main>

      <footer className="w-full px-6 pb-12 pt-2 shrink-0">
        <button onClick={handleShowAdvice} disabled={isAdviceLoading} className="w-full bg-white/60 border border-black/5 rounded-2xl py-4 px-6 flex items-center justify-center gap-2 shadow-sm active:bg-gray-100 transition-colors">
          <span className={`material-symbols-outlined text-win-gold text-lg ${isAdviceLoading ? 'animate-spin' : ''}`}>{isAdviceLoading ? 'sync' : 'bolt'}</span>
          <span className="text-xs font-bold uppercase tracking-widest text-black">{ui.oracle}</span>
        </button>
      </footer>

      {showGraveyard && (
        <div className="absolute inset-0 z-[100] bg-black/90 backdrop-blur-md p-8 animate-in fade-in duration-300 flex flex-col">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-white font-serif text-2xl italic">{ui.fallen}</h3>
            <button onClick={() => setShowGraveyard(false)} className="text-white/40"><span className="material-symbols-outlined">close</span></button>
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar">
            {graveyard.length === 0 ? <p className="text-white/20 text-center italic mt-20">{lang === 'zh' ? '尚无落败战魂...' : 'No souls have fallen yet...'}</p> : graveyard.map((opt, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex justify-between items-center">
                <span className="text-white font-serif text-lg">{opt}</span>
                <button onClick={() => revive(opt)} className="bg-white/10 hover:bg-white text-white hover:text-black px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition">{ui.revive}</button>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-white/30 text-center uppercase tracking-widest mt-6">{ui.reviveNote}</p>
        </div>
      )}
    </div>
  );
};

export default ArenaScreen;
