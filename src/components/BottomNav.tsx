import React from 'react';
import type { ScreenName } from '../types';

interface BottomNavProps {
  currentScreen: ScreenName;
  onNavigate: (screen: ScreenName) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const navItems: { id: ScreenName; labelSo: string; icon: string; isPost?: boolean }[] = [
    { id: 'home', labelSo: 'Guri', icon: 'home' },
    { id: 'favorites', labelSo: 'Dooro', icon: 'favorite' },
    { id: 'post_step1', labelSo: 'Soo Dhig', icon: 'add', isPost: true },
    { id: 'my_listings', labelSo: 'Guryahayga', icon: 'domain' },
    { id: 'profile', labelSo: 'Koontada', icon: 'person' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#fcf9f8]/95 backdrop-blur-lg border-t border-[#bec9c5]/40 nav-shadow">
      <div className="flex items-center justify-around h-16 max-w-screen-md mx-auto px-2">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id || (item.isPost && currentScreen.startsWith('post_step'));
          
          if (item.isPost) {
            return (
              <button
                key={item.id}
                onClick={() => onNavigate('post_step1')}
                className="flex flex-col items-center justify-center -mt-6 group"
              >
                <div className="w-14 h-14 rounded-full bg-[#005145] text-white flex items-center justify-center shadow-lg shadow-[#005145]/30 group-active:scale-95 transition-transform">
                  <span className="material-symbols-outlined text-[30px]">add</span>
                </div>
                <span className="text-[10px] font-bold text-[#005145] mt-1">{item.labelSo}</span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center w-16 py-1 transition-all ${
                isActive ? 'text-[#005145] font-bold' : 'text-[#6f7976] hover:text-[#1b1b1c]'
              }`}
            >
              <span className={`material-symbols-outlined text-[24px] ${isActive ? 'fill-1' : ''}`}>
                {item.icon}
              </span>
              <span className="text-[11px] mt-0.5">{item.labelSo}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
