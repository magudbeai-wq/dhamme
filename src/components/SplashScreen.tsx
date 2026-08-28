import React from 'react';
import { motion } from 'motion/react';
import { DhammeLogo } from './DhammeLogo';

interface SplashScreenProps {
  onStart: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onStart }) => {
  return (
    <div 
      onClick={onStart}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 sm:p-10 text-white cursor-pointer select-none overflow-hidden group bg-[#111315]"
    >
      {/* Background Image: Jigjiga Aerial Avenue View */}
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="absolute inset-0 bg-cover bg-center" 
        style={{ backgroundImage: "url('/jigjiga-aerial.jpg')" }} 
      />

      {/* Dark Charcoal Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#111315]/95 via-[#111315]/80 to-[#111315]/95 backdrop-blur-[2px]" />

      {/* Ambient Gold Glow */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-96 h-96 rounded-full bg-[#C8A96B]/20 blur-3xl pointer-events-none"
      />

      {/* Top Location Pill Badge */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="pt-6 z-10"
      >
        <span className="inline-flex items-center space-x-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-[#C8A96B] tracking-widest uppercase shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#C8A96B] animate-ping" />
          <span>JIGJIGA CITY • REAL ESTATE MARKETPLACE</span>
        </span>
      </motion.div>

      {/* Prominent Center Hero Logo & Tagline */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-8 z-10 my-auto text-center px-4">
        
        {/* Animated Brand Logo Emblem */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, type: 'spring', stiffness: 300, damping: 25 }}
          className="bg-white/95 p-6 rounded-3xl backdrop-blur-xl border border-[#E8E5DF] shadow-2xl"
        >
          <DhammeLogo 
            variant="xl"
            animated={true}
            showSubtitle={true}
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-3 max-w-md"
        >
          <h2 className="font-serif text-2xl sm:text-3xl text-white tracking-tight leading-snug">
            DHamme ayaa kuu dhamaystiraya
          </h2>
          <p className="text-xs sm:text-sm text-[#FAF9F6]/80 leading-relaxed font-sans max-w-sm mx-auto font-normal">
            Hel guryaha Kiro (Rent) iyo Iibka (Sale) ee ugu haboon ee dhamaan Kebelada magaalada Jigjiga.
          </p>
        </motion.div>

      </div>

      {/* Bottom CTA Button */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="w-full max-w-xs sm:max-w-sm text-center space-y-3 pb-8 z-10"
      >
        <motion.button 
          whileHover={{ scale: 1.03, boxShadow: '0 10px 25px -5px rgba(200, 169, 107, 0.4)' }}
          whileTap={{ scale: 0.96 }}
          onClick={onStart}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#C8A96B] to-[#D4B97F] text-[#111315] font-sans font-bold text-sm uppercase tracking-wider shadow-md flex items-center justify-center space-x-2 cursor-pointer"
        >
          <span>Biloow (Get Started)</span>
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </motion.button>
        
        <span className="text-xs text-[#FAF9F6]/70 block font-normal">
          Taabo si aad u bilowdo (Tap anywhere to start)
        </span>
      </motion.div>
    </div>
  );
};
