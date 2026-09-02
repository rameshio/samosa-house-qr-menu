import { useState, useEffect, useRef, useCallback } from 'react';

export const useCategoryScroll = (categories, loading, error) => {
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const observerRef = useRef(null);
  const clickTimeoutRef = useRef(null);
  const isClickScrolling = useRef(false);

  useEffect(() => {
    if (loading || error || !categories || categories.length === 0) return;

    const hash = window.location.hash;
    let initialId = categories[0].id;

    if (hash && hash.startsWith('#category-')) {
      const id = hash.replace('#category-', '');
      if (categories.some(c => c.id === id)) {
        initialId = id;
        setTimeout(() => {
          const section = document.getElementById(hash.substring(1));
          if (section) {
            const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            try {
              section.scrollIntoView({ behavior: isReducedMotion ? 'auto' : 'smooth', block: 'start' });
            } catch {
              section.scrollIntoView();
            }
          }
        }, 100);
      }
    }
    // eslint-disable-next-line react/set-state-in-effect
    setActiveCategoryId(initialId);

    if (typeof IntersectionObserver !== 'undefined') {
      const options = {
        rootMargin: '-150px 0px -60% 0px',
        threshold: [0, 0.1, 0.5, 1.0]
      };

      observerRef.current = new IntersectionObserver((entries) => {
        if (isClickScrolling.current) return;

        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id.replace('category-', '');
            setActiveCategoryId(id);
          }
        });
      }, options);

      setTimeout(() => {
        categories.forEach(cat => {
          const el = document.getElementById(`category-${cat.id}`);
          if (el && observerRef.current) {
            observerRef.current.observe(el);
          }
        });
      }, 0);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, [categories, loading, error]);

  const handleCategoryClick = useCallback((e, id) => {
    e.preventDefault();
    setActiveCategoryId(id);
    
    isClickScrolling.current = true;
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    
    clickTimeoutRef.current = setTimeout(() => {
      isClickScrolling.current = false;
    }, 1000);

    const section = document.getElementById(`category-${id}`);
    if (section) {
      const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.history.pushState(null, '', `#category-${id}`);
      try {
        section.scrollIntoView({
          behavior: isReducedMotion ? 'auto' : 'smooth',
          block: 'start'
        });
      } catch {
        section.scrollIntoView();
      }
    }
  }, []);

  return { activeCategoryId, handleCategoryClick };
};