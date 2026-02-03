
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Decision, DecisionStatus } from '../types';

interface Props {
  onAdd: (d: Decision) => void;
  lang: 'en' | 'zh';
  toggleLang: () => void;
}

const InputScreen: React.FC<Props> = ({ onAdd, lang, toggleLang }) => {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const t = {
    en: {
      mode: "Input Mode",
      title: "What are we deciding?",
      subtitle: "Drop your chaos into the void",
      placeholder: "Type your struggle here...",
      analyze: "Analyze Theme",
      chaos: "The Chaos",
      paste: "Paste",
      type: "Type",
      confirm: "Generate Options",
      voice: "Vocal Venting"
    },
    zh: {
      mode: "输入模式",
      title: "我们要决定什么？",
      subtitle: "将你的混乱投向虚无",
      placeholder: "在这里输入你的纠结...",
      analyze: "分析主题",
      chaos: "混沌初始",
      paste: "粘贴",
      type: "打字",
      confirm: "生成选项",
      voice: "语音吐槽"
    }
  }[lang];

  const handleSubmit = () => {
    if (!text.trim()) return;
    
    const newDecision: Decision = {
      id: Math.random().toString(36).substr(2, 9),
      title: text.length > 30 ? text.substring(0, 30) + '...' : text,
      category: 'General',
      date: lang === 'zh' ? '刚刚' : 'Just Now',
      status: DecisionStatus.PENDING,
      options: [],
      eliminated: []
    };
    
    onAdd(newDecision);
    navigate(`/edit/${newDecision.id}`);
  };

  const handleTypeClick = () => textareaRef.current?.focus();

  const handlePasteClick = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText) {
        setText(clipboardText);
        textareaRef.current?.focus();
      }
    } catch (err) { console.error('Failed to read clipboard:', err); }
  };

  return (
    <div className="flex-1 bg-void-black flex flex-col items-center select-none pt-16 h-full">
      <header className="w-full px-8 flex justify-between items-center z-20">
        <button onClick={toggleLang} className="glass px-3 py-1 rounded-full flex items-center gap-1.5 active:scale-95 transition-transform">
           <span className="text-[10px] font-bold text-primary tracking-widest uppercase">{lang === 'en' ? 'EN' : '中文'}</span>
           <span className="material-symbols-outlined text-xs text-primary/60">translate</span>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse"></div>
          <span className="text-[10px] uppercase tracking-[0.4em] font-medium text-white/40">{t.mode}</span>
        </div>
        <button className="w-10 h-10 flex items-center justify-end text-white/60">
          <span className="material-symbols-outlined text-2xl">help</span>
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-start pt-12 px-8 relative w-full">
        <div className="text-center mb-16 z-10">
          <h1 className="text-[28px] font-light tracking-tight text-white/90">{t.title}</h1>
          <p className="text-white/20 text-[10px] mt-4 tracking-[0.25em] uppercase font-medium">{t.subtitle}</p>
        </div>

        <div className="w-full mb-8 z-20">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-transparent border-none focus:ring-0 text-center text-primary text-xl font-serif placeholder:text-white/10 min-h-[120px] resize-none"
            placeholder={t.placeholder}
            autoFocus
          />
        </div>

        <div className="relative w-72 h-72 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-white/5 scale-[1.1]"></div>
          <div className="absolute inset-0 rounded-full border border-white/5 scale-[1.05]"></div>
          <div className="w-56 h-56 rounded-full flex flex-col items-center justify-center border border-white/5 relative z-10 bg-gradient-to-b from-primary/5 to-transparent">
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mb-6 overflow-hidden">
               <div className={`transition-all duration-500 transform ${text.length > 0 ? 'scale-110 rotate-12' : 'scale-100'}`}>
                  <span className="material-symbols-outlined text-2xl text-white/60">
                    {text.length > 0 ? 'auto_awesome' : 'add'}
                  </span>
               </div>
            </div>
            <div className="text-[9px] text-white/30 tracking-[0.3em] uppercase font-semibold">
              {text.length > 0 ? t.analyze : t.chaos}
            </div>
          </div>
          <div className="absolute top-4 right-2 w-12 h-12 glass rounded-xl flex items-center justify-center rotate-[15deg]">
            <span className="material-symbols-outlined text-white/40 text-xl">link</span>
          </div>
          <div className="absolute bottom-10 left-0 w-12 h-12 glass rounded-full flex items-center justify-center -rotate-[10deg]">
            <span className="material-symbols-outlined text-white/40 text-xl">image</span>
          </div>
        </div>
      </main>

      <footer className="w-full px-8 pb-14 pt-4 flex flex-col items-center gap-6 z-20">
        <div className="flex items-center justify-center gap-4 w-full max-w-sm">
          <button onClick={handlePasteClick} className="flex-1 glass h-16 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-xl text-white/60">content_paste</span>
            <span className="text-[13px] font-medium text-white/70">{t.paste}</span>
          </button>
          
          <div className="relative flex items-center justify-center">
            <div className={`absolute inset-0 bg-primary/20 blur-xl rounded-full transition-opacity duration-500 ${text.length > 0 ? 'opacity-100 animate-pulse' : 'opacity-0'}`}></div>
            <button onClick={handleSubmit} className="relative w-[76px] h-[76px] rounded-full bg-primary flex flex-col items-center justify-center shadow-gold-pulse active:scale-90 transition-all duration-300">
              <div className="w-[68px] h-[68px] rounded-full border border-void-black/10 flex items-center justify-center bg-gradient-to-b from-white/10 to-transparent">
                <span className="material-symbols-outlined text-3xl text-void-black transition-all duration-300">
                  {text.trim().length > 0 ? 'send' : 'mic'}
                </span>
              </div>
            </button>
          </div>
          
          <button onClick={handleTypeClick} className="flex-1 glass h-16 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-xl text-white/60">keyboard</span>
            <span className="text-[13px] font-medium text-white/70">{t.type}</span>
          </button>
        </div>
        <div className="text-center mt-2">
          <p className="text-[9px] text-white/30 tracking-[0.35em] uppercase font-bold">
            {text.length > 0 ? t.confirm : t.voice}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default InputScreen;
