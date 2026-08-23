import React from 'react';

interface DhammeLogoProps {
  variant?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  showSubtitle?: boolean;
  lightMode?: boolean;
  onClick?: () => void;
  className?: string;
}

export const DhammeLogo: React.FC<DhammeLogoProps> = ({
  variant = 'md',
  animated = false,
  showSubtitle = true,
  lightMode = false,
  onClick,
  className = ''
}) => {
  const sizeMap = {
    sm: { icon: 'w-6 h-6', title: 'text-base', subtitle: 'text-[7px]', gap: 'space-x-2' },
    md: { icon: 'w-8 h-8 sm:w-9 sm:h-9', title: 'text-lg sm:text-xl', subtitle: 'text-[8px] sm:text-[9px]', gap: 'space-x-2.5' },
    lg: { icon: 'w-12 h-12', title: 'text-2xl sm:text-3xl', subtitle: 'text-[9px] sm:text-xs', gap: 'space-x-3' },
    xl: { icon: 'w-16 h-16 sm:w-20 sm:h-20', title: 'text-3xl sm:text-4xl', subtitle: 'text-[10px] sm:text-xs', gap: 'space-x-3 sm:space-x-4' }
  };

  const currentSize = sizeMap[variant];
  const titleColor = lightMode ? 'text-white' : 'text-[#111315]';
  const subtitleColor = lightMode ? 'text-[#C8A96B]' : 'text-[#74777B]';

  return (
    <div 
      onClick={onClick}
      className={`inline-flex items-center ${currentSize.gap} ${onClick ? 'cursor-pointer select-none group' : ''} ${className}`}
    >
      {/* Minimal Geometric Mark Emblem */}
      <div className={`relative ${currentSize.icon} shrink-0 flex items-center justify-center ${animated ? 'animate-pulse' : ''}`}>
        <div className={`w-full h-full rounded-xl ${lightMode ? 'bg-white/10 border border-white/20' : 'bg-[#111315]'} flex items-center justify-center p-1.5 transition-transform duration-300 ${onClick ? 'group-hover:scale-105' : ''}`}>
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Outer Minimal Diamond Frame */}
            <rect 
              x="50" 
              y="12" 
              width="53" 
              height="53" 
              rx="6" 
              transform="rotate(45 50 12)" 
              stroke="#C8A96B" 
              strokeWidth="7" 
            />
            {/* Inner Architectural Diamond */}
            <rect 
              x="50" 
              y="32" 
              width="25" 
              height="25" 
              rx="3" 
              transform="rotate(45 50 32)" 
              fill={lightMode ? '#C8A96B' : '#FFFFFF'} 
            />
          </svg>
        </div>
      </div>

      {/* Brand Name Typography */}
      <div className="flex flex-col justify-center text-left">
        <div className="flex items-center">
          <h1 className={`font-serif font-semibold ${currentSize.title} ${titleColor} tracking-tight leading-none`}>
            DHAMME
          </h1>
        </div>

        {showSubtitle && (
          <span className={`mt-0.5 block font-sans uppercase font-bold tracking-[0.18em] ${subtitleColor} ${currentSize.subtitle} leading-none`}>
            REAL ESTATE · MARKETPLACE
          </span>
        )}
      </div>
    </div>
  );
};
