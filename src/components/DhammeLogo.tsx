import React from 'react';

interface DhammeLogoProps {
  variant?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  showSubtitle?: boolean;
  lightMode?: boolean; // True if placed on dark background
  onClick?: () => void;
  className?: string;
}

export const DhammeLogo: React.FC<DhammeLogoProps> = ({
  variant = 'md',
  animated = true,
  showSubtitle = true,
  lightMode = false,
  onClick,
  className = ''
}) => {
  // Sizing configurations
  const sizeMap = {
    sm: { icon: 'w-8 h-8', title: 'text-xl', subtitle: 'text-[9px] px-1.5 py-0.5', gap: 'space-x-2' },
    md: { icon: 'w-12 h-12', title: 'text-2xl', subtitle: 'text-[10px] px-2 py-0.5', gap: 'space-x-3' },
    lg: { icon: 'w-20 h-20', title: 'text-4xl', subtitle: 'text-xs px-3 py-1', gap: 'space-x-4' },
    xl: { icon: 'w-28 h-28', title: 'text-5xl sm:text-6xl', subtitle: 'text-xs sm:text-sm px-3.5 py-1', gap: 'space-x-4 sm:space-x-5' }
  };

  const currentSize = sizeMap[variant];

  // Theme colors
  const titleColor = lightMode ? 'text-white drop-shadow-md' : 'text-[#005145]';
  const subtitleBg = lightMode 
    ? 'bg-gradient-to-r from-[#d4af37] via-[#f0cf65] to-[#d4af37] text-[#00382f] border-white/40 shadow-lg font-black' 
    : 'bg-[#005145] text-white border-[#005145] shadow-xs font-bold';

  return (
    <div 
      onClick={onClick}
      className={`inline-flex items-center ${currentSize.gap} ${onClick ? 'cursor-pointer select-none group' : ''} ${className}`}
    >
      {/* Animated SVG Icon Mark Emblem */}
      <div className={`relative ${currentSize.icon} shrink-0 flex items-center justify-center ${animated ? 'animate-logo-float' : ''}`}>
        
        {/* Expanding Ring Halo Pulse behind emblem */}
        {animated && (
          <div className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-[#d4af37]/40 to-[#00e6a5]/30 animate-ring-expand blur-md pointer-events-none" />
        )}
        
        {/* SVG Container with subtle 3D border, shadow, gradient */}
        <div className={`relative w-full h-full rounded-2xl bg-gradient-to-br from-[#00382f] via-[#005145] to-[#0f6b5c] p-2 shadow-2xl border-2 border-[#d4af37]/60 flex items-center justify-center overflow-hidden transition-all duration-300 ${
          animated ? 'group-hover:scale-105 group-hover:border-[#d4af37] group-hover:shadow-[#d4af37]/30' : ''
        }`}>
          
          {/* Glass shine overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent pointer-events-none" />

          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
            {/* Outer Luxury Arch */}
            <path 
              d="M15 55 L50 18 L85 55" 
              stroke="#D4AF37" 
              strokeWidth="7" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />

            {/* Inner Modern House Wall & "D" Curve */}
            <path 
              d="M26 52 V78 C26 81.5 28.5 84 32 84 H52 C65 84 74 76 74 65 C74 54 65 46 52 46 H26" 
              stroke="#A2F2DE" 
              strokeWidth="6" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />

            {/* Somali Star in Peak Roof */}
            <g className={animated ? "animate-star-twinkle" : ""}>
              <path 
                d="M50 24 L51.8 29.5 L57.5 29.5 L52.9 32.8 L54.7 38.3 L50 34.9 L45.3 38.3 L47.1 32.8 L42.5 29.5 L48.2 29.5 Z" 
                fill="#D4AF37" 
                stroke="#FFFFFF"
                strokeWidth="0.8"
              />
            </g>

            {/* Doorway Arch */}
            <path 
              d="M41 84 V68 C41 65.2 43.2 63 46 63 H54 C56.8 63 59 65.2 59 68 V84" 
              fill="#002b24" 
              stroke="#D4AF37" 
              strokeWidth="3.5" 
            />
          </svg>
        </div>
      </div>

      {/* Brand Name Typography */}
      <div className="flex flex-col justify-center text-left">
        <div className="flex items-center space-x-1">
          <h1 className={`font-poppins font-black ${currentSize.title} ${titleColor} tracking-tight leading-none ${
            animated && lightMode ? 'animate-gold-shimmer' : ''
          }`}>
            DHAMME
          </h1>
        </div>

        {showSubtitle && (
          <span className={`mt-1 inline-block font-poppins uppercase tracking-widest rounded-md border ${subtitleBg} self-start shadow-sm transition-all duration-300`}>
            REAL ESTATE • JIGJIGA
          </span>
        )}
      </div>
    </div>
  );
};
