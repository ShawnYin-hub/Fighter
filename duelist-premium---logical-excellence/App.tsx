
import React, { useState } from 'react';
import Layout from './components/Layout';
import Profile from './components/Profile';
import DuelScreen from './components/DuelScreen';
import { Screen, UserStats } from './types';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.PROFILE);

  const [stats] = useState<UserStats>({
    totalDuels: 124,
    winRate: "82%",
    lastDecision: "2h ago",
    logicScore: "A+",
    clarityScore: 98,
    associateId: "#0812"
  });

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.PROFILE:
        return (
          <Layout title="Profile">
            <Profile 
              stats={stats} 
              onNavigateDuel={() => setCurrentScreen(Screen.DUEL)} 
            />
          </Layout>
        );
      case Screen.DUEL:
        return (
          <Layout 
            title="Logic Duel" 
            onBack={() => setCurrentScreen(Screen.PROFILE)}
          >
            <DuelScreen />
          </Layout>
        );
      default:
        return <div>Screen not found</div>;
    }
  };

  return (
    <div className="antialiased">
      {renderScreen()}
    </div>
  );
};

export default App;
