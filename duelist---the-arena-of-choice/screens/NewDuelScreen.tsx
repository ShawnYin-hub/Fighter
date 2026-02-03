
import React, { useState } from 'react';
import { analyzeDuel } from '../services/geminiService';
import { SavedDuel } from '../types';

interface NewDuelScreenProps {
  onBack: () => void;
  onDuelComplete: (duel: SavedDuel) => void;
}

const NewDuelScreen: React.FC<NewDuelScreenProps> = ({ onBack, onDuelComplete }) => {
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStartDuel = async () => {
    if (!optionA || !optionB) return;
    setLoading(true);
    setError('');

    try {
      const result = await analyzeDuel(optionA, optionB);
      const newDuel: SavedDuel = {
        id: Math.random().toString(36).substr(2, 9),
        optionA,
        optionB,
        result,
        timestamp: Date.now(),
      };
      onDuelComplete(newDuel);
    } catch (err) {
      setError('The Arena spirits are restless. Please try again.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen w-full items-center justify-center px-8 bg-gallery-white">
        <div className="relative mb-12 animate-pulse">
          <div className="w-24 h-24 rounded-full bg-black flex items-center justify-center badge-glow">
            <span className="text-duelist-gold font-serif text-4xl font-bold tracking-tighter">VS</span>
          </div>
          <div className="absolute inset-0 rounded-full border-4 border-duelist-gold border-t-transparent animate-spin"></div>
        </div>
        <h2 className="text-xl font-serif font-bold text-center mb-2">Analyzing Choices...</h2>
        <p className="text-zinc-400 text-xs uppercase tracking-widest text-center animate-pulse">Gemini is judging the Arena</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full px-8 pt-16 pb-12 animate-in slide-in-from-bottom duration-500">
      <div className="flex items-center mb-12">
        <button onClick={onBack} className="p-2 -ml-2 text-duelist-black hover:opacity-50">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="flex-1 text-center font-serif font-bold text-lg uppercase tracking-[0.2em] pr-4">Initiate Duel</h1>
      </div>

      <div className="flex-1 space-y-8">
        <div className="space-y-3">
          <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 block px-1">Challenger A</label>
          <input 
            className="w-full ios-input rounded-2xl py-5 px-6 text-lg font-medium focus:outline-none"
            placeholder="e.g., Python"
            value={optionA}
            onChange={(e) => setOptionA(e.target.value)}
          />
        </div>

        <div className="relative h-12 flex items-center justify-center">
          <div className="h-[0.5px] w-full bg-zinc-200"></div>
          <div className="absolute bg-gallery-white px-4 text-duelist-gold font-serif italic text-xl">VS</div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 block px-1">Challenger B</label>
          <input 
            className="w-full ios-input rounded-2xl py-5 px-6 text-lg font-medium focus:outline-none"
            placeholder="e.g., JavaScript"
            value={optionB}
            onChange={(e) => setOptionB(e.target.value)}
          />
        </div>

        {error && <p className="text-red-500 text-xs text-center font-medium">{error}</p>}
      </div>

      <button 
        disabled={!optionA || !optionB}
        onClick={handleStartDuel}
        className={`w-full bg-duelist-black text-white font-bold py-5 rounded-2xl ios-shadow active:scale-[0.98] transition-all text-center mt-6 ${(!optionA || !optionB) ? 'opacity-50' : 'opacity-100'}`}
      >
        <span className="uppercase tracking-[0.3em] text-sm">Start The Duel</span>
      </button>
    </div>
  );
};

export default NewDuelScreen;
