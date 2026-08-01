import React from 'react';
import type { ScreenName } from '../types';

interface HeaderNavProps {
  onNavigate: (screen: ScreenName) => void;
  onOpenAI: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ onNavigate, onOpenAI }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#F2E8DC]/90 backdrop-blur-md shadow-sm border-b border-[#bec9c5]/40 transition-all duration-300">
      <div className="flex items-center justify-between px-5 h-16 w-full max-w-screen-xl mx-auto">
        
        {/* Brand Title matching Stitch Header */}
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('home')}>
          <h1 className="font-poppins text-2xl font-black text-[#005145] tracking-tight">
            DHAMME
          </h1>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#005145]/10 text-[#005145] border border-[#005145]/20">
            REAL ESTATE
          </span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2">
          
          {/* AI Helper Trigger */}
          <button
            onClick={onOpenAI}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-[#005145] text-white text-xs font-bold shadow-sm hover:bg-[#0f6b5c] transition"
            title="Dhamme AI Helper"
          >
            <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            <span className="hidden sm:inline">AI Helper</span>
          </button>

          {/* Notifications button */}
          <button 
            onClick={() => alert('Biilasha iyo fariimaha wax cusub ma jiraan.')}
            className="w-10 h-10 rounded-full bg-[#eae7e7] flex items-center justify-center hover:bg-[#e5e2e1] transition-colors"
          >
            <span className="material-symbols-outlined text-[#3f4946]">notifications</span>
          </button>

          {/* Profile Avatar */}
          <div 
            onClick={() => onNavigate('profile')}
            className="w-10 h-10 rounded-full border-2 border-[#a2f2de] bg-[#ebe1d5] overflow-hidden active:scale-95 duration-100 cursor-pointer shadow-sm"
          >
            <img 
              className="w-full h-full object-cover" 
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80" 
              alt="User Profile" 
            />
          </div>

        </div>

      </div>
    </header>
  );
};
