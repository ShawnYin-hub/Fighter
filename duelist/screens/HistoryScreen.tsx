
import React, { useState } from 'react';
import { Decision, Language } from '../types';
import { t } from '../App';

interface HistoryScreenProps {
  history: Decision[];
  onNew: () => void;
  lang: Language;
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ history, onNew, lang }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const ui = t[lang];

  const filteredHistory = history.filter(d => 
    d.winner.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.options.some(opt => opt.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
            <div key={d.id} className="bg-white rounded-[2rem] p-6 flex justify-between items-center shadow-sm border border-black/[0.03] active:scale-[0.98] transition-transform animate-in slide-in-from-left-4" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="flex flex-col pr-4">
                <div className="flex items-center gap-2 mb-1">
                   <span className="text-[9px] uppercase tracking-[0.2em] text-win-gold font-bold">{d.category}</span>
                   <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                   <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">{d.date}</span>
                </div>
                <h3 className="text-xl font-bold font-serif text-slate-900">{d.winner}</h3>
                <p className="text-[10px] text-slate-400 mt-2 font-medium">{ui.contested} {d.options.length - 1} {ui.others}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0"><span className="material-symbols-outlined text-win-gold text-xl">verified</span></div>
            </div>
          )) : (
            <div className="py-20 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4"><span className="material-symbols-outlined text-slate-200 text-3xl">history_toggle_off</span></div>
              <p className="text-slate-400 text-sm font-medium">{ui.historyTitle}</p>
            </div>
          )}
          <div className="text-center py-12"><span className="text-[10px] text-slate-300 uppercase tracking-[0.4em] font-bold">{ui.endArchive}</span></div>
        </div>
      </main>

      {/* Light Navigation Bar */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] bg-white/80 backdrop-blur-xl rounded-full px-6 py-4 flex items-center gap-10 shadow-soft border border-black/[0.05]">
        <button className="flex flex-col items-center text-slate-300 hover:text-black transition-colors"><span className="material-symbols-outlined text-2xl">grid_view</span></button>
        
        <button onClick={onNew} className="w-12 h-12 bg-black rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-transform">
          <span className="material-symbols-outlined text-white text-2xl">add</span>
        </button>
        
        <button className="flex flex-col items-center text-win-gold"><span className="material-symbols-outlined text-2xl fill-[1]">history</span></button>
      </nav>
    </div>
  );
};

export default HistoryScreen;
