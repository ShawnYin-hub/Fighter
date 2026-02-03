
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface Props {
  lang: 'en' | 'zh';
}

const BottomNav: React.FC<Props> = ({ lang }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  if (location.pathname === '/') return null;

  const t = {
    en: { history: "Archive", portal: "Portal", insights: "Insights" },
    zh: { history: "存档", portal: "入口", insights: "洞察" }
  }[lang];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 glass border-t border-white/10 px-8 py-4 flex justify-between items-center z-40 max-w-md mx-auto">
        <button onClick={() => navigate('/history')} className={`flex flex-col items-center gap-1 ${isActive('/history') ? 'text-primary' : 'text-gray-500'}`}>
          <span className="material-symbols-outlined fill-1">history</span>
          <span className="text-[10px] uppercase font-bold tracking-tighter">{t.history}</span>
        </button>

        <button onClick={() => navigate('/')} className="w-14 h-14 bg-primary rounded-full flex items-center justify-center -mt-12 shadow-xl shadow-primary/20 border-4 border-dark-charcoal active:scale-90 transition-transform">
          <span className="material-symbols-outlined text-dark-charcoal font-bold text-3xl">add</span>
        </button>

        <button className="flex flex-col items-center gap-1 text-gray-500">
          <span className="material-symbols-outlined">insights</span>
          <span className="text-[10px] uppercase font-bold tracking-tighter">{t.insights}</span>
        </button>
      </nav>
      <div className="fixed bottom-1 w-32 h-1 bg-white/20 rounded-full left-1/2 -translate-x-1/2 z-50"></div>
    </>
  );
};

export default BottomNav;
