
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Message, User } from '../types';

interface DashboardScreenProps {
  user: User;
  onLogout: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ user, onLogout }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: `Welcome, ${user.name || 'Duelist'}. The arena awaits. How may I assist your ascent to Rank One today?` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [...messages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        })), { role: 'user', parts: [{ text: userMsg }] }],
        config: {
          systemInstruction: "You are the Duelist Concierge. You are helpful, sophisticated, and slightly mysterious. You assist users with dueling strategies, arena lore, and general inquiries about 'The Arena of Choice'. Always maintain the premium, high-stakes atmosphere.",
        }
      });

      const aiResponse = response.text || "I apologize, the arena echoes are unclear. Please repeat.";
      setMessages(prev => [...prev, { role: 'model', text: aiResponse }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "A shadow falls across the arena. Connectivity is lost." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div class="flex flex-col h-screen w-full bg-duelist-charcoal">
      {/* Header */}
      <header class="flex items-center justify-between px-6 py-6 border-b border-zinc-800/50 bg-black/20 backdrop-blur-md">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full border border-duelist-gold flex items-center justify-center bg-black">
            <span class="text-duelist-gold font-serif text-[10px] font-bold">VS</span>
          </div>
          <div>
            <h2 class="text-xs font-serif font-bold text-white uppercase tracking-widest">Arena Hall</h2>
            <p class="text-[9px] text-zinc-500 uppercase tracking-widest">Logged in as {user.name || user.email}</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          class="text-[10px] uppercase tracking-widest text-duelist-gold font-bold hover:text-white transition-colors"
        >
          Exit
        </button>
      </header>

      {/* Messages */}
      <div 
        ref={scrollRef}
        class="flex-1 overflow-y-auto px-6 py-8 space-y-6 scrollbar-hide"
      >
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            class={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              class={`max-w-[85%] px-5 py-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-white text-black font-medium ios-shadow' 
                  : 'glass-input text-zinc-200 border-zinc-800/50'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div class="flex justify-start">
            <div class="glass-input px-5 py-4 rounded-2xl text-zinc-500 italic text-sm border-zinc-800/50 animate-pulse">
              Concierge is contemplating...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div class="px-6 pb-12 pt-4 bg-gradient-to-t from-black to-transparent">
        <div class="relative max-w-2xl mx-auto">
          <input 
            class="w-full glass-input rounded-2xl py-5 pl-6 pr-16 text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-duelist-gold/30 transition-all shadow-2xl" 
            placeholder="Summon the Concierge..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={isTyping || !input.trim()}
            class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-duelist-gold text-black flex items-center justify-center hover:bg-duelist-gold-light transition-colors disabled:opacity-30 disabled:grayscale"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
