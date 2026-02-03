
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children, title, onBack, rightAction }) => {
  return (
    <div className="flex flex-col min-h-screen w-full bg-duelist-charcoal overflow-x-hidden">
      {/* Top Header */}
      <div className="fixed top-0 w-full px-6 pt-12 pb-4 flex items-center justify-between z-20 bg-duelist-charcoal/80 backdrop-blur-md border-b border-white/5">
        <button 
          onClick={onBack}
          className="material-symbols-outlined text-white/50 text-2xl hover:text-white transition-colors"
        >
          {onBack ? 'chevron_left' : 'menu'}
        </button>
        <span className="text-[11px] uppercase tracking-[0.3em] font-semibold text-white/40">{title}</span>
        <div className="flex items-center gap-2">
          {rightAction || <button className="material-symbols-outlined text-duelist-gold text-2xl">more_horiz</button>}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex flex-col flex-1 w-full px-6 pt-32 pb-12">
        {children}
      </main>

      {/* iOS Home Indicator Mock */}
      <div className="fixed bottom-1 w-32 h-1 bg-white/10 rounded-full left-1/2 -translate-x-1/2"></div>
    </div>
  );
};

export default Layout;
