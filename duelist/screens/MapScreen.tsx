
import React from 'react';
import { Decision, Language } from '../types';
import { t } from '../App';

interface MapScreenProps {
  decision: Decision;
  onBack: () => void;
  lang: Language;
}

const MapScreen: React.FC<MapScreenProps> = ({ decision, onBack, lang }) => {
  if (!decision) return null;
  const ui = t[lang];
  const losers = [...decision.history].reverse();
  const winner = decision.winner;

  return (
    <div className="flex-1 flex flex-col bg-gallery-white animate-in fade-in duration-700 overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"><div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div></div>
      <header className="w-full px-6 pt-6 pb-4 flex justify-between items-center z-50 bg-white/80 backdrop-blur-md border-b border-black/[0.03]">
        <button onClick={onBack} className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center bg-white shadow-sm active:scale-90 transition-transform"><span className="material-symbols-outlined text-2xl text-slate-400">arrow_back</span></button>
        <div className="text-center">
          <h1 className="text-[10px] uppercase tracking-[0.3em] text-win-gold font-bold mb-0.5">{ui.decMap}</h1>
          <p className="text-sm font-semibold text-slate-800">{decision.category}</p>
        </div>
        <div className="w-10 h-10 flex items-center justify-center"><span className="material-symbols-outlined text-slate-300">account_tree</span></div>
      </header>
      <main className="flex-1 w-full overflow-y-auto no-scrollbar px-6 py-12 flex flex-col items-center relative">
        <div className="mb-16 relative z-10 flex flex-col items-center animate-in slide-in-from-top-8 duration-1000">
          <div className="w-24 h-24 bg-black rounded-3xl flex items-center justify-center mb-6 shadow-2xl rotate-45 group"><div className="-rotate-45 flex flex-col items-center"><span className="material-symbols-outlined text-win-gold text-3xl mb-1">trophy</span></div></div>
          <h2 className="text-4xl font-serif font-bold italic tracking-tight text-slate-900 mb-2">{winner}</h2>
          <span className="text-[10px] uppercase tracking-[0.4em] text-win-gold font-bold">{ui.sovPath}</span>
        </div>
        <div className="w-full max-w-xs relative pb-24">
          {losers.map((loser, i) => (
            <div key={i} className="relative mb-20 last:mb-0">
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[2px] h-16 overflow-hidden"><div className="w-full h-full bg-gradient-to-b from-win-gold to-slate-200"></div></div>
              <div className="flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${(i + 1) * 200}ms` }}>
                <div className="flex-1 flex flex-col items-end">
                   <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm opacity-40 grayscale flex items-center gap-3 w-full justify-end">
                      <span className="text-sm font-serif line-through text-slate-400">{loser}</span>
                      <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                   </div>
                   <span className="text-[9px] uppercase tracking-widest text-slate-300 font-bold mt-2">{lang === 'zh' ? '已击败' : 'Defeated'}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 z-10"><span className="text-[10px] font-mono font-bold text-slate-300">0{losers.length - i}</span></div>
                <div className="flex-1">
                   <div className="border border-win-gold/20 bg-win-gold/[0.02] rounded-2xl p-4 flex items-center gap-3 w-full">
                      <div className="w-2 h-2 rounded-full bg-win-gold animate-pulse"></div>
                      <span className="text-sm font-serif font-bold text-slate-800">{winner}</span>
                   </div>
                   <span className="text-[9px] uppercase tracking-widest text-win-gold font-bold mt-2">{lang === 'zh' ? '晋级' : 'Ascended'}</span>
                </div>
              </div>
              <svg className="absolute -top-20 left-0 w-full h-20 pointer-events-none overflow-visible" viewBox="0 0 200 80">
                <path d="M 100 0 L 100 40" className="win-path" style={{ stroke: '#C5A059', opacity: 0.3 }} />
                <path d="M 50 60 Q 50 40 100 40" className="lose-path" fill="none" style={{ stroke: '#E5E5E5' }} />
                <path d="M 150 60 Q 150 40 100 40" className="win-path" fill="none" style={{ stroke: '#C5A059' }} />
              </svg>
            </div>
          ))}
          <div className="mt-12 flex flex-col items-center opacity-30 animate-in fade-in duration-1000 delay-1000">
             <div className="w-1 h-12 bg-gradient-to-b from-slate-200 to-transparent"></div>
             <span className="text-[8px] uppercase tracking-[0.5em] font-bold text-slate-400">{ui.origin}</span>
          </div>
        </div>
      </main>
      <footer className="w-full px-6 pb-10 pt-4 bg-white/80 backdrop-blur-md border-t border-gray-100 z-50">
        <button onClick={onBack} className="w-full bg-black text-white rounded-[2rem] py-6 font-bold tracking-[0.2em] uppercase text-[10px] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3">
          <span>{ui.archiveRev}</span>
          <span className="material-symbols-outlined text-sm">inventory_2</span>
        </button>
      </footer>
    </div>
  );
};

export default MapScreen;
