
import React from 'react';

interface StatCardProps {
  value: string | number;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ value, label }) => {
  return (
    <div className="bg-white rounded-3xl p-6 flex flex-col items-center justify-center shadow-sm border border-gray-50 aspect-square transition-transform active:scale-95 cursor-pointer">
      <span className="text-3xl font-bold tracking-tight mb-1">{value}</span>
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
    </div>
  );
};

export default StatCard;
