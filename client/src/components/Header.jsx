import React, { useState, useEffect, useRef } from 'react';
import { CategoryIcon } from './icons/CategoryIcon';
import PressableCategoryButton from './PressableCategoryButton';

const Header = ({ categories = [], activeCategoryId, onCategoryClick }) => {
  const [imageError, setImageError] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const headerRef = useRef(null);
  const drawerRef = useRef(null);
  const hamburgerRef = useRef(null);

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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        setIsDrawerOpen(false);
        hamburgerRef.current?.focus();
      }
    };
    if (isDrawerOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        const firstLink = drawerRef.current?.querySelector('button');
        if (firstLink) firstLink.focus();
      }, 50);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  const handleCategorySelect = (e, id) => {
    setIsDrawerOpen(false);
    if (onCategoryClick) {
      onCategoryClick(e, id);
    }
  };

  return (
    <>
      <header ref={headerRef} className="bg-white/85 backdrop-blur-md border-b border-gray-200 shadow-[0_4px_30px_rgba(0,0,0,0.02)] supports-[not_(backdrop-filter:blur(1px))]:bg-white/95 py-3 sm:py-4 px-6 sticky top-0 z-40 transition-colors duration-300">
        <div className="max-w-4xl mx-auto flex items-center justify-center relative">
          
          {categories.length > 0 && (
            <button 
              ref={hamburgerRef}
              onClick={() => setIsDrawerOpen(true)}
              className="absolute left-0 w-[44px] h-[44px] flex flex-col items-center justify-center gap-1.5 rounded-full text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-saffron transition-colors"
              aria-label="Open menu categories"
              aria-expanded={isDrawerOpen}
            >
              <span className="w-5 h-0.5 bg-current rounded-full"></span>
              <span className="w-5 h-0.5 bg-current rounded-full"></span>
              <span className="w-5 h-0.5 bg-current rounded-full"></span>
            </button>
          )}

          <button 
            onClick={(e) => {
              e.preventDefault();
              if (isDrawerOpen) setIsDrawerOpen(false);
              window.history.pushState(null, '', window.location.pathname + window.location.search);
              const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
              window.scrollTo({ top: 0, behavior: isReducedMotion ? 'auto' : 'smooth' });
            }}
            aria-label="Samosa House — Back to top."
            className="flex flex-col items-center focus:outline-none focus:ring-2 focus:ring-brand-saffron rounded-lg px-2 py-1 transition-opacity hover:opacity-80"
          >
            {!imageError ? (
              <img 
                src="/images/brand/samosa-house-logo.png" 
                alt="Samosa House" 
                onError={() => setImageError(true)}
                className="h-8 sm:h-12 w-auto object-contain max-w-full"
              />
            ) : (
              <span className="text-2xl font-extrabold text-brand-dark-red tracking-tight">
                Samosa House
              </span>
            )}
            <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.2em] text-gray-500 mt-1">EST. 1979 • CULVER CITY</span>
          </button>
        </div>
      </header>

      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 transition-opacity" 
          aria-hidden="true"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      <div 
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu Categories"
        className={`fixed inset-y-0 left-0 w-72 max-w-[80vw] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'} overflow-y-auto`}
        tabIndex="-1"
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold font-serif text-gray-900">Menu</h2>
          <button 
            onClick={() => setIsDrawerOpen(false)}
            className="w-[44px] h-[44px] flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-saffron"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <nav className="p-4 flex flex-col gap-1">
          {categories.map((category) => {
            const isActive = category.id === activeCategoryId;
            return (
              <PressableCategoryButton
                key={category.id}
                category={category}
                isActive={isActive}
                onClick={(e) => handleCategorySelect(e, category.id)}
                isDrawer={true}
              />
            );
          })}

          <div className="my-2 border-t border-gray-100"></div>

          <button
            onClick={() => {
              setIsDrawerOpen(false);
              setTimeout(() => {
                const navOffset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--mobile-header-height') || 64) + parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--category-nav-height') || 48) + 16;
                const el = document.getElementById('about');
                if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - navOffset, behavior: 'smooth' });
              }, 100);
            }}
            className="text-left px-4 py-2.5 rounded-xl font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-saffron"
          >
            About
          </button>
          
          <button
            onClick={() => {
              setIsDrawerOpen(false);
              setTimeout(() => {
                const navOffset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--mobile-header-height') || 64) + parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--category-nav-height') || 48) + 16;
                const el = document.getElementById('visit-us');
                if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - navOffset, behavior: 'smooth' });
              }, 100);
            }}
            className="text-left px-4 py-2.5 rounded-xl font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-saffron"
          >
            Visit Us
          </button>
          
          <button
            onClick={() => {
              setIsDrawerOpen(false);
              setTimeout(() => {
                const navOffset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--mobile-header-height') || 64) + parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--category-nav-height') || 48) + 16;
                const el = document.getElementById('catering');
                if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - navOffset, behavior: 'smooth' });
              }, 100);
            }}
            className="text-left px-4 py-2.5 rounded-xl font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-saffron"
          >
            Catering
          </button>
        </nav>
      </div>
    </>
  );
};

export default Header;