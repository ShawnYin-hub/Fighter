import React, { useState } from 'react';
import { Decision, Language } from '../types';
import { t } from '../App';
import { useTheme } from '../contexts/ThemeContext';
import { analyzePostMortem } from '../services/deepseekService';
import { useToast } from '../contexts/ToastContext';

interface MapScreenProps {
  decision: Decision;
  onBack: () => void;
  lang: Language;
  onReflect?: (updated: Decision) => void;
}

const MapScreen: React.FC<MapScreenProps> = ({ decision, onBack, lang, onReflect }) => {
  const { theme } = useTheme();
  const { showToast } = useToast();
  const [showReflect, setShowReflect] = useState(false);
  const [reflection, setReflection] = useState('');
  const [reflectionAI, setReflectionAI] = useState<string | null>(decision?.reflectionAdvice || null);
  const [isReflecting, setIsReflecting] = useState(false);
  if (!decision) return null;
  const ui = t[lang];
  const losers = [...(decision.history || [])].reverse();
  const winner = decision.winner;

  const bgClass = theme === 'dark' ? 'bg-dark-charcoal' : 'bg-gallery-white';
  const textClass = theme === 'dark' ? 'text-white' : 'text-slate-900';

  return (
    <div className={`flex-1 flex flex-col ${bgClass} animate-in fade-in duration-700 overflow-hidden relative`}>
      <div className={`absolute inset-0 pointer-events-none opacity-[0.03] ${theme === 'dark' ? '' : ''}`}>
        <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      </div>
      <header className={`w-full px-6 pt-6 pb-4 flex justify-between items-center z-50 ${theme === 'dark' ? 'bg-dark-charcoal/80' : 'bg-white/80'} backdrop-blur-md ${theme === 'dark' ? 'border-b border-white/10' : 'border-b border-black/[0.03]'}`}>
        <button onClick={onBack} className={`w-10 h-10 rounded-full ${theme === 'dark' ? 'glass' : 'border border-gray-100 bg-white shadow-sm'} flex items-center justify-center active:scale-90 transition-transform`}>
          <span className={`material-symbols-outlined text-2xl ${theme === 'dark' ? 'text-gray-300' : 'text-slate-400'}`}>arrow_back</span>
        </button>
        <div className="text-center">
          <h1 className={`text-[10px] uppercase tracking-[0.3em] text-win-gold font-bold mb-0.5`}>{ui.decMap}</h1>
          <p className={`text-sm font-semibold ${textClass}`}>{decision.category}</p>
        </div>
        <div className="w-10 h-10 flex items-center justify-center">
          <span className={`material-symbols-outlined ${theme === 'dark' ? 'text-gray-400' : 'text-slate-300'}`}>account_tree</span>
        </div>
      </header>
      <main className="flex-1 w-full overflow-y-auto no-scrollbar px-6 py-12 flex flex-col items-center relative">
        <div className="mb-16 relative z-10 flex flex-col items-center animate-in slide-in-from-top-8 duration-1000">
          <div className={`w-24 h-24 ${theme === 'dark' ? 'bg-white' : 'bg-black'} rounded-3xl flex items-center justify-center mb-6 shadow-2xl rotate-45 group`}>
            <div className="-rotate-45 flex flex-col items-center">
              <span className="material-symbols-outlined text-win-gold text-3xl mb-1">trophy</span>
            </div>
          </div>
          <h2 className={`text-4xl font-serif font-bold italic tracking-tight mb-2 ${textClass}`}>{winner}</h2>
          <span className="text-[10px] uppercase tracking-[0.4em] text-win-gold font-bold">{ui.sovPath}</span>
        </div>
        <div className="w-full max-w-xs relative pb-24">
          {losers.map((loser, i) => (
            <div key={i} className="relative mb-20 last:mb-0">
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[2px] h-16 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-b from-win-gold to-slate-200"></div>
              </div>
              <div className="flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${(i + 1) * 200}ms` }}>
                <div className="flex-1 flex flex-col items-end">
                  <div className={`${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border border-slate-100'} rounded-2xl p-4 shadow-sm opacity-40 grayscale flex items-center gap-3 w-full justify-end`}>
                    <span className={`text-sm font-serif line-through ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>{loser}</span>
                    <div className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-gray-600' : 'bg-slate-200'}`}></div>
                  </div>
                  <span className={`text-[9px] uppercase tracking-widest font-bold mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-slate-300'}`}>
                    {lang === 'zh' ? '已击败' : 'Defeated'}
                  </span>
                </div>
                <div className={`w-8 h-8 rounded-full ${theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-slate-50 border border-slate-100'} flex items-center justify-center shrink-0 z-10`}>
                  <span className={`text-[10px] font-mono font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-slate-300'}`}>0{losers.length - i}</span>
                </div>
                <div className="flex-1">
                  <div className={`border border-win-gold/20 bg-win-gold/[0.02] rounded-2xl p-4 flex items-center gap-3 w-full`}>
                    <div className="w-2 h-2 rounded-full bg-win-gold animate-pulse"></div>
                    <span className={`text-sm font-serif font-bold ${textClass}`}>{winner}</span>
                  </div>
                  <span className="text-[9px] uppercase tracking-widest text-win-gold font-bold mt-2">{lang === 'zh' ? '晋级' : 'Ascended'}</span>
                </div>
              </div>
              <svg className="absolute -top-20 left-0 w-full h-20 pointer-events-none overflow-visible" viewBox="0 0 200 80">
                <path d="M 100 0 L 100 40" className="win-path" style={{ stroke: '#C5A059', opacity: 0.3 }} />
                <path d="M 50 60 Q 50 40 100 40" className="lose-path" fill="none" style={{ stroke: theme === 'dark' ? '#333' : '#E5E5E5' }} />
                <path d="M 150 60 Q 150 40 100 40" className="win-path" fill="none" style={{ stroke: '#C5A059' }} />
              </svg>
            </div>
          ))}
          <div className="mt-12 flex flex-col items-center opacity-30 animate-in fade-in duration-1000 delay-1000">
            <div className={`w-1 h-12 bg-gradient-to-b ${theme === 'dark' ? 'from-gray-600 to-transparent' : 'from-slate-200 to-transparent'}`}></div>
            <span className={`text-[8px] uppercase tracking-[0.5em] font-bold ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>{ui.origin}</span>
          </div>
        </div>
      </main>
      <footer className={`w-full px-6 pb-10 pt-4 space-y-3 ${theme === 'dark' ? 'bg-dark-charcoal/80 border-t border-white/10' : 'bg-white/80 border-t border-gray-100'} backdrop-blur-md z-50`}>
        <button
          onClick={() => setShowReflect(true)}
          className={`w-full rounded-[1.75rem] py-3 text-[11px] uppercase tracking-[0.2em] font-semibold border flex items-center justify-center gap-2 ${
            theme === 'dark'
              ? 'border-white/15 text-white/80 bg-black/40'
              : 'border-black/8 text-slate-700 bg-white'
          }`}
        >
          <span className="material-symbols-outlined text-sm">self_improvement</span>
          {lang === 'zh' ? '这次选择现在回头看是对的吗？' : 'How does this choice feel in hindsight?'}
        </button>
        <button onClick={onBack} className={`w-full ${theme === 'dark' ? 'bg-primary text-void-black' : 'bg-black text-white'} rounded-[2rem] py-6 font-bold tracking-[0.2em] uppercase text-[10px] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3`}>
          <span>{ui.archiveRev}</span>
          <span className="material-symbols-outlined text-sm">inventory_2</span>
        </button>
      </footer>

      {showReflect && (
        <div className="absolute inset-0 z-[70] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowReflect(false)} />
          <div className={`relative w-full max-w-sm rounded-3xl p-6 shadow-2xl ${theme === 'dark' ? 'bg-black/90 border border-white/10 text-white' : 'bg-white border border-black/5 text-slate-900'}`}>
            <h3 className="text-xs uppercase tracking-[0.25em] text-gray-400 mb-2 font-semibold">
              {lang === 'zh' ? '决策复盘' : 'Post-mortem'}
            </h3>
            <p className="text-[13px] text-gray-500 dark:text-gray-300 mb-3">
              {lang === 'zh'
                ? '简单写下现在的感觉或新的信息，AI 会帮你提炼下一次类似决策可以更聪明的地方。'
                : 'Write a short reflection; AI will suggest how you might decide even better next time.'}
            </p>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              className={`w-full rounded-2xl border text-sm px-3 py-2 mb-3 resize-none h-24 focus:outline-none focus:ring-1 ${
                theme === 'dark'
                  ? 'bg-black/60 border-white/15 text-white placeholder:text-white/30 focus:ring-white/30'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-slate-400/60'
              }`}
              placeholder={
                lang === 'zh'
                  ? '现在回头看，你满意吗？有什么新的信息 / 感受？'
                  : 'Looking back, are you satisfied? Any new info or feelings?'
              }
            />
            {reflectionAI && (
              <div className={`mb-3 rounded-2xl px-3 py-2 text-xs border ${theme === 'dark' ? 'border-white/15 bg-white/5' : 'border-slate-200 bg-slate-50'}`}>
                <div className="flex items-center gap-1 mb-1">
                  <span className="material-symbols-outlined text-[14px] opacity-60">psychology</span>
                  <span className="text-[10px] uppercase tracking-[0.18em] opacity-70">
                    {lang === 'zh' ? 'AI 反馈' : 'AI Feedback'}
                  </span>
                </div>
                <p className="leading-relaxed opacity-90">{reflectionAI}</p>
              </div>
            )}
            <div className="flex gap-3 mt-1">
              <button
                type="button"
                onClick={() => setShowReflect(false)}
                className="flex-1 h-10 rounded-2xl border border-gray-300/40 dark:border-white/15 text-[11px] uppercase tracking-[0.2em] text-gray-500 dark:text-gray-300 active:scale-95 transition-transform"
              >
                {lang === 'zh' ? '下次再说' : 'Later'}
              </button>
              <button
                type="button"
                disabled={!reflection || isReflecting}
                onClick={async () => {
                  if (!reflection) return;
                  try {
                    setIsReflecting(true);
                    const advice = await analyzePostMortem(decision, reflection);
                    const updated: Decision = {
                      ...decision,
                      reflection,
                      reflectionAdvice: advice,
                    };
                    setReflectionAI(advice);
                    onReflect?.(updated);
                    showToast({
                      type: 'success',
                      message: lang === 'zh' ? '复盘已保存。' : 'Reflection saved.',
                    });
                  } catch (error) {
                    console.error(error);
                    showToast({
                      type: 'error',
                      message: lang === 'zh' ? '复盘分析失败，请稍后再试。' : 'Failed to analyze reflection. Please try again later.',
                    });
                  } finally {
                    setIsReflecting(false);
                  }
                }}
                className="flex-1 h-10 rounded-2xl bg-black text-white dark:bg-white dark:text-black text-[11px] uppercase tracking-[0.2em] font-semibold active:scale-95 transition-transform disabled:opacity-40"
              >
                {isReflecting
                  ? lang === 'zh' ? '分析中…' : 'Analyzing…'
                  : lang === 'zh' ? '生成反馈' : 'Get Feedback'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapScreen;
