import { ObjectType } from '../types';

// Redesigned SVGs with the "Aero Glass" theme in mind.
// Trash objects are glossy and artificial. Organisms are more natural and soft.

export const SVG_STRINGS: Record<ObjectType, string> = {
    [ObjectType.Bottle]: `
<svg viewBox="0 0 35 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bottleGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#4ade80" stop-opacity="0.6"/>
      <stop offset="50%" stop-color="#86efac" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#4ade80" stop-opacity="0.6"/>
    </linearGradient>
  </defs>
  <g>
    <path d="M5,80 L5,25 C5,18 10,15 12,15 L23,15 C25,15 30,18 30,25 L30,80 Z" fill="url(#bottleGrad)" stroke="#166534" stroke-width="1.5"/>
    <path d="M12,15 C10,5 25,5 23,15 Z" fill="url(#bottleGrad)" stroke="#166534" stroke-width="1.5"/>
    <rect x="12" y="2" width="11" height="5" rx="1" fill="#14532d" stroke="#052e16" stroke-width="1"/>
    <path d="M26 70 C 22 50, 28 30, 27 18" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="2.5" stroke-linecap="round"/>
  </g>
</svg>`,
    [ObjectType.Can]: `
<svg viewBox="0 0 40 55" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="canGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#e0e0e0"/>
      <stop offset="50%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#d1d5db"/>
    </linearGradient>
  </defs>
  <g>
    <path d="M2,7.5 C2,3 38,3 38,7.5 L38,47.5 C38,52 2,52 2,47.5 L2,7.5 Z" fill="url(#canGrad)" stroke="#9ca3af" stroke-width="1"/>
    <path d="M2,18 L38,18 L38,38 L2,38 Z" fill="#ef4444" opacity="0.9"/>
    <path d="M10,24 L30,24 M10,32 L30,32" stroke="white" stroke-width="3" stroke-linecap="round"/>
    <path d="M2,7.5 C2,3 38,3 38,7.5" fill="#d1d5db" stroke="#9ca3af" stroke-width="1"/>
    <path d="M2,47.5 C2,52 38,52 38,47.5" fill="#d1d5db" stroke="#9ca3af" stroke-width="1"/>
    <path d="M8 12 C 12 12, 28 12, 32 12" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="3" stroke-linecap="round"/>
  </g>
</svg>`,
    [ObjectType.Bag]: `
<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bagGrad" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stop-color="rgba(241, 245, 249, 0.6)"/>
        <stop offset="100%" stop-color="rgba(203, 213, 225, 0.8)"/>
    </linearGradient>
  </defs>
  <g>
    <path d="M5 18 C 10 15, 50 15, 55 18 L 50 55 C 50 58, 10 58, 10 55 L 5 18 Z" fill="url(#bagGrad)" stroke="#94a3b8" stroke-width="1"/>
    <path d="M18 20 C 18 5, 25 5, 25 20 M35 20 C 35 5, 42 5, 42 20" stroke="#cbd5e1" stroke-width="4" fill="none"/>
    <path d="M15 25 C 25 35, 20 45, 25 50" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="2" stroke-linecap="round"/>
  </g>
</svg>`,
    [ObjectType.OilSpill]: `
<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="oilGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#a855f7" />
      <stop offset="50%" stop-color="#3b82f6" />
      <stop offset="75%" stop-color="#f43f5e" />
      <stop offset="100%" stop-color="#eab308" />
    </radialGradient>
    <filter id="oilWarp">
      <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="warp" />
      <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="10" in="SourceGraphic" in2="warp" />
    </filter>
  </defs>
  <ellipse cx="40" cy="40" rx="38" ry="30" fill="url(#oilGrad)" opacity="0.7" filter="url(#oilWarp)"/>
  <ellipse cx="40" cy="40" rx="38" ry="30" fill="#1e293b" opacity="0.4" filter="url(#oilWarp)"/>
</svg>`,
    [ObjectType.Barrel]: `
<svg viewBox="0 0 50 70" xmlns="http://www.w3.org/2000/svg">
 <defs>
    <linearGradient id="barrelGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ca8a04"/>
      <stop offset="50%" stop-color="#fde047"/>
      <stop offset="100%" stop-color="#ca8a04"/>
    </linearGradient>
  </defs>
  <g>
    <path d="M2,10 C2,0 48,0 48,10 L48,60 C48,70 2,70 2,60 L2,10 Z" fill="url(#barrelGrad)" stroke="#a16207" stroke-width="1.5"/>
    <rect x="0" y="15" width="50" height="8" rx="2" fill="#78716c" stroke="#44403c" stroke-width="1"/>
    <rect x="0" y="47" width="50" height="8" rx="2" fill="#78716c" stroke="#44403c" stroke-width="1"/>
    <path d="M15 25 L35 25 M15 35 L35 35 M15 45 L35 45" stroke="#000" stroke-width="2" opacity="0.3" stroke-linecap="round"/>
  </g>
</svg>`,
    [ObjectType.Microplastic]: `
<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <filter id="cloudBlur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
        </filter>
        <radialGradient id="cloudGrad" cx="0.5" cy="0.5" r="0.7">
            <stop offset="0%" stop-color="rgba(207, 250, 254, 0.3)" />
            <stop offset="100%" stop-color="rgba(165, 243, 252, 0.1)" />
        </radialGradient>
    </defs>
    <path d="M50.6,21.5c-1-6.9-7.1-12.2-14.3-12.2c-5.1,0-9.6,2.7-12.2,6.7c-1.3-1.1-3-1.8-4.8-1.8c-4.1,0-7.4,3.3-7.4,7.4c0,0.5,0.1,1,0.2,1.5C6.3,25.4,3,29.9,3,35.4c0,6.2,5.1,11.3,11.3,11.3h28.1c5.2,0,9.4-4.2,9.4-9.4C51.8,24.8,51.4,23.1,50.6,21.5z" fill="url(#cloudGrad)" stroke="#0e7490" stroke-width="1.5" filter="url(#cloudBlur)"/>
    <g stroke="#fff" stroke-width="0.5" stroke-linejoin="round" stroke-linecap="round">
        <path d="M25 25 l 3 -2 l -1 4 z" fill="#f43f5e"/>
        <path d="M35 30 l 4 1 l -2 3 z" fill="#3b82f6"/>
        <path d="M42 22 l 2 3 l -4 1 z" fill="#10b981"/>
        <path d="M28 40 l -3 2 l 2 -4 z" fill="#eab308"/>
        <path d="M20 33 l 2 -3 l 3 2 z" fill="#a855f7"/>
        <path d="M33 21 l -2 4 l 4 -1 z" fill="#f43f5e"/>
        <path d="M45 35 l 3 -1 l -3 3 z" fill="#3b82f6"/>
    </g>
</svg>`,
    [ObjectType.Fish]: `
<svg viewBox="0 0 70 40" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="fishGrad" x1="0" y1="0.5" x2="1" y2="0.5">
      <stop offset="0%" stop-color="#f97316"/>
      <stop offset="100%" stop-color="#fb923c"/>
    </linearGradient>
    <radialGradient id="fishShine">
      <stop offset="0%" stop-color="rgba(255,255,255,0.7)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
    </radialGradient>
  </defs>
  <g>
    <path d="M5,20 C10,5 50,5 60,15 L 68,12 C 65,20 65,20 68,28 L 60,25 C 50,35 10,35 5,20 Z" fill="url(#fishGrad)" stroke="#9a3412" stroke-width="1.5"/>
    <path d="M28,6 C 32,1 40,1 44,6 Z" fill="#fb923c" stroke="#9a3412" stroke-width="1.5"/>
    <ellipse cx="25" cy="20" rx="15" ry="8" fill="url(#fishShine)" opacity="0.8" transform="rotate(-10 25 20)"/>
    <circle cx="15" cy="18" r="3.5" fill="black"/>
    <circle cx="14" cy="17" r="1.5" fill="white"/>
  </g>
</svg>`,
    [ObjectType.Spawn]: `
<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="gelGrad" cx="0.4" cy="0.4" r="0.6">
      <stop offset="0%" stop-color="rgba(255,255,255,0.8)" />
      <stop offset="100%" stop-color="rgba(255,255,255,0)" />
    </radialGradient>
    <filter id="gelFilter">
        <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
    </filter>
  </defs>
  <g filter="url(#gelFilter)" opacity="0.9">
    <circle cx="20" cy="20" r="18" fill="rgba(110, 231, 183, 0.4)" />
    <circle cx="15" cy="15" r="5" fill="rgba(16, 185, 129, 0.5)" />
    <circle cx="28" cy="18" r="4" fill="rgba(16, 185, 129, 0.5)" />
    <circle cx="22" cy="28" r="6" fill="rgba(16, 185, 129, 0.5)" />
    <circle cx="15" cy="15" r="4" fill="url(#gelGrad)" />
    <circle cx="28" cy="18" r="3" fill="url(#gelGrad)" />
    <circle cx="22" cy="28" r="5" fill="url(#gelGrad)" />
  </g>
</svg>`,
    [ObjectType.Plant]: `
<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="plantGrad" x1="0.5" y1="0" x2="0.5" y2="1">
      <stop offset="0%" stop-color="#34d399"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
  </defs>
  <g stroke-linejoin="round" stroke-linecap="round">
    <path d="M15 48 C 20 42, 30 42, 35 48 C 30 52, 20 52, 15 48 Z" fill="#047857" stroke="#064e3b" stroke-width="1"/>
    <g fill="url(#plantGrad)" stroke="#047857" stroke-width="1.2">
      <path d="M25 45 Q 25 20 25 5 M 25 40 L 30 35 M 25 33 L 20 28 M 25 26 L 30 21 M 25 19 L 20 14 M 25 12 L 30 7" />
      <path d="M22 46 Q 10 35 12 10 M 20 40 L 15 38 M 17 33 L 12 30 M 15 26 L 10 22 M 13 19 L 8 15" />
      <path d="M28 46 Q 40 35 38 10 M 30 40 L 35 38 M 33 33 L 38 30 M 35 26 L 40 22 M 37 19 L 42 15" />
    </g>
    <g stroke="#10b981" stroke-width="1.5">
      <path d="M18 45 L 14 38" />
      <path d="M32 45 L 36 38" />
    </g>
  </g>
</svg>`,
    [ObjectType.Frog]: `
<svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="frogBodyGrad" cx="0.5" cy="0.5" r="0.7">
      <stop offset="0%" stop-color="#a3e635"/>
      <stop offset="100%" stop-color="#4d7c0f"/>
    </radialGradient>
  </defs>
  <g stroke-linejoin="round" stroke-linecap="round">
    <path d="M5 25 C 0 35, 10 42, 15 35 L 18 30" fill="#65a30d" stroke="#365314" stroke-width="1.5"/>
    <path d="M40 25 C 45 35, 35 42, 30 35 L 27 30" fill="#65a30d" stroke="#365314" stroke-width="1.5"/>
    <ellipse cx="22.5" cy="23" rx="15" ry="12" fill="url(#frogBodyGrad)" stroke="#365314" stroke-width="1.5"/>
    <path d="M15 18 C 10 15, 5 20, 8 25" fill="#84cc16" stroke="#365314" stroke-width="1.5"/>
    <path d="M30 18 C 35 15, 40 20, 37 25" fill="#84cc16" stroke="#365314" stroke-width="1.5"/>
    <circle cx="16" cy="15" r="6" fill="#fef08a" stroke="#a16207" stroke-width="1"/>
    <circle cx="29" cy="15" r="6" fill="#fef08a" stroke="#a16207" stroke-width="1"/>
    <circle cx="16" cy="15" r="3" fill="black"/>
    <circle cx="29" cy="15" r="3" fill="black"/>
    <circle cx="15" cy="14" r="1.5" fill="white"/>
    <circle cx="28" cy="14" r="1.5" fill="white"/>
    <path d="M15 25 Q 22.5 20, 30 25" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="2" stroke-linecap="round"/>
  </g>
</svg>`,
    [ObjectType.Leaf]: `
<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="leafGrad" x1="0.5" y1="0" x2="0.5" y2="1">
      <stop offset="0%" stop-color="#84cc16" />
      <stop offset="100%" stop-color="#a16207" />
    </linearGradient>
  </defs>
  <g>
    <path d="M20 2 C 5 15, 5 25, 20 38 C 35 25, 35 15, 20 2 Z" fill="url(#leafGrad)" stroke="#4d7c0f" stroke-width="1.5" />
    <path d="M20 2 V 38 M20 12 L 12 18 M20 22 L 12 28 M20 12 L 28 18 M20 22 L 28 28" stroke="rgba(255,255,255,0.4)" stroke-width="1" fill="none" />
  </g>
</svg>`,
    [ObjectType.Branch]: `
<svg viewBox="0 0 20 90" xmlns="http://www.w3.org/2000/svg">
  <path d="M10 0 C 15 30, 5 60, 12 90" stroke="#78350f" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M10 30 L0 25 M10 60 L20 55" stroke="#78350f" stroke-width="4" fill="none" stroke-linecap="round"/>
</svg>`,
};