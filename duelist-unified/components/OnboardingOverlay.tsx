import React, { useState } from 'react';
import { Language } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface OnboardingOverlayProps {
  lang: Language;
  onClose: () => void;
}

const OnboardingOverlay: React.FC<OnboardingOverlayProps> = ({ lang, onClose }) => {
  const { theme } = useTheme();
  const [step, setStep] = useState(0);

  const isZh = lang === 'zh';

  const slides = [
    {
      title: isZh ? '一次只决斗两个选项' : 'Duel Two Options at a Time',
      body: isZh
        ? '不管你有多少选择，决斗家只会在同一时刻让你面对两个，让大脑瞬间变清晰。'
        : 'No matter how many options you have, Duelist only shows you two at a time, keeping your mind clear.',
    },
    {
      title: isZh ? 'Light / Dark 双宇宙' : 'Light & Dark Universes',
      body: isZh
        ? 'Light 是柔和可视化流程，Dark 是极简逻辑角斗场，你可以随时在右上角切换。'
        : 'Light is a soft visual journey, Dark is a minimal logic arena — switch anytime from the top-right toggle.',
    },
    {
      title: isZh ? '个人中心是你的“决策档案馆”' : 'Profile as Your Decision Archive',
      body: isZh
        ? '所有登录后的决策都会安全同步到云端，你可以在个人中心看到画像、历史与逻辑报告。'
        : 'All logged-in decisions sync securely to the cloud; your profile reveals your patterns, history, and logic reports.',
    },
  ];

  const slide = slides[step];

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={onClose} />
      <div
        className={`relative w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-6
        ${theme === 'dark' ? 'bg-black/85 border border-white/10 text-white' : 'bg-white border border-black/5 text-slate-900'}`}
      >
        <div className="mb-4 text-[10px] uppercase tracking-[0.25em] text-gray-400 font-semibold">
          {isZh ? '第一次见面' : 'First Time'}
        </div>
        <h2 className="text-xl font-serif font-bold mb-3">{slide.title}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-300 leading-relaxed mb-6">{slide.body}</p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-1">
            {slides.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full ${i === step ? 'bg-black dark:bg-white' : 'bg-gray-300 dark:bg-gray-600'}`}
              />
            ))}
          </div>
          <button
            onClick={onClose}
            className="text-[11px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            {isZh ? '跳过' : 'Skip'}
          </button>
        </div>

        <button
          onClick={() => {
            if (step < slides.length - 1) {
              setStep(step + 1);
            } else {
              onClose();
            }
          }}
          className="w-full py-3 rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] bg-black text-white dark:bg-white dark:text-black active:scale-95 transition-transform"
        >
          {step < slides.length - 1
            ? isZh ? '下一步' : 'Next'
            : isZh ? '开始决斗' : 'Begin'}
        </button>
      </div>
    </div>
  );
};

export default OnboardingOverlay;

