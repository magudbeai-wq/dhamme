import React from 'react';
import { motion } from 'motion/react';
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
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#E8E5DF] shadow-[0_-4px_20px_rgba(0,0,0,0.04)] pb-safe">
      <div className="flex items-center justify-around h-16 max-w-screen-md mx-auto px-2">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id || (item.isPost && currentScreen.startsWith('post_step'));

          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => onNavigate(item.id)}
              className="relative flex flex-col items-center justify-center w-16 py-1 cursor-pointer transition-colors"
            >
              {/* Floating Active Pill Indicator */}
              {isActive && (
                <motion.div
                  layoutId="bottomNavActivePill"
                  className="absolute inset-0 bg-[#FAF9F6] rounded-2xl border border-[#E8E5DF]/60 shadow-2xs -z-10"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}

              <motion.div
                animate={{
                  scale: isActive ? 1.15 : 1,
                  y: isActive ? -1 : 0
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="p-0.5"
              >
                <span 
                  className={`material-symbols-outlined text-[24px] block transition-colors ${
                    isActive ? 'fill-1 text-[#111315]' : 'text-[#74777B]'
                  }`}
                >
                  {item.icon}
                </span>
              </motion.div>

              <span 
                className={`text-[10px] tracking-tight mt-0.5 font-medium transition-colors ${
                  isActive ? 'text-[#111315] font-bold' : 'text-[#74777B]'
                }`}
              >
                {item.label}
              </span>

              {/* Active Gold Dot Indicator */}
              {isActive && (
                <motion.span
                  layoutId="bottomNavGoldDot"
                  className="w-1 h-1 rounded-full bg-[#C8A96B] absolute bottom-1 shadow-xs"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};
