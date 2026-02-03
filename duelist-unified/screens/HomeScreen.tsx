import React, { useState, useEffect, useRef } from 'react';
import { breakdownDecision } from '../services/deepseekService';
import { DecisionBreakdown, Language } from '../types';
import { t } from '../App';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import { speechService } from '../services/speechService';

interface HomeScreenProps {
  onDuelStart: (breakdown: DecisionBreakdown) => void;
  lang: Language;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onDuelStart, lang }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingText, setRecordingText] = useState('');
  const { theme } = useTheme();
  const ui = t[lang];
  const { showToast } = useToast();
  const recognitionRef = useRef(false);

  const handleProcess = async (text: string) => {
    if (!text) return;
    setIsProcessing(true);
    try {
      const breakdown = await breakdownDecision(text, lang);
      onDuelStart(breakdown);
    } catch (error) {
      console.error(error);
      showToast({
        type: 'error',
        message: lang === 'zh' ? '分析失败，请重试。' : 'Failed to analyze decision. Please try again.',
        actionLabel: lang === 'zh' ? '重试' : 'Retry',
        onAction: () => handleProcess(text),
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartRecording = () => {
    if (!speechService.isAvailable()) {
      showToast({
        type: 'error',
        message: lang === 'zh' 
          ? '您的浏览器不支持语音识别，请使用 Chrome 或 Edge 浏览器。' 
          : 'Speech recognition is not supported. Please use Chrome or Edge.',
      });
      return;
    }

    if (isRecording) {
      // Stop recording
      speechService.stop();
      setIsRecording(false);
      if (recordingText) {
        setInput(recordingText);
        setRecordingText('');
      }
    } else {
      // Start recording - automatically switch to typing mode in light theme to show text
      if (theme === 'light' && !isTyping) {
        setIsTyping(true);
      }
      
      setIsRecording(true);
      setRecordingText('');
      recognitionRef.current = true;

      speechService.start(
        lang,
        (text, isFinal) => {
          if (recognitionRef.current) {
            setRecordingText(text);
            if (isFinal) {
              setInput(text);
            }
          }
        },
        (error) => {
          setIsRecording(false);
          recognitionRef.current = false;
          showToast({
            type: 'error',
            message: error,
          });
        },
        () => {
          setIsRecording(false);
          recognitionRef.current = false;
          if (recordingText) {
            setInput(recordingText);
            setRecordingText('');
          }
        }
      );
    }
  };

  useEffect(() => {
    return () => {
      if (isRecording) {
        speechService.stop();
      }
    };
  }, [isRecording]);

  // Light 主题版本
  if (theme === 'light') {
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
            value={isRecording ? recordingText || input : input}
            onChange={(e) => {
              if (!isRecording) {
                setInput(e.target.value);
              }
            }}
          />
          {isRecording && recordingText && (
            <p className="text-xs text-gray-400 mt-2 italic">
              {lang === 'zh' ? '录音中，可继续说话...' : 'Recording, keep speaking...'}
            </p>
          )}
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
                onClick={handleStartRecording}
                className={`w-20 h-20 bg-white rounded-full flex items-center justify-center border border-light-gold/20 active:scale-90 transition-all shadow-sm ${isRecording ? 'animate-pulse scale-110 shadow-gold-glow bg-red-50' : isProcessing ? 'animate-pulse scale-110 shadow-gold-glow' : 'mic-glow'}`}
              >
                <span className={`material-symbols-outlined text-3xl ${isRecording ? 'text-red-500' : 'text-light-gold'}`}>
                  {isRecording ? 'mic' : 'mic'}
                </span>
              </button>
              {isRecording && (
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
              )}
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Dark 主题版本
  const handlePasteClick = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText) {
        setInput(clipboardText);
      }
    } catch (err) { 
      console.error('Failed to read clipboard:', err); 
    }
  };

  const handleSubmit = () => {
    if (!input.trim()) return;
    handleProcess(input);
  };

  return (
    <div className="flex-1 bg-void-black flex flex-col items-center select-none pt-16 h-full">
      <header className="w-full px-8 flex justify-between items-center z-20">
        <div className="w-10"></div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse"></div>
          <span className="text-[10px] uppercase tracking-[0.4em] font-medium text-white/40">
            {lang === 'en' ? 'Input Mode' : '输入模式'}
          </span>
        </div>
        <button className="w-10 h-10 flex items-center justify-end text-white/60">
          <span className="material-symbols-outlined text-2xl">help</span>
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-start pt-12 px-8 relative w-full">
        <div className="text-center mb-16 z-10">
          <h1 className="text-[28px] font-light tracking-tight text-white/90">
            {lang === 'en' ? 'What are we deciding?' : '我们要决定什么？'}
          </h1>
          <p className="text-white/20 text-[10px] mt-4 tracking-[0.25em] uppercase font-medium">
            {lang === 'en' ? 'Drop your chaos into the void' : '将你的混乱投向虚无'}
          </p>
        </div>

        <div className="w-full mb-8 z-20">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-transparent border-none focus:ring-0 text-center text-primary text-xl font-serif placeholder:text-white/10 min-h-[120px] resize-none"
            placeholder={lang === 'en' ? 'Type your struggle here...' : '在这里输入你的纠结...'}
            autoFocus
          />
        </div>

        <div className="relative w-72 h-72 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-white/5 scale-[1.1]"></div>
          <div className="absolute inset-0 rounded-full border border-white/5 scale-[1.05]"></div>
          <div className="w-56 h-56 rounded-full flex flex-col items-center justify-center border border-white/5 relative z-10 bg-gradient-to-b from-primary/5 to-transparent">
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mb-6 overflow-hidden">
              <div className={`transition-all duration-500 transform ${input.length > 0 ? 'scale-110 rotate-12' : 'scale-100'}`}>
                <span className="material-symbols-outlined text-2xl text-white/60">
                  {input.length > 0 ? 'auto_awesome' : 'add'}
                </span>
              </div>
            </div>
            <div className="text-[9px] text-white/30 tracking-[0.3em] uppercase font-semibold">
              {input.length > 0 
                ? (lang === 'en' ? 'Analyze Theme' : '分析主题')
                : (lang === 'en' ? 'The Chaos' : '混沌初始')
              }
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full px-8 pb-14 pt-4 flex flex-col items-center gap-6 z-20">
        <div className="flex items-center justify-center gap-4 w-full max-w-sm">
          <button onClick={handlePasteClick} className="flex-1 glass h-16 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-xl text-white/60">content_paste</span>
            <span className="text-[13px] font-medium text-white/70">{lang === 'en' ? 'Paste' : '粘贴'}</span>
          </button>
          
          <div className="relative flex items-center justify-center">
            <div className={`absolute inset-0 bg-primary/20 blur-xl rounded-full transition-opacity duration-500 ${input.length > 0 || isRecording ? 'opacity-100 animate-pulse' : 'opacity-0'}`}></div>
            <button 
              onClick={input.trim().length > 0 ? handleSubmit : handleStartRecording} 
              className={`relative w-[76px] h-[76px] rounded-full ${isRecording ? 'bg-red-500' : 'bg-primary'} flex flex-col items-center justify-center shadow-gold-pulse active:scale-90 transition-all duration-300`}
            >
              <div className="w-[68px] h-[68px] rounded-full border border-void-black/10 flex items-center justify-center bg-gradient-to-b from-white/10 to-transparent">
                <span className="material-symbols-outlined text-3xl text-void-black transition-all duration-300">
                  {isRecording ? 'stop' : input.trim().length > 0 ? 'send' : 'mic'}
                </span>
              </div>
            </button>
            {isRecording && (
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
            )}
          </div>
          
          <button onClick={() => setIsTyping(true)} className="flex-1 glass h-16 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-xl text-white/60">keyboard</span>
            <span className="text-[13px] font-medium text-white/70">{lang === 'en' ? 'Type' : '打字'}</span>
          </button>
        </div>
        <div className="text-center mt-2">
          <p className="text-[9px] text-white/30 tracking-[0.35em] uppercase font-bold">
            {isRecording 
              ? (lang === 'en' ? 'Recording...' : '录音中...')
              : input.length > 0 
                ? (lang === 'en' ? 'Generate Options' : '生成选项')
                : (lang === 'en' ? 'Vocal Venting' : '语音吐槽')
            }
          </p>
          {isRecording && recordingText && (
            <p className="text-[10px] text-primary/60 mt-1 italic max-w-xs truncate">
              {recordingText}
            </p>
          )}
        </div>
      </footer>
    </div>
  );
};

export default HomeScreen;
