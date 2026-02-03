
import React from 'react';

export const Logo: React.FC = () => {
  return (
    <div class="relative mb-8">
      <div class="w-20 h-20 rounded-full border-2 border-duelist-gold flex items-center justify-center logo-glow bg-gradient-to-br from-duelist-charcoal to-black relative">
        <span class="text-duelist-gold font-serif text-3xl font-bold tracking-tighter">VS</span>
        <div class="absolute -top-1 -right-1 w-3 h-3 bg-duelist-gold rounded-full"></div>
      </div>
    </div>
  );
};
