
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Decision } from '../types';
import { suggestOptions } from '../services/geminiService';

interface Props {
  decisions: Decision[];
  onUpdate: (d: Decision) => void;
  lang: 'en' | 'zh';
}

const OptionEditor: React.FC<Props> = ({ decisions, onUpdate, lang }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const decision = decisions.find(d => d.id === id);

  const [options, setOptions] = useState<string[]>(decision?.options || []);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const t = {
    en: {
      prep: "Preparation",
      addCustom: "Add custom option...",
      summon: "Summoning candidates",
      atLeast: "Add at least 2 options",
      duel: "Duel with {n} Candidates"
    },
    zh: {
      prep: "战前准备",
      addCustom: "添加自定义选项...",
      summon: "正在召唤候选者",
      atLeast: "至少添加 2 个选项",
      duel: "带领 {n} 个候选者进行决斗"
    }
  }[lang];

  useEffect(() => {
    if (decision && options.length === 0) handleAISuggest();
  }, []);

  if (!decision) return <div>Not Found</div>;

  const handleAISuggest = async () => {
    setLoading(true);
    const suggestions = await suggestOptions(decision.title);
    setOptions(prev => Array.from(new Set([...prev, ...suggestions])));
    setLoading(false);
  };

  const addOption = () => {
    if (!inputValue.trim()) return;
    setOptions([...options, inputValue.trim()]);
    setInputValue('');
  };

  const handleStart = () => {
    if (options.length < 2) return;
    onUpdate({ ...decision, options });
    navigate(`/arena/${decision.id}`);
  };

  return (
    <div className="flex-1 bg-void-black flex flex-col h-full overflow-hidden">
      <header className="px-6 pt-12 pb-4 flex justify-between items-center">
        <button onClick={() => navigate('/')} className="text-gray-500"><span className="material-symbols-outlined">arrow_back</span></button>
        <div className="text-center">
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-primary/60 font-bold">{t.prep}</h2>
          <p className="text-sm text-white font-serif italic truncate max-w-[200px]">{decision.title}</p>
        </div>
        <button onClick={handleAISuggest} disabled={loading} className={`text-primary ${loading ? 'animate-spin' : ''}`}>
          <span className="material-symbols-outlined">auto_awesome</span>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-4 no-scrollbar">
        <div className="space-y-3">
          {options.map((opt, idx) => (
            <div key={idx} className="glass border border-white/10 p-4 rounded-2xl flex justify-between items-center animate-in slide-in-from-right-4 duration-300">
              <span className="text-lg font-serif text-white">{opt}</span>
              <button onClick={() => setOptions(options.filter((_, i) => i !== idx))} className="text-white/20"><span className="material-symbols-outlined text-xl">delete</span></button>
            </div>
          ))}
          <div className="pt-4">
            <div className="glass border border-dashed border-white/20 p-1 rounded-2xl flex items-center">
              <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addOption()} placeholder={t.addCustom} className="flex-1 bg-transparent border-none focus:ring-0 text-white p-3 text-sm placeholder:text-white/20" />
              <button onClick={addOption} className="w-10 h-10 bg-primary/20 text-primary rounded-xl flex items-center justify-center mr-1"><span className="material-symbols-outlined">add</span></button>
            </div>
          </div>
        </div>
        {loading && (
          <div className="mt-8 flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="text-[10px] text-primary/40 tracking-widest uppercase font-bold">{t.summon}</p>
          </div>
        )}
      </main>

      <footer className="px-6 pb-24 pt-4 bg-gradient-to-t from-void-black via-void-black to-transparent">
        <button onClick={handleStart} disabled={options.length < 2} className={`w-full py-5 rounded-[24px] font-bold tracking-[0.2em] uppercase text-xs transition-all duration-300 ${options.length >= 2 ? 'bg-primary text-void-black shadow-gold-pulse' : 'bg-white/5 text-white/20'}`}>
          {options.length < 2 ? t.atLeast : t.duel.replace('{n}', options.length.toString())}
        </button>
      </footer>
    </div>
  );
};

export default OptionEditor;
