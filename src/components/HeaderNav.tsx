import React from 'react';
import type { ScreenName, UserProfile } from '../types';
import { DhammeLogo } from './DhammeLogo';

interface HeaderNavProps {
  userProfile: UserProfile | null;
  onNavigate: (screen: ScreenName) => void;
  onOpenAI: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ userProfile, onNavigate, onOpenAI }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#F2E8DC]/95 backdrop-blur-xl shadow-md border-b border-[#bec9c5]/40 transition-all duration-300">
      <div className="flex items-center justify-between px-4 sm:px-6 h-16 w-full max-w-screen-xl mx-auto">
        
        {/* Animated Brand Logo */}
        <DhammeLogo 
          variant="sm"
          animated={true}
          showSubtitle={true}
          onClick={() => onNavigate('home')}
        />

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* AI Helper Trigger */}
          <button
            onClick={onOpenAI}
            className="flex items-center space-x-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-gradient-to-r from-[#005145] to-[#0f6b5c] text-white text-xs font-bold shadow-md hover:shadow-lg hover:brightness-110 active:scale-95 transition-all"
            title="Dhamme AI Helper"
          >
            <span className="material-symbols-outlined text-[18px] text-[#a2f2de] animate-pulse">auto_awesome</span>
            <span className="hidden sm:inline">AI Helper</span>
          </button>

          {/* Notifications button */}
          <button 
            onClick={() => alert('Biilasha iyo fariimaha wax cusub ma jiraan.')}
            className="w-10 h-10 rounded-full bg-[#f0eded] border border-[#bec9c5]/40 flex items-center justify-center hover:bg-[#e5e2e1] active:scale-95 transition-all relative"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-[#3f4946] text-[20px]">notifications</span>
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#7b2f10] ring-2 ring-white" />
          </button>

          {/* User Profile Avatar */}
          <div 
            onClick={() => onNavigate('profile')}
            className="w-10 h-10 rounded-full border-2 border-[#005145] bg-[#ebe1d5] flex items-center justify-center overflow-hidden active:scale-95 transition-all cursor-pointer shadow-sm hover:ring-2 hover:ring-[#005145]/30"
          >
            {userProfile?.avatarUrl ? (
              <img 
                className="w-full h-full object-cover" 
                src={userProfile.avatarUrl} 
                alt={userProfile.fullName} 
              />
            ) : (
              <span className="material-symbols-outlined text-[#005145] text-[24px]">
                person
              </span>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
