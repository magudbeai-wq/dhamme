import React from 'react';
import type { ScreenName } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface BottomNavProps {
  currentScreen: ScreenName;
  onNavigate: (screen: ScreenName) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const { t } = useLanguage();

  const navItems: { id: ScreenName; label: string; icon: string; isPost?: boolean }[] = [
    { id: 'home', label: t.home, icon: 'home' },
    { id: 'favorites', label: t.favorites, icon: 'favorite' },
    { id: 'post_step1', label: t.postListing, icon: 'add', isPost: true },
    { id: 'my_listings', label: t.myListings, icon: 'domain' },
    { id: 'profile', label: t.profile, icon: 'person' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#fcf9f8]/95 backdrop-blur-xl border-t border-[#bec9c5]/50 nav-shadow pb-safe">
      <div className="flex items-center justify-around h-16 max-w-screen-md mx-auto px-3">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id || (item.isPost && currentScreen.startsWith('post_step'));
          
          if (item.isPost) {
            return (
              <button
                key={item.id}
                onClick={() => onNavigate('post_step1')}
                className="flex flex-col items-center justify-center -mt-5 group"
                title="Post New Listing"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#00382f] via-[#005145] to-[#0f6b5c] text-white flex items-center justify-center shadow-xl shadow-[#005145]/40 border-2 border-[#a2f2de]/40 group-active:scale-95 transition-all">
                  <span className="material-symbols-outlined text-[32px]">add</span>
                </div>
                <span className="text-[10px] font-bold text-[#005145] mt-0.5 tracking-tight">{item.label}</span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center w-16 py-1 transition-all active:scale-95 ${
                isActive ? 'text-[#005145] font-bold scale-105' : 'text-[#6f7976] hover:text-[#1b1b1c]'
              }`}
            >
              <div className={`p-1 rounded-xl transition-colors ${isActive ? 'bg-[#005145]/10' : ''}`}>
                <span className={`material-symbols-outlined text-[24px] block ${isActive ? 'fill-1 text-[#005145]' : ''}`}>
                  {item.icon}
                </span>
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
