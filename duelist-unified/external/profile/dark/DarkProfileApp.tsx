import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Profile from './components/Profile';
import DuelScreen from './components/DuelScreen';
import { Screen, UserStats } from './types';
import { authService, userService } from '../../../services/firebaseService';

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
    const user = authService.getCurrentUser();
    if (!user) return;
    userService.ensureUserProfile(user).catch(() => {});
    userService.getUserProfile(user.uid).then((p) => {
      if (!p) return;
      const handle = p.displayName || (p.email ? p.email.split('@')[0] : '0812');
      setStats(prev => ({ ...prev, associateId: `#${handle}`.replace('##', '#') }));
    }).catch(() => {});
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

