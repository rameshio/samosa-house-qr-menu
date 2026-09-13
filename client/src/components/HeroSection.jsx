import React, { useState, useEffect, useCallback } from 'react';

const SLIDES = [
  { id: 'exterior', src: '/images/restaurant/storefront-corner-day.jpg', alt: 'Samosa House Storefront' },
  { id: 'interior-market', src: '/images/restaurant/market-interior.jpg', alt: 'Indian Market Interior' },
  { id: 'interior-seating', src: '/images/restaurant/interior-window-seating.jpg', alt: 'Cozy Window Seating' },
  { id: 'rotating-1', src: '/images/restaurant/rotating-1.jpg', alt: 'Fresh Indian Cuisine' },
  { id: 'rotating-2', src: '/images/restaurant/rotating-2.jpg', alt: 'Traditional Spices' }
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const listener = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused || prefersReducedMotion) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, prefersReducedMotion]);

  return (
    <section className="relative w-full">
      {/* Slideshow Container */}
      <div 
        className="relative w-full h-[60vh] min-h-[400px] max-h-[600px] bg-gray-900 overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
        aria-roledescription="carousel"
        aria-label="Restaurant Photos"
      >
        {SLIDES.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
              aria-hidden={!isActive}
            >
              <img
                src={slide.src}
                alt={slide.alt}
                className="w-full h-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
              />
              {/* Dark overlay for readable text */}
              <div className="absolute inset-0 bg-black/50" />
            </div>
          );
        })}

        {/* Text Overlay */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white drop-shadow-lg mb-4">
            Indian Vegetarian Favorites
          </h1>
          <p className="text-lg sm:text-xl text-white/90 drop-shadow-md mb-8 max-w-2xl font-light">
            Explore samosas, chaat, dosas and more in Culver City.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => {
                const navOffset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--mobile-header-height') || 64) + parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--category-nav-height') || 48) + 16;
                const menuEl = document.querySelector('main');
                if (menuEl) {
                  const scrollPos = menuEl.getBoundingClientRect().top + window.scrollY - navOffset;
                  window.scrollTo({ top: scrollPos, behavior: 'smooth' });
                }
              }}
              className="px-8 py-3 bg-brand-saffron text-white font-bold rounded-full shadow-lg hover:bg-orange-600 focus:ring-4 focus:ring-white/20 transition-all"
            >
              Explore Menu
            </button>
            <button 
              onClick={() => {
                const navOffset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--mobile-header-height') || 64) + parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--category-nav-height') || 48) + 16;
                const visitEl = document.getElementById('visit-us');
                if (visitEl) {
                  const scrollPos = visitEl.getBoundingClientRect().top + window.scrollY - navOffset;
                  window.scrollTo({ top: scrollPos, behavior: 'smooth' });
                }
              }}
              className="px-8 py-3 bg-white/20 backdrop-blur-sm text-white font-bold rounded-full shadow-lg border border-white/40 hover:bg-white/30 focus:ring-4 focus:ring-white/20 transition-all"
            >
              Visit Us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
