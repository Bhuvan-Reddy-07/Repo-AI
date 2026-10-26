import React from 'react';

interface RepoAiLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'folder-arrow' | 'flight-path';
  showWordmark?: boolean;
  isMonochrome?: boolean;
  animatedSparkle?: boolean;
}

export const RepoAiLogo: React.FC<RepoAiLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'folder-arrow',
  showWordmark = true,
  isMonochrome = false,
  animatedSparkle = true,
}) => {
  // Dimensions map
  const sizeMap = {
    xs: { iconWidth: 24, iconHeight: 18, textClass: 'text-xs', gap: 'gap-1.5' },
    sm: { iconWidth: 32, iconHeight: 24, textClass: 'text-sm', gap: 'gap-2' },
    md: { iconWidth: 42, iconHeight: 32, textClass: 'text-lg', gap: 'gap-2.5' },
    lg: { iconWidth: 56, iconHeight: 42, textClass: 'text-2xl', gap: 'gap-3' },
    xl: { iconWidth: 72, iconHeight: 54, textClass: 'text-3xl', gap: 'gap-3.5' },
  };

  const { iconWidth, iconHeight, textClass, gap } = sizeMap[size];

  return (
    <div className={`inline-flex items-center ${gap} select-none ${className}`}>
      {/* SVG Icon */}
      <div className="relative shrink-0 flex items-center justify-center">
        {variant === 'folder-arrow' ? (
          <svg
            width={iconWidth}
            height={iconHeight}
            viewBox="0 0 160 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="overflow-visible"
            aria-label="RepoAI Folder & Arrow Logo"
          >
            <defs>
              {/* Back Folder Gradient */}
              <linearGradient id="repoAiFolderBackGrad" x1="12" y1="18" x2="115" y2="100" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor={isMonochrome ? '#FFFFFF' : '#0284C7'} />
                <stop offset="100%" stopColor={isMonochrome ? '#E2E8F0' : '#0369A1'} />
              </linearGradient>

              {/* Front Folder & Arrow Main Sky Gradient */}
              <linearGradient id="repoAiFrontBodyGrad" x1="16" y1="36" x2="152" y2="98" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor={isMonochrome ? '#FFFFFF' : '#38BDF8'} />
                <stop offset="45%" stopColor={isMonochrome ? '#FFFFFF' : '#0EA5E9'} />
                <stop offset="80%" stopColor={isMonochrome ? '#F8FAFC' : '#0284C7'} />
                <stop offset="100%" stopColor={isMonochrome ? '#F1F5F9' : '#0369A1'} />
              </linearGradient>

              {/* Arrow Head High-Gloss Gradient */}
              <linearGradient id="repoAiArrowHeadGrad" x1="105" y1="38" x2="152" y2="64" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor={isMonochrome ? '#FFFFFF' : '#38E1FF'} />
                <stop offset="70%" stopColor={isMonochrome ? '#FFFFFF' : '#00A3FF'} />
                <stop offset="100%" stopColor={isMonochrome ? '#E0F2FE' : '#38BDF8'} />
              </linearGradient>

              {/* Top Highlight Rim */}
              <linearGradient id="repoAiRimGrad" x1="16" y1="36" x2="90" y2="36" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity={isMonochrome ? '0.9' : '0.6'} />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.1" />
              </linearGradient>

              {/* Sparkle Radial Glow */}
              <radialGradient id="repoAiSparkleAura" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={isMonochrome ? '#FFFFFF' : '#E0F7FE'} stopOpacity="0.9" />
                <stop offset="40%" stopColor={isMonochrome ? '#FFFFFF' : '#38BDF8'} stopOpacity="0.6" />
                <stop offset="100%" stopColor={isMonochrome ? '#FFFFFF' : '#0284C7'} stopOpacity="0" />
              </radialGradient>

              {/* Drop Shadow for Arrow depth */}
              <filter id="repoAiArrowShadow" x="90" y="25" width="70" height="80" filterUnits="userSpaceOnUse">
                <feDropShadow dx="2" dy="4" stdDeviation="4" floodColor="#003566" floodOpacity="0.45" />
              </filter>
            </defs>

            {/* Folder Back Tab */}
            <path
              d="M 14 26 C 14 20 18 16 24 16 L 54 16 C 60 16 65 20 68 26 L 73 34 L 14 34 Z"
              fill="url(#repoAiFolderBackGrad)"
            />

            {/* Folder Back Body */}
            <rect
              x="14"
              y="28"
              width="92"
              height="68"
              rx="10"
              fill="url(#repoAiFolderBackGrad)"
              opacity="0.9"
            />

            {/* Folder Front Face + Seamless Arrow Body */}
            <path
              d="M 16 44 C 16 38 20 34 26 34 L 88 34 C 94 34 99 38 101 44 L 108 52 L 108 40 L 152 64 L 108 88 L 108 76 L 100 84 C 96 91 90 96 82 96 L 26 96 C 20 96 16 92 16 86 Z"
              fill="url(#repoAiFrontBodyGrad)"
              stroke={isMonochrome ? 'none' : 'rgba(255, 255, 255, 0.25)'}
              strokeWidth="1.5"
            />

            {/* Front Top Highlight Rim */}
            <path
              d="M 26 36 L 86 36"
              stroke="url(#repoAiRimGrad)"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Code Symbol: < / > Inside Folder */}
            <g
              stroke={isMonochrome ? '#0F172A' : '#FFFFFF'}
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* < bracket */}
              <path d="M 44 54 L 33 65 L 44 76" />
              {/* / slash */}
              <path d="M 52 77 L 62 53" />
              {/* > bracket */}
              <path d="M 70 54 L 81 65 L 70 76" />
            </g>

            {/* Arrow Head Accent & Facet Highlight */}
            <path
              d="M 108 42 L 150 64 L 108 86 Z"
              fill="url(#repoAiArrowHeadGrad)"
              filter="url(#repoAiArrowShadow)"
            />
            {/* Arrow Head Top Light Edge */}
            <path
              d="M 109 43 L 150 64"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeOpacity={isMonochrome ? '0.8' : '0.55'}
            />

            {/* Glowing 4-Point Sparkle Star on Top Right */}
            <g className={animatedSparkle ? 'animate-pulse' : ''} style={{ transformOrigin: '106px 20px' }}>
              {/* Radial Glow Aura */}
              <circle cx="106" cy="20" r="16" fill="url(#repoAiSparkleAura)" />

              {/* 4-point Diamond Star */}
              <path
                d="M 106 6 C 106 18 106 18 94 20 C 106 22 106 22 106 34 C 106 22 106 22 118 20 C 106 18 106 18 106 6 Z"
                fill="#FFFFFF"
              />
              {/* Core Star Highlight */}
              <circle cx="106" cy="20" r="2.5" fill="#FFFFFF" />
            </g>
          </svg>
        ) : (
          /* Flight & Navigation Path Concept */
          <svg
            width={iconWidth}
            height={iconHeight}
            viewBox="0 0 160 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="overflow-visible"
            aria-label="RepoAI Flight & Navigation Path Logo"
          >
            <defs>
              <linearGradient id="navSkyGrad" x1="20" y1="20" x2="140" y2="100" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#38E1FF" />
                <stop offset="50%" stopColor="#00A3FF" />
                <stop offset="100%" stopColor="#0066FF" />
              </linearGradient>
            </defs>

            {/* Curved Path 1 with Node */}
            <circle cx="28" cy="30" r="5" stroke="#38E1FF" strokeWidth="3" fill="none" />
            <path
              d="M 33 30 L 76 36 L 90 44"
              stroke="url(#navSkyGrad)"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Arrow on Path 1 */}
            <path d="M 80 32 L 94 42 L 84 48 Z" fill="#38E1FF" />

            {/* Flight Path 2 - Upward Arrow */}
            <path
              d="M 40 76 L 76 60 L 126 24"
              stroke="url(#navSkyGrad)"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path d="M 112 18 L 134 20 L 124 38 Z" fill="#38E1FF" />

            {/* Bottom S-Curve Flight Route */}
            <path
              d="M 30 90 C 45 90 45 70 60 70 C 75 70 75 90 90 90 C 105 90 115 80 120 70"
              stroke="url(#navSkyGrad)"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="120" cy="70" r="4" stroke="#38E1FF" strokeWidth="3" fill="none" />

            {/* Center Glowing Sparkle Confluence */}
            <circle cx="76" cy="60" r="14" fill="#38E1FF" opacity="0.3" className="animate-ping" />
            <path
              d="M 76 46 C 76 58 76 58 64 60 C 76 62 76 62 76 74 C 76 62 76 62 88 60 C 76 58 76 58 76 46 Z"
              fill="#FFFFFF"
            />
          </svg>
        )}
      </div>

      {/* Wordmark: "Repo" + "AI" */}
      {showWordmark && (
        <div className="flex items-baseline leading-none font-sans font-extrabold tracking-tight">
          <span
            className={`${textClass} ${
              isMonochrome
                ? 'text-white'
                : 'text-slate-900 dark:text-white transition-colors'
            }`}
          >
            Repo
          </span>
          <span
            className={`${textClass} ${
              isMonochrome
                ? 'text-white'
                : 'bg-gradient-to-r from-[#38E1FF] via-[#00A3FF] to-[#0066FF] bg-clip-text text-transparent font-black drop-shadow-sm'
            }`}
          >
            AI
          </span>
        </div>
      )}
    </div>
  );
};
