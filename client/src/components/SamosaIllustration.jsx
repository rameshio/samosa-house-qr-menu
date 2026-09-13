import React from 'react';

const SamosaIllustration = () => {
  return (
    <div className="w-full h-full relative flex items-center justify-center" aria-hidden="true">
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <style>
          {`
            @media (prefers-reduced-motion: no-preference) {
              .samosa-entrance {
                animation: popIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                opacity: 0;
                transform-origin: center bottom;
              }
              .steam-1 {
                animation: rise 5s ease-out forwards;
                opacity: 0;
              }
              .steam-2 {
                animation: rise 5s ease-out 0.2s forwards;
                opacity: 0;
              }
              .steam-3 {
                animation: rise 5s ease-out 0.4s forwards;
                opacity: 0;
              }
            }
            @media (prefers-reduced-motion: reduce) {
              .samosa-entrance { opacity: 1; transform: none; }
              .steam-1, .steam-2, .steam-3 { opacity: 0; transform: none; animation: none; }
            }
            @keyframes popIn {
              0% { opacity: 0; transform: scale(0.8) translateY(20px); }
              100% { opacity: 1; transform: scale(1) translateY(0); }
            }
            @keyframes rise {
              0% { opacity: 0; transform: translateY(0) scale(0.9); }
              20% { opacity: 0.8; transform: translateY(-15px) scale(1); }
              80% { opacity: 0.6; transform: translateY(-30px) scale(1.1); }
              100% { opacity: 0; transform: translateY(-40px) scale(1.2); }
            }
          `}
        </style>
        
        {/* Steam */}
        <path className="steam-1" d="M85 80 Q95 60 85 40 Q75 20 85 0" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path className="steam-2" d="M100 70 Q110 50 100 30 Q90 10 100 -10" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path className="steam-3" d="M115 80 Q125 60 115 40 Q105 20 115 0" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" fill="none" />

        {/* Plate */}
        <g className="samosa-entrance">
          <ellipse cx="100" cy="160" rx="70" ry="20" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="4" />
          <path d="M40 160 Q100 180 160 160" stroke="#cbd5e1" strokeWidth="3" fill="none" />
          
          {/* Samosa */}
          <path d="M60 150 L100 75 L140 150 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="6" strokeLinejoin="round" />
          {/* Fold details */}
          <path d="M100 75 Q110 115 140 150" stroke="#D97706" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M60 150 Q100 140 140 150" stroke="#D97706" strokeWidth="4" fill="none" strokeLinecap="round" />
          <circle cx="100" cy="125" r="3" fill="#D97706" opacity="0.5" />
          <circle cx="115" cy="135" r="2" fill="#D97706" opacity="0.5" />
          <circle cx="85" cy="140" r="2.5" fill="#D97706" opacity="0.5" />
        </g>
      </svg>
    </div>
  );
};

export default SamosaIllustration;
