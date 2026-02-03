import React from 'react';

export const Logo: React.FC = () => {
  return (
    <div className="relative mb-8">
      <div className="w-20 h-20 rounded-full border-2 border-duelist-gold flex items-center justify-center logo-glow bg-gradient-to-br from-duelist-charcoal to-black relative">
        <span className="text-duelist-gold font-serif text-3xl font-bold tracking-tighter">VS</span>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-duelist-gold rounded-full"></div>
      </div>
    </div>
  );
};

