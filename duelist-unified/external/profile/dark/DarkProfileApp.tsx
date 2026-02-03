import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Profile from './components/Profile';
import DuelScreen from './components/DuelScreen';
import { Screen, UserStats } from './types';
import { authService } from '../../../services/supabaseService';

const DarkProfileApp: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.PROFILE);
  const [stats, setStats] = useState<UserStats>({
    totalDuels: 124,
    winRate: "82%",
    lastDecision: "2h ago",
    logicScore: "A+",
    clarityScore: 98,
    associateId: "#0812"
  });

  useEffect(() => {
    // Supabase 版本暂不做 profile 表同步，这里保留默认 stats，不影响 UI
    // （后续可以新增 profiles 表再补齐）
    void authService.getCurrentUser();
  }, []);

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

export default DarkProfileApp;

