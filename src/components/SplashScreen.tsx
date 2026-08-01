import React from 'react';

interface SplashScreenProps {
  onStart: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onStart }) => {
  return (
    <div 
      onClick={onStart}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between p-8 bg-[#005145] text-white cursor-pointer select-none animate-fade-in"
    >
      <div className="flex-1 flex flex-col items-center justify-center space-y-6">
        <div className="w-24 h-24 rounded-3xl bg-[#0f6b5c] border-2 border-[#99e8d5]/40 flex items-center justify-center shadow-2xl shadow-black/30 transform hover:scale-105 transition">
          <span className="material-symbols-outlined text-[54px] text-[#99e8d5]">
            home_work
          </span>
        </div>

        <div className="text-center space-y-2">
          <h1 className="font-poppins text-4xl font-extrabold tracking-tight text-white">
            DHAMME
          </h1>
          <p className="text-sm font-medium text-[#99e8d5] uppercase tracking-widest">
            Somali Real Estate & Property Marketplace
          </p>
        </div>
      </div>

      <div className="w-full max-w-xs text-center space-y-3 pb-6">
        <button 
          onClick={onStart}
          className="w-full py-4 rounded-2xl bg-[#a2f2de] hover:bg-[#86d5c3] text-[#00201a] font-poppins font-bold text-base shadow-lg transition"
        >
          Biloow (Get Started)
        </button>
        <span className="text-xs text-[#99e8d5]/70 block">
          Taabo si aad u bilowdo
        </span>
      </div>
    </div>
  );
};
