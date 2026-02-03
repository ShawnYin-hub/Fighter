import React from 'react';
import { ChevronRight } from 'lucide-react';

interface SettingsItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onClick?: () => void;
}

const SettingsItem: React.FC<SettingsItemProps> = ({ icon, label, value, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-5 bg-white rounded-2xl mb-3 shadow-sm transition-colors hover:bg-gray-50 active:bg-gray-100"
    >
      <div className="flex items-center gap-4">
        <div className="text-gray-900">{icon}</div>
        <span className="font-semibold text-[15px]">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {value && <span className="text-gray-400 text-sm">{value}</span>}
        <ChevronRight className="w-5 h-5 text-gray-300" />
      </div>
    </button>
  );
};

export default SettingsItem;

