import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { authService } from '../../services/firebaseService';
import LightProfile from '../../external/profile/light/LightProfile';
import DarkProfileApp from '../../external/profile/dark/DarkProfileApp';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) navigate('/auth/login');
  }, [navigate]);

  return theme === 'dark' ? (
    <DarkProfileApp />
  ) : (
    <LightProfile />
  );
};

export default ProfilePage;

