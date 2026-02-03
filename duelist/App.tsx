
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import SelectionScreen from './screens/SelectionScreen';
import ArenaScreen from './screens/ArenaScreen';
import MapScreen from './screens/MapScreen';
import HistoryScreen from './screens/HistoryScreen';
import { Decision, DecisionBreakdown, Language } from './types';

export const t = {
  en: {
    homePrompt: "What choice is weighing on you?",
    homeStatus: "Listening for your voice...",
    homeProcessing: "Processing consciousness...",
    beginDuel: "Begin Duel",
    type: "Type",
    paste: "Paste",
    selection: "Selection",
    newSoul: "New Soul",
    commence: "Commence Arena",
    duel: "The Duel",
    champion: "Champion",
    challenger: "Challenger",
    oracle: "Consult the Oracle",
    fallen: "The Fallen",
    revive: "Revive",
    reviveNote: "Reviving swaps the current Challenger",
    decMap: "Decision Map",
    sovPath: "The Sovereign Path",
    defOptions: "Defeated Options",
    origin: "Point of Origin",
    archiveRev: "Archive Revelation",
    archive: "Archive",
    search: "Search past revelations...",
    contested: "Contested against",
    others: "other paths",
    refining: "Refining Option",
    confirm: "Confirm Soul",
    cancel: "Cancel",
    oneWord: "Keep it to one powerful word",
    backToHistory: "Return to History",
    historyTitle: "The halls of memory are empty.",
    endArchive: "End of Archive"
  },
  zh: {
    homePrompt: "此刻你在纠结什么？",
    homeStatus: "等待你的声音...",
    homeProcessing: "意识同步中...",
    beginDuel: "开启对决",
    type: "打字",
    paste: "粘贴",
    selection: "阵容筛选",
    newSoul: "新战魂",
    commence: "进入角斗场",
    duel: "决战时刻",
    champion: "守擂者",
    challenger: "挑战者",
    oracle: "咨询神谕",
    fallen: "败者殿堂",
    revive: "复活",
    reviveNote: "复活将替换当前的挑战者",
    decMap: "决策图谱",
    sovPath: "最终抉择",
    defOptions: "已淘汰路径",
    origin: "抉择原点",
    archiveRev: "存入档案",
    archive: "记忆宫殿",
    search: "搜索过往启示...",
    contested: "击败了",
    others: "个对手",
    refining: "提炼战魂",
    confirm: "确定",
    cancel: "取消",
    oneWord: "请使用简洁有力的词语",
    backToHistory: "返回档案",
    historyTitle: "记忆长廊空空如也。",
    endArchive: "档案终点"
  }
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('zh');
  const [currentBreakdown, setCurrentBreakdown] = useState<DecisionBreakdown | null>(null);
  const [history, setHistory] = useState<Decision[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('duelist_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const saveDecision = (decision: Decision) => {
    const updated = [decision, ...history];
    setHistory(updated);
    localStorage.setItem('duelist_history', JSON.stringify(updated));
  };

  const handleInitialBreakdown = (breakdown: DecisionBreakdown) => {
    setCurrentBreakdown(breakdown);
    navigate('/selection');
  };

  const startTournament = (updatedOptions: string[]) => {
    if (currentBreakdown) {
      setCurrentBreakdown({ ...currentBreakdown, options: updatedOptions });
      navigate('/arena');
    }
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-md mx-auto relative bg-gallery-white">
      {/* Absolute Header - Cleaner look */}
      <div className="absolute top-6 right-6 z-[110]">
        <button 
          onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
          className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/40 hover:bg-white/80 backdrop-blur-md border border-black/[0.05] transition-all active:scale-95"
        >
          <span className={`text-[9px] font-bold tracking-tighter ${lang === 'en' ? 'text-black' : 'text-slate-300'}`}>EN</span>
          <div className="w-[1px] h-2 bg-slate-200"></div>
          <span className={`text-[9px] font-bold tracking-tighter ${lang === 'zh' ? 'text-black' : 'text-slate-300'}`}>ZH</span>
        </button>
      </div>

      <Routes>
        <Route path="/" element={<HomeScreen onDuelStart={handleInitialBreakdown} lang={lang} />} />
        <Route 
          path="/selection" 
          element={<SelectionScreen breakdown={currentBreakdown} onStart={startTournament} lang={lang} />} 
        />
        <Route 
          path="/arena" 
          element={<ArenaScreen breakdown={currentBreakdown} lang={lang} onComplete={(decision) => {
            saveDecision(decision);
            navigate('/map');
          }} />} 
        />
        <Route 
          path="/map" 
          element={<MapScreen decision={history[0]} onBack={() => navigate('/history')} lang={lang} />} 
        />
        <Route 
          path="/history" 
          element={<HistoryScreen history={history} onNew={() => navigate('/')} lang={lang} />} 
        />
      </Routes>

      <div className="h-1.5 w-32 bg-black/5 rounded-full mx-auto mb-2 shrink-0"></div>
    </div>
  );
};

export default App;
