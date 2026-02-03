import React from 'react';
import { useToast } from '../contexts/ToastContext';
import { useTheme } from '../contexts/ThemeContext';

const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useToast();
  const { theme } = useTheme();

  if (!toasts.length) return null;

  return (
    <div className="pointer-events-none fixed inset-0 flex items-end justify-center z-[999] px-4 pb-16">
      <div className="space-y-2 w-full max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm shadow-lg border animate-in slide-in-from-bottom-2 fade-in
              ${theme === 'dark' ? 'bg-black/80 border-white/10 text-white' : 'bg-white border-black/5 text-slate-900'}
            `}
          >
            <div className="flex-1">
              <p className="text-[13px] leading-snug">{toast.message}</p>
            </div>
            <div className="flex items-center gap-2 ml-2">
              {toast.actionLabel && toast.onAction && (
                <button
                  onClick={() => {
                    toast.onAction?.();
                    dismissToast(toast.id);
                  }}
                  className="text-[11px] font-semibold uppercase tracking-widest px-2 py-1 rounded-full bg-black/5 dark:bg-white/10"
                >
                  {toast.actionLabel}
                </button>
              )}
              <button
                onClick={() => dismissToast(toast.id)}
                className="text-xs opacity-60 hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToastContainer;

