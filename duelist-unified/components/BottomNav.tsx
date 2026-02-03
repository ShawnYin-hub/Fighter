import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

interface Props {
  lang: 'en' | 'zh';
}

const BottomNav: React.FC<Props> = ({ lang }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

  const isActive = (path: string) => location.pathname === path;

  // 只在特定路由显示
  const hiddenPaths = ['/', '/selection', '/arena', '/map'];
  if (hiddenPaths.includes(location.pathname)) return null;

  const t = {
    en: { history: "Archive", portal: "Portal", insights: "Insights" },
    zh: { history: "存档", portal: "入口", insights: "洞察" }
  }[lang];

  const navClass = theme === 'dark'
    ? 'fixed bottom-0 left-0 right-0 glass border-t border-white/10 px-8 py-4 flex justify-between items-center z-40 max-w-md mx-auto'
    : 'fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] bg-white/80 backdrop-blur-xl rounded-full px-6 py-4 flex items-center gap-10 shadow-soft border border-black/[0.05]';

  return (
    <>
      <nav className={navClass}>
        <button 
          onClick={() => navigate('/history')} 
          className={`flex flex-col items-center gap-1 ${
            isActive('/history') || isActive('/history-dark')
              ? (theme === 'dark' ? 'text-primary' : 'text-win-gold')
              : (theme === 'dark' ? 'text-gray-500' : 'text-slate-300')
          }`}
        >
          <span className={`material-symbols-outlined ${isActive('/history') || isActive('/history-dark') ? 'fill-[1]' : ''}`}>history</span>
          <span className="text-[10px] uppercase font-bold tracking-tighter">{t.history}</span>
        </button>

        <button 
          onClick={() => navigate('/')} 
          className={`${
            theme === 'dark'
              ? 'w-14 h-14 bg-primary rounded-full flex items-center justify-center -mt-12 shadow-xl shadow-primary/20 border-4 border-dark-charcoal active:scale-90 transition-transform'
              : 'w-12 h-12 bg-black rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-transform'
          }`}
        >
          <span className={`material-symbols-outlined ${theme === 'dark' ? 'text-dark-charcoal font-bold text-3xl' : 'text-white text-2xl'}`}>add</span>
        </button>

        <button className={`flex flex-col items-center gap-1 ${theme === 'dark' ? 'text-gray-500' : 'text-slate-300'}`}>
          <span className="material-symbols-outlined">insights</span>
          <span className="text-[10px] uppercase font-bold tracking-tighter">{t.insights}</span>
        </button>
      </nav>
      {theme === 'dark' && (
        <div className="fixed bottom-1 w-32 h-1 bg-white/20 rounded-full left-1/2 -translate-x-1/2 z-50"></div>
      )}
    </>
  );
};

export default BottomNav;
