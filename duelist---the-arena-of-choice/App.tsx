
import React, { useState, useEffect } from 'react';
import { Screen, SavedDuel } from './types';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import DashboardScreen from './screens/DashboardScreen';
import NewDuelScreen from './screens/NewDuelScreen';
import DuelResultScreen from './screens/DuelResultScreen';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.LOGIN);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [activeDuel, setActiveDuel] = useState<SavedDuel | null>(null);
  const [savedDuels, setSavedDuels] = useState<SavedDuel[]>([]);

  // Simulate loading saved duels from local storage
  useEffect(() => {
    const duels = localStorage.getItem('duelist_history');
    if (duels) {
      setSavedDuels(JSON.parse(duels));
    }
  }, []);

  const saveDuel = (duel: SavedDuel) => {
    const updated = [duel, ...savedDuels];
    setSavedDuels(updated);
    localStorage.setItem('duelist_history', JSON.stringify(updated));
  };

  const navigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleLogin = (email: string) => {
    setUser({ email });
    navigate(Screen.DASHBOARD);
  };

  const handleLogout = () => {
    setUser(null);
    navigate(Screen.LOGIN);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.LOGIN:
        return <LoginScreen onLogin={handleLogin} onSignUp={() => navigate(Screen.SIGNUP)} />;
      case Screen.SIGNUP:
        return <SignUpScreen onBackToLogin={() => navigate(Screen.LOGIN)} onSignUpComplete={handleLogin} />;
      case Screen.DASHBOARD:
        return (
          <DashboardScreen 
            user={user} 
            duels={savedDuels} 
            onNewDuel={() => navigate(Screen.NEW_DUEL)} 
            onViewDuel={(duel) => {
              setActiveDuel(duel);
              navigate(Screen.DUEL_RESULT);
            }}
            onLogout={handleLogout}
          />
        );
      case Screen.NEW_DUEL:
        return (
          <NewDuelScreen 
            onBack={() => navigate(Screen.DASHBOARD)} 
            onDuelComplete={(duel) => {
              saveDuel(duel);
              setActiveDuel(duel);
              navigate(Screen.DUEL_RESULT);
            }} 
          />
        );
      case Screen.DUEL_RESULT:
        return (
          <DuelResultScreen 
            duel={activeDuel} 
            onBack={() => navigate(Screen.DASHBOARD)} 
          />
        );
      default:
        return <LoginScreen onLogin={handleLogin} onSignUp={() => navigate(Screen.SIGNUP)} />;
    }
  };

  return (
    <div className="min-h-screen w-full max-w-lg mx-auto bg-gallery-white relative overflow-hidden font-sans">
      {renderScreen()}
      
      {/* iOS Home Indicator */}
      <div className="fixed bottom-2 w-32 h-1 bg-black/10 rounded-full left-1/2 -translate-x-1/2 z-50"></div>
    </div>
  );
};

export default App;
