import React from 'react';
import { UserStats } from '../types';
import { authService } from '../../../../services/supabaseService';
import { useTheme } from '../../../../contexts/ThemeContext';

interface ProfileProps {
  stats: UserStats;
  onNavigateDuel: () => void;
}

const Profile: React.FC<ProfileProps> = ({ stats, onNavigateDuel }) => {
  const { theme, toggleTheme } = useTheme();

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      window.location.hash = '#/auth/login';
    } catch (e) {
      console.error(e);
    }
  };

  const handleAccountClick = async () => {
    try {
      await authService.signOut();
      window.location.hash = '#/auth/login';
    } catch (e) {
      console.error(e);
    }
  };

  const handleHistoryPrivacyClick = () => {
    window.location.hash = '#/history-dark';
  };

  return (
    <div className="w-full">
      {/* Profile Header */}
      <div className="flex flex-col items-center w-full mb-10">
        <div className="relative mb-5 group">
          <div className="w-24 h-24 rounded-full border border-duelist-gold/40 p-1.5 avatar-glow relative overflow-visible">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-zinc-800 to-black flex items-center justify-center overflow-hidden border border-white/10">
              <span className="material-symbols-outlined text-duelist-gold text-5xl font-extralight">person</span>
            </div>
          </div>
          <button className="edit-badge group-active:scale-90 transition-transform duration-200">
            <span className="material-symbols-outlined text-[14px] text-duelist-gold">edit</span>
          </button>
        </div>
        
        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Associate {stats.associateId}</h1>
        
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-duelist-gold/10 border border-duelist-gold/20">
          <span className="material-symbols-outlined text-[14px] text-duelist-gold">verified</span>
          <span className="text-duelist-gold text-[10px] uppercase tracking-[0.15em] font-bold">
            Clarity Score: {stats.clarityScore}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-10">
        <div className="stat-card">
          <span className="text-zinc-500 text-[9px] uppercase tracking-widest mb-1.5 font-semibold">Total Duels</span>
          <span className="text-xl font-serif font-bold text-white">{stats.totalDuels}</span>
        </div>
        <div className="stat-card">
          <span className="text-zinc-500 text-[9px] uppercase tracking-widest mb-1.5 font-semibold">Win Rate</span>
          <span className="text-xl font-serif font-bold text-duelist-gold">{stats.winRate}</span>
        </div>
        <div className="stat-card">
          <span className="text-zinc-500 text-[9px] uppercase tracking-widest mb-1.5 font-semibold">Last Decision</span>
          <span className="text-xl font-serif font-bold text-white">{stats.lastDecision}</span>
        </div>
        <div className="stat-card">
          <span className="text-zinc-500 text-[9px] uppercase tracking-widest mb-1.5 font-semibold">Logic Score</span>
          <span className="text-xl font-serif font-bold text-white">{stats.logicScore}</span>
        </div>
      </div>

      {/* New Duel Action */}
      <button 
        onClick={onNavigateDuel}
        className="w-full mb-8 bg-duelist-gold text-black font-bold py-4 rounded-xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
      >
        <span className="material-symbols-outlined">swords</span>
        <span className="uppercase tracking-widest text-xs">Initiate Logic Duel</span>
      </button>

      {/* Menu List */}
      <div className="w-full space-y-2 mb-12">
        <MenuItem icon="manage_accounts" label="Account" onClick={handleAccountClick} />
        <MenuItem icon="architecture" label="Decision Style" onClick={onNavigateDuel} />
        <MenuItem icon="shield_lock" label="History Privacy" onClick={handleHistoryPrivacyClick} />
        <MenuItem 
          icon="dark_mode" 
          label="App Theme" 
          rightText={theme === 'dark' ? 'Dark' : 'Light'} 
          onClick={toggleTheme} 
        />
      </div>

      {/* Sign Out */}
      <div className="py-8 text-center">
        <button
          onClick={handleSignOut}
          className="text-[12px] font-serif uppercase tracking-[0.2em] text-duelist-gold hover:text-duelist-gold-light transition-colors px-6 py-2.5 border border-duelist-gold/20 rounded-lg active:scale-95 transition-all"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

const MenuItem: React.FC<{ icon: string; label: string; rightText?: string; onClick?: () => void }> = ({ icon, label, rightText, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full glass-row rounded-xl px-5 py-4 flex items-center justify-between group active:scale-[0.98] transition-all cursor-pointer text-left"
  >
    <div className="flex items-center gap-4">
      <span className="material-symbols-outlined text-duelist-gold text-xl">{icon}</span>
      <span className="text-[15px] font-medium text-white/90">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      {rightText && <span className="text-xs text-white/40">{rightText}</span>}
      <span className="material-symbols-outlined text-white/20 text-xl">chevron_right</span>
    </div>
  </button>
);

export default Profile;

