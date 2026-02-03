
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Decision, DecisionStatus } from '../types';

interface Props {
  decisions: Decision[];
  lang: 'en' | 'zh';
}

const HistoryScreen: React.FC<Props> = ({ decisions, lang }) => {
  const navigate = useNavigate();

  const t = {
    en: {
      archive: "Archive",
      history: "History",
      search: "Search past decisions...",
      completed: "Completed"
    },
    zh: {
      archive: "存档",
      history: "历史记录",
      search: "搜索过往决策...",
      completed: "已完成"
    }
  }[lang];

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-32 pt-14 px-6">
      <header className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xs uppercase tracking-[0.3em] text-primary/60 font-medium mb-1">{t.archive}</h1>
            <h2 className="text-4xl font-serif font-bold tracking-tight text-white">{t.history}</h2>
          </div>
          <button onClick={() => navigate('/')} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-primary active:scale-95 transition"><span className="material-symbols-outlined text-2xl">add</span></button>
        </div>
        <div className="glass flex items-center px-4 py-3 rounded-2xl w-full">
          <span className="material-symbols-outlined text-gray-400 text-xl mr-3">search</span>
          <input className="bg-transparent border-none p-0 focus:ring-0 text-sm w-full placeholder:text-gray-500 text-white" placeholder={t.search} type="text" />
        </div>
      </header>

      <div className="space-y-4">
        {decisions.map((decision) => (
          <div key={decision.id} onClick={() => navigate(decision.status === DecisionStatus.COMPLETED ? `/journey/${decision.id}` : `/arena/${decision.id}`)} className="p-6 bg-card-bg border border-white/10 rounded-3xl relative overflow-hidden active:scale-[0.98] transition-all cursor-pointer">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 mb-2"><span className="text-[10px] tracking-widest text-gray-500 uppercase font-semibold">{decision.date}</span>{decision.status === DecisionStatus.COMPLETED && <div className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-primary"></div><span className="text-[8px] text-primary font-bold uppercase tracking-tighter">{t.completed}</span></div>}</div>
                <h3 className="text-2xl font-serif font-bold text-white tracking-tight">{decision.title}</h3>
                <p className="text-sm text-gray-400 font-light mt-1">{decision.winner ? `Winner: ${decision.winner}` : 'Ongoing...'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryScreen;
