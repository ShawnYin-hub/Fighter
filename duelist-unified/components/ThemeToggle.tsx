import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`group relative w-12 h-6 rounded-full transition-all duration-300 active:scale-95 ${
        theme === 'dark' 
          ? 'bg-white/20 border border-white/10' 
          : 'bg-black/10 border border-black/10'
      }`}
      aria-label="Toggle theme"
    >
      {/* 切换指示器 */}
      <div
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-all duration-300 flex items-center justify-center ${
          theme === 'dark'
            ? 'translate-x-6 bg-white/90 shadow-lg'
            : 'translate-x-0 bg-white shadow-md'
        }`}
      >
        <span className={`material-symbols-outlined text-xs transition-all duration-300 ${
          theme === 'dark' ? 'text-dark-charcoal' : 'text-slate-400'
        }`}>
          {theme === 'dark' ? 'dark_mode' : 'light_mode'}
        </span>
      </div>
      
      {/* 背景装饰 */}
      <div className={`absolute inset-0 rounded-full transition-opacity duration-300 ${
        theme === 'dark' ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/5 to-transparent"></div>
      </div>
    </button>
  );
};

export default ThemeToggle;
