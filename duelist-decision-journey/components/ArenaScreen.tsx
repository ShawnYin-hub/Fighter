
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Decision, DecisionStatus } from '../types';
import { getExpertAdvice } from '../services/geminiService';

interface Props {
  decisions: Decision[];
  onUpdate: (d: Decision) => void;
  lang: 'en' | 'zh';
}

const ArenaScreen: React.FC<Props> = ({ decisions, onUpdate, lang }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const decision = decisions.find(d => d.id === id);

  const [activePool, setActivePool] = useState<string[]>(decision?.options || []);
  const [graveyard, setGraveyard] = useState<string[]>(decision?.eliminated || []);
  const [advice, setAdvice] = useState<{ tucao: string; recommendation: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const t = {
    en: {
      arena: "Duel Arena",
      rem: "Remaining",
      challenger: "Challenger",
      graveyard: "The Graveyard",
      insight: "Insight",
      revive: "Shake to revive expired options"
    },
    zh: {
      arena: "决斗场",
      rem: "剩余",
      challenger: "挑战者",
      graveyard: "墓地",
      insight: "见解",
      revive: "摇晃手机复活落选选项"
    }
  }[lang];

  const pair = useMemo(() => activePool.length < 2 ? null : [activePool[0], activePool[1]], [activePool]);

  useEffect(() => {
    if (pair && decision) {
      setLoading(true);
      getExpertAdvice(pair[0], pair[1], decision.title)
        .then(res => { setAdvice(res); setLoading(false); });
    }
  }, [pair, decision]);

  if (!decision) return <div>Not found</div>;

  const handlePick = (winner: string) => {
    if (!pair) return;
    const loser = pair[0] === winner ? pair[1] : pair[0];
    const newPool = [...activePool.filter(o => o !== winner && o !== loser), winner];
    const newGraveyard = [loser, ...graveyard];
    
    setActivePool(newPool);
    setGraveyard(newGraveyard);
    setAdvice(null);

    if (newPool.length === 1) {
      onUpdate({ ...decision, winner: newPool[0], options: newPool, eliminated: newGraveyard, status: DecisionStatus.COMPLETED, efficiency: 95 });
      navigate(`/journey/${decision.id}`);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-void-black">
      <header className="w-full px-5 py-4 flex justify-between items-center z-10 relative mt-2 pt-10">
        <button onClick={() => navigate('/')} className="w-10 h-10 rounded-full glass flex items-center justify-center text-gray-300"><span className="material-symbols-outlined">close</span></button>
        <div className="text-center">
          <h1 className="text-xs uppercase tracking-widest text-primary font-bold">{t.arena}</h1>
          <p className="text-[10px] text-gray-500 font-serif">{activePool.length} {t.rem}</p>
        </div>
        <button onClick={() => navigate(`/edit/${decision.id}`)} className="w-10 h-10 rounded-full glass flex items-center justify-center text-gray-300"><span className="material-symbols-outlined">edit</span></button>
      </header>

      <main className="flex-1 w-full px-6 flex flex-col items-center justify-start gap-4">
        <div className="w-full mt-2 min-h-[80px]">
          <div className="glass rounded-2xl p-4 border border-white/10 bg-white/5">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-lg">smart_toy</span>
              <div className="flex-1"><p className="text-sm leading-relaxed text-gray-200 font-light italic">{loading ? "..." : (advice?.tucao || "...")}</p></div>
            </div>
          </div>
        </div>

        {pair && (
          <div className="relative flex w-full h-[45vh] justify-between gap-3 mt-4">
            <div onClick={() => handlePick(pair[0])} className="w-1/2 bg-[#0D0D0D] rounded-[28px] border border-gray-800 flex flex-col items-center justify-center p-4">
              <h2 className="text-xl font-serif font-bold text-white text-center break-words w-full">{pair[0]}</h2>
              <span className="text-[8px] uppercase tracking-widest text-gray-500 mt-4">{t.challenger} A</span>
            </div>
            <div onClick={() => handlePick(pair[1])} className="w-1/2 bg-white rounded-[28px] flex flex-col items-center justify-center p-4">
              <h2 className="text-xl font-serif font-bold text-black text-center break-words w-full">{pair[1]}</h2>
              <span className="text-[8px] uppercase tracking-widest text-gray-400 mt-4">{t.challenger} B</span>
            </div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"><div className="w-10 h-10 rounded-full bg-[#1A1810] border-2 border-primary/40 flex items-center justify-center shadow-glow"><span className="font-serif italic text-primary text-xs font-black">VS</span></div></div>
          </div>
        )}

        <div className="w-full mt-4">
          <h3 className="text-[9px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-3 flex items-center gap-2"><span className="material-symbols-outlined text-xs">skull</span> {t.graveyard}</h3>
          <div className="flex flex-wrap gap-2 overflow-x-auto no-scrollbar max-h-24">
            {graveyard.map((opt, idx) => (
              <button key={idx} onClick={() => { setGraveyard(graveyard.filter(o => o !== opt)); setActivePool([...activePool, opt]); }} className="px-3 py-1.5 rounded-full border border-white/5 bg-white/5 text-[10px] text-gray-400 flex items-center gap-1">{opt} <span className="material-symbols-outlined text-[10px]">refresh</span></button>
            ))}
          </div>
        </div>
      </main>

      <footer className="w-full px-6 pb-28 pt-2">
        <div className="w-full bg-[#1E1D1B] rounded-[20px] p-4 flex items-center gap-4 border border-white/5">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><span className="material-symbols-outlined">lightbulb</span></div>
          <div className="flex-1"><span className="block text-[10px] uppercase font-bold text-primary/60">{t.insight}</span><p className="text-[11px] text-gray-400 line-clamp-1">{advice?.recommendation || "..."}</p></div>
        </div>
      </footer>
    </div>
  );
};

export default ArenaScreen;
