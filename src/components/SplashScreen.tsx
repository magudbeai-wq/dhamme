import React from 'react';
import { DhammeLogo } from './DhammeLogo';

interface SplashScreenProps {
  onStart: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onStart }) => {
  return (
    <div 
      onClick={onStart}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 sm:p-10 text-white cursor-pointer select-none overflow-hidden animate-fade-in group bg-slate-950"
    >
      {/* Background Image 1: Jigjiga Aerial Avenue View (Default) */}
      <div className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out group-hover:scale-105" style={{ backgroundImage: "url('/jigjiga-aerial.jpg')" }} />

      {/* Background Image 2: Jigjiga Landmark Statue (Hover Transition) */}
      <div className="absolute inset-0 bg-cover bg-center transition-opacity duration-700 opacity-0 group-hover:opacity-100 group-hover:scale-105" style={{ backgroundImage: "url('/jigjiga-landmark.jpg')" }} />

      {/* Luxury Crimson & Dark Slate Gradient Backdrops */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/95 via-rose-950/85 to-slate-950/95 backdrop-blur-[2px] transition-colors duration-500 group-hover:bg-slate-950/80" />

      {/* Ambient Glowing Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-rose-600/30 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-amber-400/20 blur-3xl pointer-events-none animate-pulse" />

      {/* Top Location Pill Badge */}
      <div className="pt-6 z-10">
        <span className="inline-flex items-center space-x-2 px-5 py-2 rounded-full bg-slate-900/80 backdrop-blur-md border border-rose-500/40 text-xs font-bold text-amber-400 tracking-widest uppercase shadow-xl">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          <span>JIGJIGA CITY • KEBELE 01 - KEBELE 10</span>
        </span>
      </div>

      {/* Prominent Center Hero Logo & Tagline */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-10 z-10 my-auto text-center px-4">
        
        {/* Animated Brand Logo Emblem */}
        <div className="transform group-hover:scale-105 transition-transform duration-500 bg-slate-900/80 p-4 sm:p-6 rounded-3xl backdrop-blur-xl border border-rose-500/60 shadow-2xl">
          <DhammeLogo 
            variant="xl"
            animated={true}
            lightMode={true}
            showSubtitle={true}
          />
        </div>

        <div className="space-y-3 max-w-md">
          <p className="text-base sm:text-lg font-black text-amber-400 uppercase tracking-widest leading-snug drop-shadow-md">
            Jigjiga Real Estate & Property Marketplace
          </p>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium max-w-sm mx-auto drop-shadow-sm">
            Hel guryaha Kiro (Rent) iyo Iibka (Sale) ee ugu haboon ee dhamaan Kebelada magaalada Jigjiga.
          </p>
        </div>

      </div>

      {/* Bottom CTA Button */}
      <div className="w-full max-w-xs sm:max-w-sm text-center space-y-3 pb-8 z-10">
        <button 
          onClick={onStart}
          className="w-full py-4 sm:py-4.5 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-600 to-rose-700 hover:shadow-rose-600/50 text-white font-poppins font-black text-base sm:text-lg uppercase tracking-wider shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-2 border border-rose-400/40"
        >
          <span>Biloow (Get Started)</span>
          <span className="material-symbols-outlined text-[26px]">arrow_forward</span>
        </button>
        
        <span className="text-xs text-slate-300 block font-semibold drop-shadow-xs">
          Taabo si aad u bilowdo (Tap anywhere to start)
        </span>
      </div>
    </div>
  );
};
