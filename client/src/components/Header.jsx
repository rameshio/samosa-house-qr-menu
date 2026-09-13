import React, { useState, useEffect, useRef } from 'react';

const Header = () => {
  const [imageError, setImageError] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    if (!headerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        document.documentElement.style.setProperty(
          '--mobile-header-height',
          `${entry.borderBoxSize?.[0]?.blockSize || entry.contentRect.height}px`
        );
      }
    });
    observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <header ref={headerRef} className="bg-white/85 backdrop-blur-md border-b border-white/50 shadow-[0_4px_30px_rgba(0,0,0,0.05)] supports-[not_(backdrop-filter:blur(1px))]:bg-white/95 py-4 px-6 sticky top-0 z-40 transition-colors duration-300">
      <div className="max-w-4xl mx-auto flex items-center justify-center">
        {!imageError ? (
          <img 
            src="/images/brand/samosa-house-logo.png" 
            alt="Samosa House" 
            onError={() => setImageError(true)}
            className="h-8 sm:h-12 w-auto object-contain max-w-full"
          />
        ) : (
          <h1 className="text-2xl font-extrabold text-brand-dark-red tracking-tight">
            Samosa House
          </h1>
        )}
      </div>
    </header>
  );
};

export default Header;