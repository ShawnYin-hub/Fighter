import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { authService, userService } from '../../services/firebaseService';
import LightLoginScreen from '../../external/auth/light/screens/LoginScreen';
import { LoginScreen as DarkLoginScreen } from '../../external/auth/dark/screens/LoginScreen';
import { useToast } from '../../contexts/ToastContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { showToast } = useToast();

  const signIn = async (email: string, password: string) => {
    try {
      const cred = await authService.signInWithEmail(email, password);
      if (cred?.user) {
        await userService.ensureUserProfile(cred.user);
      }
      navigate('/');
    } catch (e: any) {
      console.error(e);
      showToast({
        type: 'error',
        message: e?.message || 'Login failed',
      });
    }
  };

  const forgot = async (email: string) => {
    if (!email) return;
    try {
      await authService.sendPasswordReset(email);
      showToast({
        type: 'info',
        message: 'Reset email sent',
      });
    } catch (e: any) {
      console.error(e);
      showToast({
        type: 'error',
        message: e?.message || 'Failed to send reset email',
      });
    }
  };

  if (theme === 'dark') {
    return (
      <div className="min-h-screen bg-duelist-charcoal text-white font-sans selection:bg-duelist-gold/30">
        <DarkLoginScreen
          onNavigate={() => navigate('/auth/register')}
          onLogin={signIn}
          onForgotPassword={forgot}
        />
        <div className="w-full text-center pb-4 text-[10px] text-zinc-500">
          <button
            onClick={() => navigate('/legal')}
            className="underline underline-offset-4 decoration-zinc-600 hover:text-zinc-300"
          >
            Privacy & Terms
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-lg mx-auto bg-gallery-white relative overflow-hidden font-sans">
      <LightLoginScreen
        onLogin={signIn}
        onSignUp={() => navigate('/auth/register')}
        onForgotPassword={forgot}
      />
      <div className="fixed bottom-2 w-32 h-1 bg-black/10 rounded-full left-1/2 -translate-x-1/2 z-50"></div>
      <div className="w-full text-center pb-6 text-[10px] text-slate-400">
        <button
          onClick={() => navigate('/legal')}
          className="underline underline-offset-4 decoration-slate-300 hover:text-slate-600"
        >
          隐私政策 / 使用条款
        </button>
      </div>
    </div>
  );
};

export default LoginPage;

