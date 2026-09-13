import React, { useState, useEffect, useRef } from 'react';

const CategoryNavigation = ({ categories, activeCategoryId, onCategoryClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  
  const sentinelRef = useRef(null);
  const menuRef = useRef(null);
  const btnRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const stickyBarRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Close menu on outside click or Escape
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isMenuOpen && menuRef.current && !menuRef.current.contains(e.target) && btnRef.current && !btnRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        if (btnRef.current) btnRef.current.focus();
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isMenuOpen]);

  // Measure Category Nav Height and export to CSS variable
  useEffect(() => {
    if (!stickyBarRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        document.documentElement.style.setProperty(
          '--category-nav-height',
          `${entry.borderBoxSize?.[0]?.blockSize || entry.contentRect.height}px`
        );
      }
    });
    observer.observe(stickyBarRef.current);
    return () => observer.disconnect();
  }, []);

  // Sentinel Observer to toggle sticky state
  useEffect(() => {
    if (!sentinelRef.current || typeof IntersectionObserver === 'undefined') return;
    
    // Read the current header height from CSS variable, default to 64px if not ready
    const getHeaderHeight = () => {
      const val = getComputedStyle(document.documentElement).getPropertyValue('--mobile-header-height');
      const parsed = parseFloat(val);
      return isNaN(parsed) ? 64 : parsed;
    };

    // We use the CSS variable set by Header.jsx's ResizeObserver or fallback to 64
    const offset = getHeaderHeight();
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsScrolled(!entry.isIntersecting && entry.boundingClientRect.top < offset);
      },
      {
        rootMargin: `-${offset}px 0px 0px 0px`,
        threshold: 0
      }
    );
    observer.observe(sentinelRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Auto-scroll the horizontal nav to keep active item in view
  useEffect(() => {
    if (isScrolled && activeCategoryId && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const activeEl = container.querySelector(`[data-category-id="${activeCategoryId}"]`);
      if (activeEl) {
        const containerRect = container.getBoundingClientRect();
        const elementRect = activeEl.getBoundingClientRect();
        let scrollTarget = container.scrollLeft + (elementRect.left - containerRect.left) - (containerRect.width / 2) + (elementRect.width / 2);
        if (scrollTarget < 0) scrollTarget = 0;
        
        container.scrollTo({
          left: scrollTarget,
          behavior: reducedMotion ? 'auto' : 'smooth'
        });
      }
    }
  }, [activeCategoryId, isScrolled, reducedMotion]);

  if (!categories || categories.length === 0) return null;

  const handleCategorySelect = (e, catId) => {
    setIsMenuOpen(false);
    if (onCategoryClick) onCategoryClick(e, catId);
  };

  return (
    <>
      {/* Mobile Hamburger State (State 1) */}
      {/* Kept in document flow to avoid layout shifts. Fades out when scrolled past. */}
      <div className={`md:hidden relative z-20 w-full flex justify-center py-4 transition-opacity duration-300 ${isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}>
        <button
          ref={btnRef}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-overlay-menu"
          aria-label={isMenuOpen ? "Close menu categories" : "Open menu categories"}
          className="w-[44px] h-[44px] flex flex-col items-center justify-center gap-1.5 rounded-full bg-white border border-gray-200 shadow-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-saffron transition-colors"
          data-testid="hamburger-btn"
        >
          <span className="w-5 h-0.5 bg-current rounded-full" />
          <span className="w-5 h-0.5 bg-current rounded-full" />
          <span className="w-5 h-0.5 bg-current rounded-full" />
        </button>

        {/* Mobile Overlay Menu */}
        {isMenuOpen && (
          <div 
            ref={menuRef}
            id="mobile-overlay-menu"
            data-testid="overlay-menu"
            className="absolute top-16 left-4 right-4 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-xl z-20 p-2 overflow-hidden"
          >
            <ul className="flex flex-col list-none p-0 m-0">
              {categories.map(cat => {
                const isActive = activeCategoryId === cat.id;
                return (
                  <li key={cat.id} className="m-0 p-0">
                    <a
                      href={`#category-${cat.id}`}
                      onClick={(e) => handleCategorySelect(e, cat.id)}
                      aria-current={isActive ? 'page' : undefined}
                      className={`block w-full text-left px-4 py-3 rounded-xl font-medium text-base transition-colors ${
                        isActive 
                          ? 'bg-brand-saffron text-white shadow-sm' 
                          : 'bg-transparent text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {cat.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {/* Sentinel placed in normal document flow exactly before the sticky nav */}
      <div ref={sentinelRef} className="w-full h-px" aria-hidden="true" data-testid="sentinel" />

      {/* Sticky Progress Bar State (State 2 for Mobile, State 1 & 2 for Desktop) */}
      <div 
        ref={stickyBarRef}
        className={`sticky z-30 w-full transition-opacity duration-300 ${reducedMotion ? 'transition-none' : ''} ${!isScrolled ? 'opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto' : 'opacity-100 pointer-events-auto'}`}
        style={{ top: 'var(--mobile-header-height, 64px)' }}
        data-testid="sticky-bar"
      >
        <nav 
          aria-label="Menu progress" 
          className="w-full bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-[0_2px_10px_rgba(0,0,0,0.03)] supports-[backdrop-filter:blur(1px)]:bg-white/70 py-2 sm:py-3"
        >
          <div className="max-w-4xl mx-auto px-4">
            <ul 
              ref={scrollContainerRef}
              className="flex items-center space-x-2 m-0 p-0 list-none overflow-x-auto scrollbar-hide snap-x"
              data-testid="progress-categories"
            >
              {/* Padding elements to allow scrolling the first/last item into center if needed */}
              <li className="shrink-0 w-2 sm:w-0" aria-hidden="true" />
              
              {categories.map(cat => {
                const isActive = activeCategoryId === cat.id;
                return (
                  <li key={cat.id} data-category-id={cat.id} className="m-0 p-0 shrink-0 snap-start">
                    <a
                      href={`#category-${cat.id}`}
                      onClick={(e) => handleCategorySelect(e, cat.id)}
                      aria-current={isActive ? 'page' : undefined}
                      className={`outline-none py-1.5 px-4 rounded-full font-medium text-sm sm:text-base transition-all duration-200 select-none inline-block ${
                        isActive 
                          ? 'bg-brand-saffron text-white shadow-sm ring-1 ring-white/20' 
                          : 'bg-transparent text-gray-700 hover:text-gray-900 hover:bg-gray-100/50'
                      }`}
                    >
                      {cat.name}
                    </a>
                  </li>
                );
              })}
              
              <li className="shrink-0 w-4 sm:w-0" aria-hidden="true" />
            </ul>
          </div>
        </nav>
      </div>
    </>
  );
};

export default CategoryNavigation;
