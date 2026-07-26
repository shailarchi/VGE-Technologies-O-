import React from 'react';

interface VerdeGridLogoProps {
  variant?: 'full' | 'compact' | 'icon-only' | 'stacked';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  darkBg?: boolean;
  className?: string;
  showTagline?: boolean;
}

export const VerdeGridLogo: React.FC<VerdeGridLogoProps> = ({
  variant = 'full',
  size = 'md',
  darkBg = true,
  className = '',
  showTagline = true,
}) => {
  // Size mapping
  const iconSizeMap = {
    sm: 'w-7 h-9',
    md: 'w-9 h-11',
    lg: 'w-12 h-14',
    xl: 'w-16 h-20',
  };

  const titleSizeMap = {
    sm: 'text-sm sm:text-base',
    md: 'text-base sm:text-lg lg:text-xl',
    lg: 'text-xl sm:text-2xl',
    xl: 'text-2xl sm:text-3xl',
  };

  const taglineSizeMap = {
    sm: 'text-[8px] sm:text-[9px]',
    md: 'text-[9px] sm:text-[10px] lg:text-[11px]',
    lg: 'text-[10px] sm:text-[11px]',
    xl: 'text-[11px] sm:text-[12px]',
  };

  // Color selection based on dark or light background
  const verdeTextColor = darkBg ? 'text-white' : 'text-[#0B2265]';
  const energyTextColor = 'text-[#00B050]'; // Official Verde Energy Green
  const assetsTextColor = darkBg ? 'text-slate-100' : 'text-[#0B2265]';
  const yieldTextColor = darkBg ? 'text-slate-100' : 'text-[#0B2265]';

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3.5 select-none ${className}`}>
      {/* VERDE GRID ENERGY Iconic G-Location Pin Emblem */}
      <div className={`relative flex-shrink-0 ${iconSizeMap[size]}`}>
        <svg
          viewBox="0 0 120 150"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md"
        >
          <defs>
            {/* Emerald Green Arc Gradient */}
            <linearGradient id="vgeGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00C853" />
              <stop offset="100%" stopColor="#008E3C" />
            </linearGradient>

            {/* Royal Navy Blue Bottom Pin Gradient */}
            <linearGradient id="vgeNavyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0B2766" />
              <stop offset="100%" stopColor="#041235" />
            </linearGradient>

            {/* Gold Star Glow Filter */}
            <filter id="starGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="0.6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Top Emerald Green Arc Segment forming 'G' upper curve */}
          <path
            d="M 60 10 
               C 28 10, 10 28, 10 60 
               C 10 74, 16 86, 26 96 
               L 42 80 
               C 34 72, 30 64, 30 54 
               C 30 38, 42 26, 60 26 
               C 78 26, 90 38, 90 54 
               C 90 60, 88 66, 84 70 
               L 102 84 
               C 108 75, 110 65, 110 54 
               C 110 28, 92 10, 60 10 Z"
            fill="url(#vgeGreenGrad)"
          />

          {/* Bottom Navy Blue Location Marker Base */}
          <path
            d="M 26 96 
               L 60 142 
               L 94 96 
               L 76 80 
               L 60 102 
               L 44 80 Z"
            fill="url(#vgeNavyGrad)"
          />

          {/* Horizontal Bar of 'G' in Navy */}
          <path
            d="M 52 52 H 98 V 66 H 52 Z"
            fill="url(#vgeNavyGrad)"
          />

          {/* Golden Stars European / Global Quality Circle */}
          {[
            { cx: 60, cy: 33 },
            { cx: 70, cy: 36 },
            { cx: 77, cy: 43 },
            { cx: 79, cy: 53 },
            { cx: 75, cy: 62 },
            { cx: 67, cy: 67 },
            { cx: 53, cy: 67 },
            { cx: 45, cy: 62 },
            { cx: 41, cy: 53 },
            { cx: 43, cy: 43 },
            { cx: 50, cy: 36 },
          ].map((star, idx) => (
            <path
              key={idx}
              d={`M ${star.cx} ${star.cy - 3.2}
                 L ${star.cx + 0.9} ${star.cy - 0.9}
                 L ${star.cx + 3.2} ${star.cy - 0.9}
                 L ${star.cx + 1.4} ${star.cy + 0.5}
                 L ${star.cx + 2.1} ${star.cy + 2.8}
                 L ${star.cx} ${star.cy + 1.4}
                 L ${star.cx - 2.1} ${star.cy + 2.8}
                 L ${star.cx - 1.4} ${star.cy + 0.5}
                 L ${star.cx - 3.2} ${star.cy - 0.9}
                 L ${star.cx - 0.9} ${star.cy - 0.9} Z`}
              fill="#F59E0B"
              filter="url(#starGlow)"
            />
          ))}
        </svg>
      </div>

      {/* Typography: VERDE GRID ENERGY */}
      {variant !== 'icon-only' && (
        <div className="flex flex-col justify-center">
          <div className={`flex items-center gap-1.5 font-heading tracking-tight leading-none font-black ${titleSizeMap[size]}`}>
            <span className={`uppercase ${verdeTextColor}`}>
              VERDE GRID
            </span>
            <span className={`uppercase ${energyTextColor}`}>
              ENERGY
            </span>
          </div>

          {/* Official Tagline: REAL ASSETS . REAL IMPACT . REAL YIELD */}
          {showTagline && (
            <div className={`flex items-center gap-1 mt-1 font-mono font-extrabold tracking-wider uppercase ${taglineSizeMap[size]}`}>
              <span className="h-[2px] w-3 sm:w-4 bg-[#00B050] rounded-full inline-block shrink-0"></span>
              <span className="whitespace-nowrap flex items-center gap-1">
                <span className={assetsTextColor}>REAL ASSETS</span>
                <span className="text-[#00B050] font-black">.</span>
                <span className="text-[#00B050]">REAL IMPACT</span>
                <span className="text-[#00B050] font-black">.</span>
                <span className={yieldTextColor}>REAL YIELD</span>
              </span>
              <span className="h-[2px] w-3 sm:w-4 bg-[#0B2265] rounded-full inline-block shrink-0"></span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

