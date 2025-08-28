// SVG sprite definitions for Volt-Man game characters and elements
// Based on the provided pixel art style

export const VoltManSprites = {
  normal: `
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <!-- Volt-Man normal mode - inspired by the schnauzer character -->
      <circle cx="20" cy="20" r="18" fill="#2d4a87" stroke="#4a90e2" stroke-width="2"/>
      <circle cx="15" cy="15" r="3" fill="#ffffff"/>
      <circle cx="25" cy="15" r="3" fill="#ffffff"/>
      <circle cx="15" cy="15" r="1.5" fill="#000000"/>
      <circle cx="25" cy="15" r="1.5" fill="#000000"/>
      <ellipse cx="20" cy="22" rx="2" ry="1" fill="#000000"/>
      <path d="M 18 25 Q 20 27 22 25" stroke="#000000" stroke-width="2" fill="none"/>
      <!-- Lightning symbol on forehead -->
      <path d="M 20 8 L 17 12 L 19 12 L 16 16 L 19 12 L 21 12 Z" fill="#00ffff" stroke="#ffffff" stroke-width="0.5"/>
    </svg>
  `,

  powerUp: `
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <!-- Volt-Man power-up mode - glowing electric aura -->
      <defs>
        <radialGradient id="electricAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
          <stop offset="70%" style="stop-color:#00ffff;stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:#0066ff;stop-opacity:0.3" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <!-- Electric aura -->
      <circle cx="20" cy="20" r="22" fill="url(#electricAura)" filter="url(#glow)"/>
      
      <!-- Lightning sparks -->
      <path d="M 5 15 L 8 18 L 6 20 L 10 23" stroke="#ffff00" stroke-width="2" fill="none"/>
      <path d="M 35 25 L 32 22 L 34 20 L 30 17" stroke="#ffff00" stroke-width="2" fill="none"/>
      <path d="M 20 5 L 18 8 L 22 8 L 20 12" stroke="#ffff00" stroke-width="2" fill="none"/>
      
      <!-- Main body -->
      <circle cx="20" cy="20" r="16" fill="#ffffff" stroke="#00ffff" stroke-width="3"/>
      <circle cx="15" cy="15" r="3" fill="#00ffff"/>
      <circle cx="25" cy="15" r="3" fill="#00ffff"/>
      <circle cx="15" cy="15" r="1.5" fill="#000000"/>
      <circle cx="25" cy="15" r="1.5" fill="#000000"/>
      <ellipse cx="20" cy="22" rx="2" ry="1" fill="#000000"/>
      
      <!-- Enhanced lightning symbol -->
      <path d="M 20 6 L 16 11 L 18 11 L 14 16 L 18 11 L 22 11 Z" fill="#ffff00" stroke="#ffffff" stroke-width="1"/>
    </svg>
  `
};

export const MutantRabbitSprites = {
  red: `
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <!-- Red mutant rabbit -->
      <ellipse cx="15" cy="8" rx="3" ry="8" fill="#ff4444"/>
      <ellipse cx="25" cy="8" rx="3" ry="8" fill="#ff4444"/>
      <ellipse cx="20" cy="24" rx="12" ry="10" fill="#ff6666"/>
      <circle cx="16" cy="20" r="2" fill="#ff0000"/>
      <circle cx="24" cy="20" r="2" fill="#ff0000"/>
      <ellipse cx="20" cy="26" rx="1" ry="0.5" fill="#000000"/>
      <path d="M 18 28 Q 20 30 22 28" stroke="#000000" stroke-width="1" fill="none"/>
    </svg>
  `,

  pink: `
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <!-- Pink mutant rabbit -->
      <ellipse cx="15" cy="8" rx="3" ry="8" fill="#ff99cc"/>
      <ellipse cx="25" cy="8" rx="3" ry="8" fill="#ff99cc"/>
      <ellipse cx="20" cy="24" rx="12" ry="10" fill="#ffaadd"/>
      <circle cx="16" cy="20" r="2" fill="#ff0066"/>
      <circle cx="24" cy="20" r="2" fill="#ff0066"/>
      <ellipse cx="20" cy="26" rx="1" ry="0.5" fill="#000000"/>
      <path d="M 18 28 Q 20 30 22 28" stroke="#000000" stroke-width="1" fill="none"/>
    </svg>
  `,

  cyan: `
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <!-- Cyan mutant rabbit -->
      <ellipse cx="15" cy="8" rx="3" ry="8" fill="#44ffff"/>
      <ellipse cx="25" cy="8" rx="3" ry="8" fill="#44ffff"/>
      <ellipse cx="20" cy="24" rx="12" ry="10" fill="#66ffff"/>
      <circle cx="16" cy="20" r="2" fill="#00ccff"/>
      <circle cx="24" cy="20" r="2" fill="#00ccff"/>
      <ellipse cx="20" cy="26" rx="1" ry="0.5" fill="#000000"/>
      <path d="M 18 28 Q 20 30 22 28" stroke="#000000" stroke-width="1" fill="none"/>
    </svg>
  `,

  orange: `
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <!-- Orange mutant rabbit -->
      <ellipse cx="15" cy="8" rx="3" ry="8" fill="#ffaa44"/>
      <ellipse cx="25" cy="8" rx="3" ry="8" fill="#ffaa44"/>
      <ellipse cx="20" cy="24" rx="12" ry="10" fill="#ffcc66"/>
      <circle cx="16" cy="20" r="2" fill="#ff6600"/>
      <circle cx="24" cy="20" r="2" fill="#ff6600"/>
      <ellipse cx="20" cy="26" rx="1" ry="0.5" fill="#000000"/>
      <path d="M 18 28 Q 20 30 22 28" stroke="#000000" stroke-width="1" fill="none"/>
    </svg>
  `,

  frightened: `
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <!-- Frightened mutant rabbit (blue) -->
      <ellipse cx="15" cy="8" rx="3" ry="8" fill="#4444ff"/>
      <ellipse cx="25" cy="8" rx="3" ry="8" fill="#4444ff"/>
      <ellipse cx="20" cy="24" rx="12" ry="10" fill="#6666ff"/>
      <circle cx="16" cy="20" r="2" fill="#ffffff"/>
      <circle cx="24" cy="20" r="2" fill="#ffffff"/>
      <ellipse cx="20" cy="26" rx="1" ry="0.5" fill="#000000"/>
      <path d="M 18 30 Q 20 28 22 30" stroke="#000000" stroke-width="1" fill="none"/>
      <!-- Worried expression -->
      <path d="M 14 18 Q 16 16 18 18" stroke="#000000" stroke-width="1" fill="none"/>
      <path d="M 22 18 Q 24 16 26 18" stroke="#000000" stroke-width="1" fill="none"/>
    </svg>
  `
};

export const GameElements = {
  treat: `
    <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="3" fill="#ffffff" stroke="#cccccc" stroke-width="1"/>
    </svg>
  `,

  powerUpTreat: `
    <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="powerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style="stop-color:#ffff00;stop-opacity:1" />
          <stop offset="70%" style="stop-color:#ffaa00;stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:#ff6600;stop-opacity:0.3" />
        </radialGradient>
      </defs>
      <circle cx="15" cy="15" r="12" fill="url(#powerGlow)"/>
      <circle cx="15" cy="15" r="8" fill="#ffff00" stroke="#ffffff" stroke-width="2"/>
      <path d="M 15 8 L 12 12 L 14 12 L 10 16 L 14 12 L 16 12 Z" fill="#ff6600"/>
    </svg>
  `,

  wall: `
    <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="16" height="16" fill="none" stroke="#00ffff" stroke-width="2"/>
    </svg>
  `
};
