
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Decision } from '../types';

interface Props {
  decisions: Decision[];
  lang: 'en' | 'zh';
}

const JourneyScreen: React.FC<Props> = ({ decisions, lang }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const decision = decisions.find(d => d.id === id);

  const t = {
    en: {
      title: "Decision Journey",
      sub: "Genealogy Map",
      winner: "The Winner",
      logic: "AI Decision Logic Summary",
      efficiency: "Path Efficiency",
      finish: "View Archive",
      clear: "Clear"
    },
    zh: {
      title: "决策旅程",
      sub: "谱系图谱",
      winner: "最终胜利者",
      logic: "AI 决策逻辑摘要",
      efficiency: "路径清晰度",
      finish: "查看存档",
      clear: "已明确"
    }
  }[lang];

  if (!decision) return <div>Not found</div>;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden select-none">
      <header className="w-full px-6 pt-10 pb-4 flex justify-between items-center z-50">
        <button onClick={() => navigate('/')} className="w-10 h-10 rounded-full glass flex items-center justify-center transition active:scale-95"><span className="material-symbols-outlined text-2xl text-gray-400">arrow_back_ios_new</span></button>
        <div className="text-center">
          <h1 className="text-[10px] uppercase tracking-[0.3em] text-win-gold font-bold mb-0.5">{t.title}</h1>
          <p className="text-sm font-medium text-gray-300">{t.sub}</p>
        </div>
        <button className="w-10 h-10 rounded-full glass flex items-center justify-center"><span className="material-symbols-outlined text-2xl text-gray-400">share</span></button>
      </header>

      <main className="flex-1 w-full overflow-y-auto no-scrollbar relative flex flex-col items-center">
        <div className="relative z-20 mt-8 mb-16 flex flex-col items-center">
          <div className="bg-white rounded-2xl w-48 py-8 px-4 flex flex-col items-center shadow-glow border border-win-gold/30">
            <div className="w-12 h-12 bg-dark-charcoal rounded-full flex items-center justify-center mb-4"><span className="material-symbols-outlined text-win-gold text-2xl">workspace_premium</span></div>
            <h2 className="text-black font-serif text-2xl font-bold tracking-tight">{decision.winner}</h2>
            <span className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mt-2 font-bold">{t.winner}</span>
          </div>
          <div className="w-[2px] h-16 bg-gradient-to-b from-win-gold to-win-gold/50"></div>
        </div>

        <div className="w-full max-w-md px-6 relative flex flex-col items-center pb-12">
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" preserveAspectRatio="none">
            <path className="win-path" d="M187 0 L187 40 L280 120" fill="none"></path>
            <path className="lose-path" d="M187 40 L100 120" fill="none"></path>
          </svg>
          <div className="flex justify-between w-full mb-16 relative z-10">
            <div className="w-24 bg-dark-charcoal border border-gray-800 rounded-xl py-4 flex flex-col items-center opacity-40 grayscale scale-90"><span className="text-xs font-serif text-gray-500 mb-1">{decision.eliminated[0] || '...'}</span><span className="text-[8px] tracking-tighter text-gray-600">Level 02</span></div>
            <div className="w-24 bg-white rounded-xl py-4 flex flex-col items-center shadow-lg"><span className="text-xs font-serif text-black font-bold mb-1">{decision.winner}</span><span className="text-[8px] tracking-tighter text-gray-400">Level 02</span></div>
          </div>
        </div>

        <div className="w-full max-w-md px-6 mb-32 mt-4 relative z-20">
          <div className="glass rounded-2xl p-5 shadow-2xl border-l-4 border-l-win-gold bg-gradient-to-r from-win-gold/5 to-transparent">
            <div className="flex items-center gap-3 mb-3"><div className="p-1.5 bg-win-gold/10 rounded-lg"><span className="material-symbols-outlined text-win-gold text-lg block">temp_preferences_custom</span></div><span className="text-[10px] font-bold text-win-gold uppercase tracking-[0.2em]">{t.logic}</span></div>
            <p className="text-[13px] leading-relaxed text-gray-300 font-light">{decision.summary || "..."}</p>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 px-6 pb-10 pt-4 bg-gradient-to-t from-dark-charcoal via-dark-charcoal to-transparent max-w-md mx-auto z-50">
        <div className="w-full glass rounded-2xl py-4 px-6 flex items-center justify-between">
          <div className="flex flex-col"><span className="text-[10px] uppercase tracking-wider text-gray-500 font-medium mb-0.5">{t.efficiency}</span><span className="text-lg font-serif font-bold text-white leading-none">{decision.efficiency || 88}% {t.clear}</span></div>
          <button onClick={() => navigate('/history')} className="bg-win-gold text-dark-charcoal px-6 py-2.5 rounded-full font-bold text-xs tracking-tight shadow-glow active:scale-95 transition-transform">{t.finish}</button>
        </div>
      </footer>
    </div>
  );
};

export default JourneyScreen;
