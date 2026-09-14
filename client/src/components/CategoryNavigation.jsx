import React, { useRef, useEffect } from 'react';
import { CategoryIcon } from './icons/CategoryIcon';
import PressableCategoryButton from './PressableCategoryButton';

const CategoryNavigation = ({ categories, activeCategoryId, onCategoryClick }) => {
  const navRef = useRef(null);
  const containerRef = useRef(null);

  // Set --category-nav-height CSS variable dynamically
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        document.documentElement.style.setProperty(
          '--category-nav-height',
          `${entry.borderBoxSize?.[0]?.blockSize || entry.contentRect.height}px`
        );
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Scroll active tab into view when it changes
  useEffect(() => {
    if (!activeCategoryId || !navRef.current) return;
    const activeEl = navRef.current.querySelector(`[data-id="cat-tab-${activeCategoryId}"]`);
    if (activeEl) {
      const container = navRef.current;
      const scrollLeft = activeEl.offsetLeft - (container.offsetWidth / 2) + (activeEl.offsetWidth / 2);
      try {
        container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      } catch (e) {
        container.scrollLeft = scrollLeft;
      }
    }
  }, [activeCategoryId]);

  if (!categories || categories.length === 0) return null;

  return (
    <div 
      ref={containerRef}
      className="sticky z-30 bg-white/90 backdrop-blur-md border-b border-gray-200 w-full"
      style={{ top: 'var(--mobile-header-height, 64px)' }}
    >
      <nav 
        ref={navRef}
        className="flex items-center overflow-x-auto overflow-y-hidden whitespace-nowrap px-4 py-2 sm:py-3 scroll-smooth max-w-4xl mx-auto"
        style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        <style>{`
          nav::-webkit-scrollbar { display: none; }
        `}</style>
        
        {categories.map((category) => {
          const isActive = category.id === activeCategoryId;
          return (
            <PressableCategoryButton
              key={category.id}
              category={category}
              isActive={isActive}
              onClick={(e) => onCategoryClick && onCategoryClick(e, category.id)}
              isDrawer={false}
            />
          );
        })}
      </nav>
    </div>
  );
};

export default CategoryNavigation;
