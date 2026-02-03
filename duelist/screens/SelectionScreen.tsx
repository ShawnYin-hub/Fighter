
import React, { useState, useEffect } from 'react';
import { DecisionBreakdown, Language } from '../types';
import { t } from '../App';

interface SelectionScreenProps {
  breakdown: DecisionBreakdown | null;
  onStart: (options: string[]) => void;
  lang: Language;
}

const SelectionScreen: React.FC<SelectionScreenProps> = ({ breakdown, onStart, lang }) => {
  const [options, setOptions] = useState<string[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const ui = t[lang];

  useEffect(() => {
    if (breakdown) setOptions(breakdown.options);
  }, [breakdown]);

  const handleAdd = () => {
    const newList = [...options, lang === 'zh' ? '新项' : 'New'];
    setOptions(newList);
    setEditingIndex(newList.length - 1);
    setEditValue("");
  };

  const handleRemove = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditValue(options[index]);
  };

  const saveEdit = () => {
    if (editingIndex !== null) {
      const updated = [...options];
      const trimmed = editValue.trim() || (lang === 'zh' ? '选项' : 'Option');
      updated[editingIndex] = trimmed.length > 15 ? trimmed.substring(0, 12) + "..." : trimmed;
      setOptions(updated);
      setEditingIndex(null);
    }
  };

  if (!breakdown) return null;

  return (
    <div className="flex-1 flex flex-col bg-gallery-white animate-in fade-in duration-500 overflow-hidden relative">
      <header className="flex justify-between items-center px-6 pt-6 mb-4">
        <button onClick={() => window.history.back()} className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm border border-black/5">
          <span className="material-symbols-outlined text-slate-400">arrow_back</span>
        </button>
        <div className="text-center">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-400">{ui.selection}</span>
          <h1 className="text-sm font-bold text-slate-900">{breakdown.category}</h1>
        </div>
        <div className="w-10 h-10 flex items-center justify-center">
           <span className="text-xs font-mono font-bold text-win-gold">{options.length}</span>
        </div>
      </header>

      <div className="px-8 mb-6">
         <p className="text-sm italic text-slate-400 text-center font-serif leading-relaxed px-4">
           "{breakdown.logicQuote}"
         </p>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-32">
        <div className="grid grid-cols-2 gap-4">
          {options.map((opt, i) => (
            <div 
              key={i} 
              className="group relative h-32 bg-white rounded-3xl border border-black/[0.03] shadow-sm flex flex-col items-center justify-center p-4 transition-all active:scale-95 hover:border-win-gold/30 hover:shadow-md animate-in zoom-in duration-300"
              style={{ animationDelay: `${i * 50}ms` }}
              onClick={() => startEdit(i)}
            >
              <button 
                onClick={(e) => { e.stopPropagation(); handleRemove(i); }}
                className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-slate-300 hover:text-red-400 transition"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
              
              <span className="text-[10px] uppercase tracking-widest text-slate-300 font-bold mb-2">0{i+1}</span>
              <h3 className="text-lg font-serif font-bold text-slate-900 text-center break-words max-w-full">
                {opt}
              </h3>
              
              <div className="absolute bottom-3 w-4 h-[2px] bg-slate-100 group-hover:bg-win-gold/40 transition-colors"></div>
            </div>
          ))}

          <button 
            onClick={handleAdd}
            className="h-32 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400 hover:bg-white hover:border-win-gold/40 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-2xl">add</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">{ui.newSoul}</span>
          </button>
        </div>
      </div>

      <div className="fixed bottom-10 left-6 right-6 z-50">
        <button
          onClick={() => onStart(options)}
          disabled={options.length < 2}
          className="w-full bg-black text-white rounded-[2rem] py-6 font-bold tracking-[0.2em] uppercase text-[10px] shadow-2xl active:scale-95 transition-all disabled:opacity-20 flex items-center justify-center gap-3"
        >
          <span>{ui.commence}</span>
          <span className="material-symbols-outlined text-sm">bolt</span>
        </button>
      </div>

      {editingIndex !== null && (
        <div className="absolute inset-0 z-[100] bg-white/60 backdrop-blur-xl p-8 animate-in fade-in zoom-in-95 duration-200 flex flex-col items-center justify-center">
          <div className="w-full max-w-xs flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-[0.4em] text-slate-400 font-bold mb-8">{ui.refining} {editingIndex + 1}</span>
            
            <input 
              autoFocus
              className="w-full bg-transparent border-none focus:ring-0 text-5xl font-serif font-bold text-center placeholder-slate-200 mb-12"
              placeholder={lang === 'zh' ? '如：休息' : 'Ex: Rest'}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={saveEdit}
              onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
              maxLength={15}
            />

            <div className="flex gap-4">
               <button onClick={saveEdit} className="bg-black text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl active:scale-90 transition">{ui.confirm}</button>
               <button onClick={() => setEditingIndex(null)} className="bg-white border border-slate-100 text-slate-400 px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest active:scale-90 transition">{ui.cancel}</button>
            </div>
            
            <p className="mt-8 text-[10px] text-slate-300 uppercase tracking-widest font-medium">{ui.oneWord}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectionScreen;
