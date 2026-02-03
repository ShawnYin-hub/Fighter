
import React, { useState } from 'react';
import { breakdownDecision } from '../services/geminiService';
import { DecisionBreakdown, Language } from '../types';
import { t } from '../App';

interface HomeScreenProps {
  onDuelStart: (breakdown: DecisionBreakdown) => void;
  lang: Language;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onDuelStart, lang }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const ui = t[lang];

  const handleProcess = async (text: string) => {
    if (!text) return;
    setIsProcessing(true);
    try {
      const breakdown = await breakdownDecision(text, lang);
      onDuelStart(breakdown);
    } catch (error) {
      console.error(error);
      alert(lang === 'zh' ? "分析失败，请重试。" : "Failed to analyze decision. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isTyping) {
    return (
      <div className="flex-1 flex flex-col p-8 pt-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button onClick={() => setIsTyping(false)} className="self-start mb-8 text-ios-gray">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-3xl font-serif mb-6 italic">{lang === 'zh' ? '描述你的困境...' : 'Describe your dilemma...'}</h2>
        <textarea
          autoFocus
          className="flex-1 bg-transparent border-none focus:ring-0 text-xl font-serif resize-none p-0 placeholder-gray-300"
          placeholder={lang === 'zh' ? '例如：在安稳的工作与高风险创业之间抉择...' : 'e.g., choosing between the stability of my current job or a risky startup...'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={() => handleProcess(input)}
          disabled={!input || isProcessing}
          className="bg-black text-white rounded-2xl py-5 font-bold tracking-widest uppercase text-xs disabled:opacity-30 transition-all shadow-xl active:scale-95"
        >
          {isProcessing ? ui.homeProcessing : ui.beginDuel}
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <header className="w-full px-6 py-6 flex justify-between items-center z-50">
        <div className="w-10"></div>
        <div className="text-center">
          <h1 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">Duelist</h1>
        </div>
        <button className="w-10 h-10 flex items-center justify-center transition active:opacity-50">
          <span className="material-symbols-outlined text-2xl text-slate-300">help</span>
        </button>
      </header>

      <main className="flex-1 relative flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[120, 220, 340, 480, 640].map((size, i) => (
            <div 
              key={size} 
              className={`concentric-circle animate-ring`} 
              style={{ 
                width: `${size}px`, 
                height: `${size}px`,
                animationDelay: `${i * 0.8}s`
              }} 
            />
          ))}
        </div>
        
        <div className="z-10 text-center px-12 transition-all duration-1000">
          <h2 className="text-2xl font-serif text-gray-800 tracking-tight leading-relaxed">
            {ui.homePrompt}
          </h2>
          <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400 mt-4 font-medium">
            {isProcessing ? ui.homeProcessing : ui.homeStatus}
          </p>
        </div>
      </main>

      <footer className="w-full px-8 pb-12 pt-4 relative z-50">
        <div className="flex flex-col items-center gap-10">
          <div className="flex gap-4 w-full max-w-[280px]">
            <button className="flex-1 glass-light rounded-2xl py-3 flex items-center justify-center gap-2 transition active:scale-95">
              <span className="material-symbols-outlined text-lg text-gray-500">content_paste</span>
              <span className="text-xs font-semibold text-gray-600">{ui.paste}</span>
            </button>
            <button 
              onClick={() => setIsTyping(true)}
              className="flex-1 glass-light rounded-2xl py-3 flex items-center justify-center gap-2 transition active:scale-95"
            >
              <span className="material-symbols-outlined text-lg text-gray-500">keyboard</span>
              <span className="text-xs font-semibold text-gray-600">{ui.type}</span>
            </button>
          </div>
          
          <div className="relative">
            <button 
              className={`w-20 h-20 bg-white rounded-full flex items-center justify-center border border-light-gold/20 active:scale-90 transition-all shadow-sm ${isProcessing ? 'animate-pulse scale-110 shadow-gold-glow' : 'mic-glow'}`}
            >
              <span className="material-symbols-outlined text-3xl text-light-gold">mic</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomeScreen;
