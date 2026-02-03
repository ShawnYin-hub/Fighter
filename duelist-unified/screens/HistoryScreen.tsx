import React, { useState } from 'react';
import { Decision, Language, DecisionStatus } from '../types';
import { t } from '../App';
import { useTheme } from '../contexts/ThemeContext';

interface HistoryScreenProps {
  history?: Decision[];
  decisions?: Decision[];
  onNew?: () => void;
  lang: Language;
  onTogglePin?: (updated: Decision) => void;
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ history, decisions, onNew, lang, onTogglePin }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { theme } = useTheme();
  const ui = t[lang];
  const allDecisions = history || decisions || [];

  const filteredHistory = allDecisions.filter(d => 
    (d.winner || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.options || []).some(opt => opt.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (d.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Dark theme version
  if (theme === 'dark') {
    return (
      <div className="flex-1 overflow-y-auto no-scrollbar pb-32 pt-14 px-6">
        <header className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-xs uppercase tracking-[0.3em] text-primary/60 font-medium mb-1">
                {lang === 'en' ? 'Archive' : '存档'}
              </h1>
              <h2 className="text-4xl font-serif font-bold tracking-tight text-white">
                {lang === 'en' ? 'History' : '历史记录'}
              </h2>
            </div>
            <button onClick={() => window.location.href = '#/'} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-primary active:scale-95 transition">
              <span className="material-symbols-outlined text-2xl">add</span>
            </button>
          </div>
          <div className="glass flex items-center px-4 py-3 rounded-2xl w-full">
            <span className="material-symbols-outlined text-gray-400 text-xl mr-3">search</span>
            <input 
              className="bg-transparent border-none p-0 focus:ring-0 text-sm w-full placeholder:text-gray-500 text-white" 
              placeholder={lang === 'en' ? 'Search past decisions...' : '搜索过往决策...'} 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        <div className="space-y-4">
          {filteredHistory.map((decision) => (
            <div 
              key={decision.id} 
              onClick={() => {
                const path = decision.status === DecisionStatus.COMPLETED 
                  ? `/journey/${decision.id}` 
                  : `/arena-dark/${decision.id}`;
                window.location.href = `#${path}`;
              }} 
              className="p-6 bg-card-bg border border-white/10 rounded-3xl relative overflow-hidden active:scale-[0.98] transition-all cursor-pointer"
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePin?.({ ...decision, pinned: !decision.pinned });
                }}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-black/40 border border-white/15 flex items-center justify-center active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-[16px] text-primary">
                  {decision.pinned ? 'star' : 'star_border'}
                </span>
              </button>
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] tracking-widest text-gray-500 uppercase font-semibold">{decision.date}</span>
                    {decision.status === DecisionStatus.COMPLETED && (
                      <div className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 flex items-center gap-1">
                        <div className="w-1 h-1 rounded-full bg-primary"></div>
                        <span className="text-[8px] text-primary font-bold uppercase tracking-tighter">
                          {lang === 'en' ? 'Completed' : '已完成'}
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-white tracking-tight">{decision.title || decision.category}</h3>
                  <p className="text-sm text-gray-400 font-light mt-1">
                    {decision.winner ? `${lang === 'en' ? 'Winner' : '胜者'}: ${decision.winner}` : (lang === 'en' ? 'Ongoing...' : '进行中...')}
                  </p>
                  {decision.tags && decision.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {decision.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-[0.16em] text-gray-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Light theme version
  return (
    <div className="flex-1 flex flex-col bg-gallery-white animate-in fade-in duration-500 overflow-hidden relative">
      <div className="w-full px-6 pt-12 pb-4 sticky top-0 z-50 bg-gallery-white/80 backdrop-blur-md">
        <h1 className="text-4xl font-serif font-bold mb-6">{ui.archive}</h1>
        <div className="flex items-center px-4 py-4 rounded-2xl shadow-sm bg-white border border-black/5">
          <span className="material-symbols-outlined text-slate-400 text-xl mr-3">search</span>
          <input 
            className="bg-transparent border-none focus:ring-0 p-0 text-sm w-full placeholder-slate-300 font-medium" 
            placeholder={ui.search} 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <main className="flex-1 w-full overflow-y-auto no-scrollbar px-6 pb-32">
        <div className="space-y-4 mt-4">
          {filteredHistory.length > 0 ? filteredHistory.map((d, i) => (
            <div 
              key={d.id} 
              className="bg-white rounded-[2rem] p-6 flex justify-between items-center shadow-sm border border-black/[0.03] active:scale-[0.98] transition-transform animate-in slide-in-from-left-4 relative" 
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex flex-col pr-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-win-gold font-bold">{d.category}</span>
                  <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                  <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">{d.date}</span>
                </div>
                <h3 className="text-xl font-bold font-serif text-slate-900">{d.winner}</h3>
                <p className="text-[10px] text-slate-400 mt-2 font-medium">{ui.contested} {d.options.length - 1} {ui.others}</p>
                {d.tags && d.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {d.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-full bg-slate-50 border border-slate-100 text-[9px] uppercase tracking-[0.16em] text-slate-500">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-win-gold text-xl">verified</span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePin?.({ ...d, pinned: !d.pinned });
                }}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/80 border border-slate-200 flex items-center justify-center active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-[16px] text-win-gold">
                  {d.pinned ? 'star' : 'star_border'}
                </span>
              </button>
            </div>
          )) : (
            <div className="py-20 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-slate-200 text-3xl">history_toggle_off</span>
              </div>
              <p className="text-slate-400 text-sm font-medium">{ui.historyTitle}</p>
            </div>
          )}
          <div className="text-center py-12">
            <span className="text-[10px] text-slate-300 uppercase tracking-[0.4em] font-bold">{ui.endArchive}</span>
          </div>
        </div>
      </main>

      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] bg-white/80 backdrop-blur-xl rounded-full px-6 py-4 flex items-center gap-10 shadow-soft border border-black/[0.05]">
        <button className="flex flex-col items-center text-slate-300 hover:text-black transition-colors">
          <span className="material-symbols-outlined text-2xl">grid_view</span>
        </button>
        
        <button onClick={onNew || (() => window.location.href = '#/')} className="w-12 h-12 bg-black rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-transform">
          <span className="material-symbols-outlined text-white text-2xl">add</span>
        </button>
        
        <button className="flex flex-col items-center text-win-gold">
          <span className="material-symbols-outlined text-2xl fill-[1]">history</span>
        </button>
      </nav>
    </div>
  );
};

export default HistoryScreen;
