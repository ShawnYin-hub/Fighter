import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Decision } from '../types';
import { suggestOptions, deepBrainstormOptions } from '../services/deepseekService';
import { useToast } from '../contexts/ToastContext';

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
  const [showDeep, setShowDeep] = useState(false);
  const [scenario, setScenario] = useState<'life' | 'work' | 'money' | 'love'>('life');
  const { showToast } = useToast();

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
    try {
      setLoading(true);
      const suggestions = await suggestOptions(decision.title);
      setOptions(prev => Array.from(new Set([...prev, ...suggestions])));
    } catch (error) {
      console.error(error);
      showToast({
        type: 'error',
        message: lang === 'zh' ? 'AI 建议获取失败，请重试。' : 'Failed to fetch AI suggestions. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const addOption = () => {
    if (!inputValue.trim()) return;
    setOptions([...options, inputValue.trim()]);
    setInputValue('');
  };

  const handleStart = () => {
    if (options.length < 2) return;
    onUpdate({ ...decision, options });
    navigate(`/arena-dark/${decision.id}`);
  };

  return (
    <div className="flex-1 bg-void-black flex flex-col h-full overflow-hidden relative">
      <header className="px-6 pt-12 pb-4 flex justify-between items-center">
        <button onClick={() => navigate('/')} className="text-gray-500"><span className="material-symbols-outlined">arrow_back</span></button>
        <div className="text-center">
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-primary/60 font-bold">{t.prep}</h2>
          <p className="text-sm text-white font-serif italic truncate max-w-[200px]">{decision.title}</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleAISuggest} disabled={loading} className={`text-primary ${loading ? 'animate-spin' : ''}`}>
            <span className="material-symbols-outlined">auto_awesome</span>
          </button>
          <button
            type="button"
            onClick={() => setShowDeep(true)}
            className="text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-primary transition-colors"
          >
            {lang === 'zh' ? '深度脑暴' : 'Deep Brainstorm'}
          </button>
        </div>
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

      {showDeep && (
        <div className="absolute inset-0 z-40 flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowDeep(false)} />
          <div className="relative w-full max-w-sm glass rounded-3xl border border-white/15 p-6">
            <h3 className="text-sm uppercase tracking-[0.2em] text-primary/70 mb-2 font-semibold">
              {lang === 'zh' ? '选择场景' : 'Choose Scenario'}
            </h3>
            <p className="text-xs text-white/60 mb-4">
              {lang === 'zh'
                ? '让 AI 根据你当前主题在不同维度上展开更极致的候选路径。'
                : 'Let AI explode your theme into sharper options along different dimensions.'}
            </p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {(['life', 'work', 'money', 'love'] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setScenario(key)}
                  className={`px-3 py-2 rounded-2xl text-xs uppercase tracking-[0.15em] border flex items-center justify-center gap-1
                    ${scenario === key ? 'bg-primary text-void-black border-primary' : 'bg-white/5 text-white/60 border-white/10'}
                  `}
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {key === 'work' ? 'work' : key === 'money' ? 'paid' : key === 'love' ? 'favorite' : 'spa'}
                  </span>
                  {lang === 'zh'
                    ? key === 'life' ? '生活' : key === 'work' ? '工作' : key === 'money' ? '金钱' : '感情'
                    : key.charAt(0).toUpperCase() + key.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowDeep(false)}
                className="flex-1 h-11 rounded-2xl border border-white/15 text-[11px] uppercase tracking-[0.2em] text-white/60 active:scale-95 transition-transform"
              >
                {lang === 'zh' ? '稍后再说' : 'Later'}
              </button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    setLoading(true);
                    const suggestions = await deepBrainstormOptions(decision.title, scenario);
                    setOptions((prev) => Array.from(new Set([...prev, ...suggestions])));
                    setShowDeep(false);
                  } catch (error) {
                    console.error(error);
                    showToast({
                      type: 'error',
                      message: lang === 'zh' ? '深度脑暴失败，请稍后重试。' : 'Deep brainstorm failed, please try again later.',
                    });
                  } finally {
                    setLoading(false);
                  }
                }}
                className="flex-1 h-11 rounded-2xl bg-primary text-void-black text-[11px] uppercase tracking-[0.2em] font-bold active:scale-95 transition-transform"
              >
                {lang === 'zh' ? '开始脑暴' : 'Start'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptionEditor;
