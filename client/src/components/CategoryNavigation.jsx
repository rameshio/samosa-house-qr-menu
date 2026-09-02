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
        activeElement.scrollIntoView({
          behavior: isReducedMotion ? 'auto' : 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      } catch {
        activeElement.scrollIntoView();
      }
    }
  }, [activeCategoryId]);

  if (!categories || categories.length === 0) return null;

  return (
    <nav 
      aria-label="Menu categories" 
      className="sticky top-[64px] sm:top-[80px] z-30 w-full bg-gray-50/95 backdrop-blur-md border-b border-gray-200 py-2 sm:py-3 shadow-sm"
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
              className={`min-h-[44px] inline-flex items-center justify-center px-4 py-2 rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-heritage-green whitespace-nowrap ${isActive ? 'bg-brand-heritage-green text-white shadow-sm font-bold' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}
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