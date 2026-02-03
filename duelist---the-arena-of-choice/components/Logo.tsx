
import React from 'react';

export const Logo: React.FC<{ glow?: boolean }> = ({ glow = true }) => {
  return (
    <div className="relative mb-8">
      <div className={`w-20 h-20 rounded-full bg-black flex items-center justify-center relative ${glow ? 'logo-glow' : ''}`}>
        <span className="text-duelist-gold font-serif text-3xl font-bold tracking-tighter">VS</span>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-duelist-gold rounded-full ring-4 ring-gallery-white"></div>
      </div>
    </div>
  );
};
