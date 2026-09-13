import React, { useRef, useEffect, useState } from 'react';

const MenuCardBorder = ({ children, className = '' }) => {
  const cardRef = useRef(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setShouldAnimate(hasHover && !reducedMotion);
    }
  }, []);

  useEffect(() => {
    if (!shouldAnimate) return;
    
    const card = cardRef.current;
    if (!card) return;

    let rafId;
    const handlePointerMove = (e) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    };

    card.addEventListener('pointermove', handlePointerMove);
    return () => {
      card.removeEventListener('pointermove', handlePointerMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [shouldAnimate]);

  if (!shouldAnimate) {
    return (
      <div className={`w-full h-full relative rounded-[inherit] border border-gray-100/50 ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      className={`relative group isolate w-full h-full rounded-[inherit] border border-gray-100/50 ${className}`}
    >
      {/* Faint inner highlight */}
      <div 
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100 -z-10"
        style={{
          background: 'radial-gradient(300px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(249, 115, 22, 0.05), transparent 40%)'
        }}
        aria-hidden="true"
      />
      
      {/* Border glow */}
      <div 
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-10"
        style={{
          background: 'radial-gradient(300px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(249, 115, 22, 0.6), transparent 40%)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          padding: '1px' // matches typical border thickness
        }}
        aria-hidden="true"
      />

      <div className="flex flex-col relative h-full w-full rounded-[inherit] z-[1]">
        {children}
      </div>
    </div>
  );
};

export default MenuCardBorder;
