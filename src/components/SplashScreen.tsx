import React from 'react';
import { DhammeLogo } from './DhammeLogo';

interface SplashScreenProps {
  onStart: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onStart }) => {
  return (
    <div 
      onClick={onStart}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 sm:p-10 text-white cursor-pointer select-none overflow-hidden animate-fade-in group bg-[#111315]"
    >
      {/* Background Image 1: Jigjiga Aerial Avenue View (Default) */}
      <div className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out group-hover:scale-105" style={{ backgroundImage: "url('/jigjiga-aerial.jpg')" }} />

      {/* Dark Charcoal Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#111315]/95 via-[#111315]/80 to-[#111315]/95 backdrop-blur-[2px] transition-colors duration-500" />

      {/* Top Location Pill Badge */}
      <div className="pt-6 z-10">
        <span className="inline-flex items-center space-x-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-[#C8A96B] tracking-widest uppercase shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#C8A96B] animate-ping" />
          <span>JIGJIGA CITY • REAL ESTATE MARKETPLACE</span>
        </span>
      </div>

      {/* Prominent Center Hero Logo & Tagline */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-8 z-10 my-auto text-center px-4">
        
        {/* Animated Brand Logo Emblem */}
        <div className="transform group-hover:scale-105 transition-transform duration-500 bg-white/95 p-6 rounded-3xl backdrop-blur-xl border border-[#E8E5DF] shadow-xl">
          <DhammeLogo 
            variant="xl"
            animated={true}
            showSubtitle={true}
          />
        </div>

        <div className="space-y-3 max-w-md">
          <h2 className="font-serif text-2xl sm:text-3xl text-white tracking-tight leading-snug">
            DHamme ayaa kuu dhamaystiraya
          </h2>
          <p className="text-xs sm:text-sm text-[#FAF9F6]/80 leading-relaxed font-sans max-w-sm mx-auto font-normal">
            Hel guryaha Kiro (Rent) iyo Iibka (Sale) ee ugu haboon ee dhamaan Kebelada magaalada Jigjiga.
          </p>
        </div>

      </div>

      {/* Bottom CTA Button */}
      <div className="w-full max-w-xs sm:max-w-sm text-center space-y-3 pb-8 z-10">
        <button 
          onClick={onStart}
          className="w-full py-4 rounded-xl bg-[#C8A96B] hover:brightness-105 text-[#111315] font-sans font-bold text-sm uppercase tracking-wider shadow-xs hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-2"
        >
          <span>Biloow (Get Started)</span>
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>
        
        <span className="text-xs text-[#FAF9F6]/70 block font-normal">
          Taabo si aad u bilowdo (Tap anywhere to start)
        </span>
      </div>
    </div>
  );
};
