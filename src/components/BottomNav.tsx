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
    { id: 'post_step1', label: t.postListing, icon: 'add_circle', isPost: true },
    { id: 'my_listings', label: t.myListings, icon: 'domain' },
    { id: 'profile', label: t.profile, icon: 'person' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E8E5DF] nav-shadow pb-safe">
      <div className="flex items-center justify-around h-16 max-w-screen-md mx-auto px-2">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id || (item.isPost && currentScreen.startsWith('post_step'));

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center w-16 py-1 transition-all active:scale-95 relative ${
                isActive ? 'text-[#111315] font-bold' : 'text-[#74777B] hover:text-[#111315]'
              }`}
            >
              <div className="p-0.5">
                <span className={`material-symbols-outlined text-[24px] block ${isActive ? 'fill-1 text-[#111315]' : 'text-[#74777B]'}`}>
                  {item.icon}
                </span>
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 font-medium">{item.label}</span>
              
              {/* Subtle Champagne Gold Active Indicator Dot */}
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#C8A96B] absolute bottom-1" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
