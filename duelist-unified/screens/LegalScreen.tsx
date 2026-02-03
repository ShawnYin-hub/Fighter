import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Language } from '../types';
import { useNavigate } from 'react-router-dom';

interface LegalScreenProps {
  lang: Language;
}

const LegalScreen: React.FC<LegalScreenProps> = ({ lang }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isZh = lang === 'zh';

  return (
    <div className={`min-h-screen w-full max-w-md mx-auto flex flex-col ${theme === 'dark' ? 'bg-dark-charcoal text-white' : 'bg-gallery-white text-slate-900'}`}>
      <header className="px-6 pt-8 pb-4 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className={`w-9 h-9 rounded-full flex items-center justify-center active:scale-95 transition-transform ${
            theme === 'dark' ? 'glass' : 'bg-white shadow-sm border border-black/5'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">{isZh ? 'arrow_back' : 'arrow_back'}</span>
        </button>
        <div className="text-center flex-1">
          <h1 className="text-xs uppercase tracking-[0.25em] text-gray-400 font-semibold">
            {isZh ? '合规说明' : 'Legal'}
          </h1>
        </div>
        <div className="w-9 h-9" />
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar px-6 pb-12 pt-2 text-sm leading-relaxed">
        <section className="mb-8">
          <h2 className="text-base font-semibold mb-2">
            {isZh ? '隐私政策（概要）' : 'Privacy Policy (Summary)'}
          </h2>
          <p className="text-xs text-gray-500 mb-3">
            {isZh
              ? '以下内容为产品设计层面的说明，具体以上架时正式隐私协议文本为准。'
              : 'This is a product-level description; final legal text may differ for store review.'}
          </p>
          <ul className="list-disc pl-5 space-y-2 text-[13px]">
            <li>
              {isZh
                ? '我们仅在你登录后将决策历史与个人档案存储在 Firebase，主要用于跨设备同步与个人画像。'
                : 'We store your decision history and profile in Firebase only after you sign in, for sync and insights.'}
            </li>
            <li>
              {isZh
                ? '所有通过 DeepSeek 的分析仅用于为你提供建议，不会作为任何强制性决策依据。'
                : 'All DeepSeek analyses are suggestions only; they are never mandatory or authoritative decisions.'}
            </li>
            <li>
              {isZh
                ? '你可以随时注销账号或删除数据（后续版本可在个人中心提供入口）。'
                : 'You may request account/data deletion at any time (a future version can expose this inside Profile).'
              }
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-base font-semibold mb-2">
            {isZh ? '用户协议（概要）' : 'User Agreement (Summary)'}
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-[13px]">
            <li>
              {isZh
                ? '本应用为决策辅助工具，不构成投资、医疗、法律等专业建议。'
                : 'This app is a decision support tool and does not provide investment, medical, or legal advice.'}
            </li>
            <li>
              {isZh
                ? '你对自己的最终决策及其后果负责。'
                : 'You are solely responsible for your final decisions and outcomes.'}
            </li>
            <li>
              {isZh
                ? '请勿输入敏感个人隐私、机密信息或违法内容。'
                : 'Do not input highly sensitive personal data, secrets, or illegal content.'}
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-2">
            {isZh ? '数据同步说明' : 'Sync Across Devices'}
          </h2>
          <p className="text-[13px]">
            {isZh
              ? '使用同一个账号在手机、网页或其他端登录时，你的决策历史会自动在 Firebase 中安全同步。'
              : 'When you sign in with the same account on phone, web, or other devices, your history syncs via Firebase.'}
          </p>
        </section>
      </main>
    </div>
  );
};

export default LegalScreen;

