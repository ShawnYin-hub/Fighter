import React, { useState } from 'react';
import { analyzeLogic } from '../../../../services/deepseekService';
import { DuelResult } from '../types';

const DuelScreen: React.FC = () => {
  const [statement, setStatement] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DuelResult | null>(null);

  const handleDuel = async () => {
    if (!statement.trim()) return;
    setIsLoading(true);
    setResult(null);
    const data = await analyzeLogic(statement);
    setResult({
      ...data,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    setIsLoading(false);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full mb-8 text-center">
        <h2 className="text-2xl font-serif font-bold text-white mb-2">Challenge the Void</h2>
        <p className="text-zinc-500 text-sm">Submit a claim for logical arbitration.</p>
      </div>

      <div className="w-full mb-8">
        <textarea
          value={statement}
          onChange={(e) => setStatement(e.target.value)}
          placeholder="Enter your logical claim here..."
          className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-duelist-gold/40 transition-colors"
        />
      </div>

      <button
        onClick={handleDuel}
        disabled={isLoading || !statement}
        className="w-full py-4 bg-duelist-charcoal border border-duelist-gold text-duelist-gold rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-duelist-gold hover:text-black transition-all disabled:opacity-50"
      >
        {isLoading ? (
          <span className="material-symbols-outlined animate-spin">refresh</span>
        ) : (
          <>
            <span className="material-symbols-outlined">gavel</span>
            Seek Verdict
          </>
        )}
      </button>

      {result && (
        <div className="w-full mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="w-full glass-row rounded-2xl p-6 border-duelist-gold/30">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block mb-1">Verdict</span>
                <span className="text-2xl font-serif text-duelist-gold font-bold">{result.verdict}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block mb-1">Clarity</span>
                <span className="text-2xl font-serif text-white font-bold">{result.score}%</span>
              </div>
            </div>
            
            <div className="p-4 bg-black/40 rounded-xl border border-white/5 mb-4">
              <p className="text-zinc-300 text-sm leading-relaxed italic">"{result.analysis}"</p>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-zinc-600 font-medium">
              <span className="material-symbols-outlined text-xs">schedule</span>
              Arbited at {result.timestamp}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DuelScreen;

