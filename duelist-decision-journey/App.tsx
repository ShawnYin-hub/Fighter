
import React, { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Decision, DecisionStatus } from './types';
import HistoryScreen from './components/HistoryScreen';
import InputScreen from './components/InputScreen';
import OptionEditor from './components/OptionEditor';
import ArenaScreen from './components/ArenaScreen';
import JourneyScreen from './components/JourneyScreen';
import BottomNav from './components/BottomNav';

const INITIAL_DECISIONS: Decision[] = [
  {
    id: '1',
    title: 'Weekend Escape',
    category: 'Travel',
    date: 'Today',
    status: DecisionStatus.COMPLETED,
    options: [],
    eliminated: ['Osaka', 'Nara'],
    winner: 'Kyoto',
    summary: 'You prefer cultural heritage over urban noise.',
    efficiency: 92
  }
];

const App: React.FC = () => {
  const [decisions, setDecisions] = useState<Decision[]>(INITIAL_DECISIONS);
  const [lang, setLang] = useState<'en' | 'zh'>('zh');

  const addDecision = (newDec: Decision) => {
    setDecisions(prev => [newDec, ...prev]);
  };

  const updateDecision = (updated: Decision) => {
    setDecisions(prev => prev.map(d => d.id === updated.id ? updated : d));
  };

  const toggleLang = () => setLang(prev => prev === 'en' ? 'zh' : 'en');

  return (
    <HashRouter>
      <div className="min-h-screen bg-dark-charcoal text-white flex flex-col max-w-md mx-auto relative overflow-hidden">
        <Routes>
          <Route path="/" element={<InputScreen onAdd={addDecision} lang={lang} toggleLang={toggleLang} />} />
          <Route path="/edit/:id" element={<OptionEditor decisions={decisions} onUpdate={updateDecision} lang={lang} />} />
          <Route path="/arena/:id" element={<ArenaScreen decisions={decisions} onUpdate={updateDecision} lang={lang} />} />
          <Route path="/journey/:id" element={<JourneyScreen decisions={decisions} lang={lang} />} />
          <Route path="/history" element={<HistoryScreen decisions={decisions} lang={lang} />} />
        </Routes>
        <BottomNav lang={lang} />
      </div>
    </HashRouter>
  );
};

export default App;
