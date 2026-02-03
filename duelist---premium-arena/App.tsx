
import React, { useState } from 'react';
import { LoginScreen } from './screens/LoginScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { Screen, User } from './types';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (email: string) => {
    setUser({ email, name: email.split('@')[0] });
    setCurrentScreen('dashboard');
  };

  const handleRegister = (email: string, name: string) => {
    setUser({ email, name });
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentScreen('login');
  };

  return (
    <div class="min-h-screen bg-duelist-charcoal text-white font-sans selection:bg-duelist-gold/30">
      {currentScreen === 'login' && (
        <LoginScreen 
          onNavigate={setCurrentScreen} 
          onLogin={handleLogin} 
        />
      )}
      
      {currentScreen === 'register' && (
        <RegisterScreen 
          onNavigate={setCurrentScreen} 
          onRegister={handleRegister} 
        />
      )}

      {currentScreen === 'dashboard' && user && (
        <DashboardScreen 
          user={user} 
          onLogout={handleLogout} 
        />
      )}
    </div>
  );
};

export default App;
