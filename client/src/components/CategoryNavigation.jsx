import React, { useRef, useEffect } from 'react';

const CategoryNavigation = ({ categories, activeCategoryId, onCategoryClick }) => {
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (!activeCategoryId || !scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const activeElement = container.querySelector(`[data-category-id="${activeCategoryId}"]`);
    
    if (activeElement) {
      const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      try {
        const containerRect = container.getBoundingClientRect();
        const elementRect = activeElement.getBoundingClientRect();
        const scrollTarget = container.scrollLeft + (elementRect.left - containerRect.left) - (containerRect.width / 2) + (elementRect.width / 2);

        container.scrollTo({
          left: scrollTarget,
          behavior: isReducedMotion ? 'auto' : 'smooth'
        });
      } catch {
        // Fallback for browsers that do not support scrollTo options
        const containerRect = container.getBoundingClientRect();
        const elementRect = activeElement.getBoundingClientRect();
        container.scrollLeft = container.scrollLeft + (elementRect.left - containerRect.left) - (containerRect.width / 2) + (elementRect.width / 2);
      }
    }
  }, [activeCategoryId]);

  if (!categories || categories.length === 0) return null;

  return (
    <nav 
      aria-label="Menu categories" 
      className="sticky top-[64px] sm:top-[80px] z-30 w-full bg-white/85 backdrop-blur-md border-b border-white/50 shadow-[0_4px_30px_rgba(0,0,0,0.05)] supports-[not_(backdrop-filter:blur(1px))]:bg-white/95 py-2 sm:py-3 transition-colors duration-300"
    >
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto whitespace-nowrap scrollbar-hide space-x-2 sm:space-x-4 max-w-4xl mx-auto px-4 items-center"
      >
        {categories.map((cat) => {
          const isActive = cat.id === activeCategoryId;
          return (
            <a
              key={cat.id}
              href={`#category-${cat.id}`}
              data-category-id={cat.id}
              onClick={(e) => onCategoryClick(e, cat.id)}
              aria-current={isActive ? 'location' : undefined}
              className={`min-h-[44px] inline-flex items-center justify-center px-4 py-2 rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-saffron whitespace-nowrap ${isActive ? 'bg-brand-saffron text-white shadow-sm font-bold' : 'bg-white/80 text-gray-700 hover:bg-white border border-gray-100'}`}
            >
              {cat.name}
            </a>
          );
        })}
      </div>
    </nav>
  );
};

export default CategoryNavigation;