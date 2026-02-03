import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { Decision, DecisionBreakdown, Language } from './types';
import { dbService, authService, userService } from './services/firebaseService';
import { ToastProvider } from './contexts/ToastContext';

// 导入所有屏幕组件
import HomeScreen from './screens/HomeScreen';
import InputScreen from './screens/InputScreen';
import SelectionScreen from './screens/SelectionScreen';
import OptionEditor from './screens/OptionEditor';
import ArenaScreen from './screens/ArenaScreen';
import MapScreen from './screens/MapScreen';
import JourneyScreen from './screens/JourneyScreen';
import HistoryScreen from './screens/HistoryScreen';
import BottomNav from './components/BottomNav';
import ThemeToggle from './components/ThemeToggle';
import ToastContainer from './components/ToastContainer';
import OnboardingOverlay from './components/OnboardingOverlay';
import LoginPage from './screens/auth/LoginPage';
import RegisterPage from './screens/auth/RegisterPage';
import ProfilePage from './screens/profile/ProfilePage';
import LegalScreen from './screens/LegalScreen';

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

const AppContent: React.FC = () => {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('duelist_lang');
    return (saved as Language) || 'zh';
  });
  const [currentBreakdown, setCurrentBreakdown] = useState<DecisionBreakdown | null>(null);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [currentDecision, setCurrentDecision] = useState<Decision | null>(null);
  const [user, setUser] = useState<any>(null);
  const [authReady, setAuthReady] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    return !localStorage.getItem('duelist_onboarding_v1');
  });
  const navigate = useNavigate();
  const { theme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem('duelist_lang', lang);
  }, [lang]);

  useEffect(() => {
    // 监听认证状态
    const unsubscribe = authService.onAuthStateChanged((authUser) => {
      setUser(authUser);
      if (authUser) {
        userService.ensureUserProfile(authUser).catch(() => {});
        loadDecisions(authUser.uid);
      } else {
        // 未登录时从 localStorage 加载
        const saved = localStorage.getItem('duelist_history');
        if (saved) setDecisions(JSON.parse(saved));
      }
      setAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  const loadDecisions = async (userId: string) => {
    try {
      const loaded = await dbService.getDecisions(userId);
      setDecisions(loaded);
    } catch (error) {
      console.error('Failed to load decisions:', error);
      const saved = localStorage.getItem('duelist_history');
      if (saved) setDecisions(JSON.parse(saved));
    }
  };

  const enrichDecision = (decision: Decision): Decision => {
    const tags = new Set<string>(decision.tags || []);
    const text = `${decision.title || ''} ${decision.category || ''}`.toLowerCase();

    if (/[工作职场公司老板加班]/.test(text) || text.includes('job') || text.includes('work') || text.includes('career')) {
      tags.add(lang === 'zh' ? '工作' : 'work');
    }
    if (/[钱薪水工资投资房贷消费]/.test(text) || text.includes('money') || text.includes('salary') || text.includes('invest')) {
      tags.add(lang === 'zh' ? '金钱' : 'money');
    }
    if (/[感情恋爱结婚婚姻分手关系]/.test(text) || text.includes('love') || text.includes('relationship')) {
      tags.add(lang === 'zh' ? '感情' : 'relationship');
    }
    if (!tags.size) {
      tags.add(lang === 'zh' ? '生活' : 'life');
    }

    return {
      ...decision,
      tags: Array.from(tags),
    };
  };

  const saveDecision = async (decision: Decision) => {
    const enriched = enrichDecision(decision);
    try {
      if (user) {
        await dbService.saveDecision(enriched);
        await loadDecisions(user.uid);
      } else {
        const updated = [enriched, ...decisions];
        setDecisions(updated);
        localStorage.setItem('duelist_history', JSON.stringify(updated));
      }
    } catch (error) {
      console.error('Failed to save decision:', error);
      const updated = [enriched, ...decisions];
      setDecisions(updated);
      localStorage.setItem('duelist_history', JSON.stringify(updated));
    }
  };

  const updateDecision = async (decision: Decision) => {
    const enriched = enrichDecision(decision);
    try {
      if (user) {
        await dbService.updateDecision(enriched);
        await loadDecisions(user.uid);
      } else {
        const updated = decisions.map(d => d.id === decision.id ? enriched : d);
        setDecisions(updated);
        localStorage.setItem('duelist_history', JSON.stringify(updated));
      }
    } catch (error) {
      console.error('Failed to update decision:', error);
      const updated = decisions.map(d => d.id === decision.id ? enriched : d);
      setDecisions(updated);
      localStorage.setItem('duelist_history', JSON.stringify(updated));
    }
  };

  const addDecision = (newDec: Decision) => {
    setDecisions(prev => [newDec, ...prev]);
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

  const toggleLang = () => setLang(prev => prev === 'en' ? 'zh' : 'en');

  // 根据主题设置背景类
  const bgClass = theme === 'dark' ? 'bg-dark-charcoal text-white' : 'bg-gallery-white text-black';
  const containerClass = theme === 'dark' 
    ? 'min-h-screen bg-dark-charcoal text-white flex flex-col max-w-md mx-auto relative'
    : 'min-h-screen w-full max-w-md mx-auto relative bg-gallery-white flex flex-col';

  const isAuthOrProfile = location.pathname.startsWith('/auth') || location.pathname === '/me';
  const showGear =
    location.pathname === '/' ||
    location.pathname === '/input' ||
    location.pathname === '/history' ||
    location.pathname === '/history-dark';

  if (!authReady) return null;

  return (
    <div className={isAuthOrProfile ? undefined : containerClass}>
      {/* 主题切换和语言切换按钮（认证/个人中心页不叠加 UI） */}
      {!isAuthOrProfile && (
        <div className="absolute top-6 right-6 z-[110] flex items-center gap-2">
          {showGear && (
            <button
              onClick={() => navigate('/me')}
              className={`group w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-95 ${
                theme === 'dark'
                  ? 'bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10'
                  : 'bg-white/50 hover:bg-white/80 backdrop-blur-md border border-black/[0.06] shadow-sm'
              }`}
              aria-label="Profile"
              title="Profile"
            >
              <span
                className={`material-symbols-outlined text-[18px] transition-transform ${
                  theme === 'dark' ? 'text-duelist-gold' : 'text-black/70'
                } group-hover:rotate-90`}
              >
                settings
              </span>
            </button>
          )}
          <ThemeToggle />
          <button 
            onClick={toggleLang}
            className={`group flex items-center gap-2 px-3 py-1.5 rounded-full transition-all active:scale-95 ${
              theme === 'dark' 
                ? 'bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10' 
                : 'bg-white/40 hover:bg-white/80 backdrop-blur-md border border-black/[0.05]'
            }`}
          >
            <span className={`text-[9px] font-bold tracking-tighter ${lang === 'en' ? (theme === 'dark' ? 'text-white' : 'text-black') : (theme === 'dark' ? 'text-white/40' : 'text-slate-300')}`}>EN</span>
            <div className={`w-[1px] h-2 ${theme === 'dark' ? 'bg-white/20' : 'bg-slate-200'}`}></div>
            <span className={`text-[9px] font-bold tracking-tighter ${lang === 'zh' ? (theme === 'dark' ? 'text-white' : 'text-black') : (theme === 'dark' ? 'text-white/40' : 'text-slate-300')}`}>ZH</span>
          </button>
        </div>
      )}

      <Routes>
        {/* Auth / Profile pages (theme-specific UIs) */}
        <Route path="/legal" element={<LegalScreen lang={lang} />} />
        <Route path="/auth/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
        <Route path="/auth/register" element={user ? <Navigate to="/" replace /> : <RegisterPage />} />
        <Route path="/me" element={user ? <ProfilePage /> : <Navigate to="/auth/login" replace />} />

        {/* Light 主题路由 */}
        <Route path="/" element={user ? <HomeScreen onDuelStart={handleInitialBreakdown} lang={lang} /> : <Navigate to="/auth/login" replace />} />
        <Route 
          path="/selection" 
          element={user ? <SelectionScreen breakdown={currentBreakdown} onStart={startTournament} lang={lang} /> : <Navigate to="/auth/login" replace />} 
        />
        <Route 
          path="/arena" 
          element={user ? <ArenaScreen 
            breakdown={currentBreakdown} 
            lang={lang} 
            decisions={decisions}
            onComplete={(decision) => {
              saveDecision(decision);
              navigate('/map');
            }} 
          /> : <Navigate to="/auth/login" replace />} 
        />
        <Route 
          path="/map" 
          element={user ? <MapScreen decision={decisions[0]} onBack={() => navigate('/history')} lang={lang} onReflect={updateDecision} /> : <Navigate to="/auth/login" replace />} 
        />
        <Route 
          path="/history" 
          element={user ? <HistoryScreen history={decisions} decisions={decisions} onNew={() => navigate('/')} lang={lang} onTogglePin={updateDecision} /> : <Navigate to="/auth/login" replace />} 
        />

        {/* Dark 主题路由 */}
        <Route path="/input" element={user ? <InputScreen onAdd={addDecision} lang={lang} toggleLang={toggleLang} /> : <Navigate to="/auth/login" replace />} />
        <Route path="/edit/:id" element={user ? <OptionEditor decisions={decisions} onUpdate={updateDecision} lang={lang} /> : <Navigate to="/auth/login" replace />} />
        <Route path="/arena-dark/:id" element={user ? <ArenaScreen decisions={decisions} onUpdate={updateDecision} lang={lang} /> : <Navigate to="/auth/login" replace />} />
        <Route path="/journey/:id" element={user ? <JourneyScreen decisions={decisions} lang={lang} /> : <Navigate to="/auth/login" replace />} />
        <Route path="/history-dark" element={user ? <HistoryScreen decisions={decisions} lang={lang} onTogglePin={updateDecision} /> : <Navigate to="/auth/login" replace />} />
      </Routes>

      {/* BottomNav 只在特定路由显示 */}
      {!isAuthOrProfile && <BottomNav lang={lang} />}

      {!isAuthOrProfile && theme === 'light' && (
        <div className="h-1.5 w-32 bg-black/5 rounded-full mx-auto mb-2 shrink-0"></div>
      )}

      {!isAuthOrProfile && showOnboarding && (
        <OnboardingOverlay
          lang={lang}
          onClose={() => {
            localStorage.setItem('duelist_onboarding_v1', '1');
            setShowOnboarding(false);
          }}
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AppContent />
        <ToastContainer />
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
