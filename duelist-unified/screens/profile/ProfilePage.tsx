import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { authService } from '../../services/supabaseService';
import LightProfile from '../../external/profile/light/LightProfile';
import DarkProfileApp from '../../external/profile/dark/DarkProfileApp';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    authService.getCurrentUser().then((user) => {
      if (!user) navigate('/auth/login');
    });
  }, [navigate]);

  return theme === 'dark' ? (
    <DarkProfileApp />
  ) : (
    <LightProfile />
  );
};

export default ProfilePage;

