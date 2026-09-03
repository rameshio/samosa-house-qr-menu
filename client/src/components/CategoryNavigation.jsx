import React, { useRef, useEffect, useState } from 'react';

const CategoryNavigation = ({ categories, activeCategoryId, onCategoryClick }) => {
  const scrollWrapperRef = useRef(null);
  const navRef = useRef(null);
  const filterRef = useRef(null);
  
  const derivedIndex = categories && activeCategoryId 
    ? Math.max(0, categories.findIndex(c => c.id === activeCategoryId)) 
    : 0;
  
  const [localActiveIndex, setLocalActiveIndex] = useState(derivedIndex);

  if (derivedIndex !== localActiveIndex) {
    setLocalActiveIndex(derivedIndex);
  }

  const animationTime = 600;
  const particleCount = 15;
  const particleDistances = [90, 10];
  const particleR = 100;
  const timeVariance = 300;
  const colors = [1, 2, 3, 1, 2, 3, 1, 4];

  const noise = (n = 1) => n / 2 - Math.random() * n;
  
  const getXY = (distance, pointIndex, totalPoints) => {
    const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
    return [distance * Math.cos(angle), distance * Math.sin(angle)];
  };
  
  const createParticle = (i, t, d, r) => {
    let rotate = noise(r / 10);
    return {
      start: getXY(d[0], particleCount - i, particleCount),
      end: getXY(d[1] + noise(7), particleCount - i, particleCount),
      time: t,
      scale: 1 + noise(0.2),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10
    };
  };

  const makeParticles = element => {
    const d = particleDistances;
    const r = particleR;
    const bubbleTime = animationTime * 2 + timeVariance;
    element.style.setProperty('--time', `${bubbleTime}ms`);
    for (let i = 0; i < particleCount; i++) {
      const t = animationTime * 2 + noise(timeVariance * 2);
      const p = createParticle(i, t, d, r);
      element.classList.remove('active');
      setTimeout(() => {
        const particle = document.createElement('span');
        const point = document.createElement('span');
        particle.classList.add('particle');
        particle.style.setProperty('--start-x', `${p.start[0]}px`);
        particle.style.setProperty('--start-y', `${p.start[1]}px`);
        particle.style.setProperty('--end-x', `${p.end[0]}px`);
        particle.style.setProperty('--end-y', `${p.end[1]}px`);
        particle.style.setProperty('--time', `${p.time}ms`);
        particle.style.setProperty('--scale', `${p.scale}`);
        particle.style.setProperty('--color', `var(--color-${p.color}, #F97316)`);
        particle.style.setProperty('--rotate', `${p.rotate}deg`);
        point.classList.add('point');
        particle.appendChild(point);
        element.appendChild(particle);
        requestAnimationFrame(() => {
          element.classList.add('active');
        });
        setTimeout(() => {
          try {
            element.removeChild(particle);
          } catch {
            // do nothing
          }
        }, t);
      }, 30);
    }
  };

  const updateEffectPosition = element => {
    if (!navRef.current || !filterRef.current) return;
    const containerRect = navRef.current.getBoundingClientRect();
    const pos = element.getBoundingClientRect();
    const styles = {
      left: `${pos.x - containerRect.x}px`,
      top: `${pos.y - containerRect.y}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`
    };
    Object.assign(filterRef.current.style, styles);
  };

  const triggerAnimation = React.useCallback((index, doParticles = true) => {
    if (!navRef.current) return;
    const liEl = navRef.current.querySelectorAll('li')[index];
    if (!liEl) return;
    
    updateEffectPosition(liEl);
    
    if (filterRef.current && doParticles) {
      const particles = filterRef.current.querySelectorAll('.particle');
      particles.forEach(p => filterRef.current.removeChild(p));
      makeParticles(filterRef.current);
    }
  }, []);

  useEffect(() => {
    if (!categories || categories.length === 0) return;
    
    if (filterRef.current) {
       const isInitialized = !!filterRef.current.style.width;
       triggerAnimation(localActiveIndex, isInitialized);
    }
    
    if (activeCategoryId && scrollWrapperRef.current) {
      const container = scrollWrapperRef.current;
      const activeElement = container.querySelector(`[data-category-id="${activeCategoryId}"]`);
      
      if (activeElement) {
        const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        try {
          const containerRect = container.getBoundingClientRect();
          const elementRect = activeElement.getBoundingClientRect();
          let scrollTarget = container.scrollLeft + (elementRect.left - containerRect.left) - (containerRect.width / 2) + (elementRect.width / 2);
          if (scrollTarget < 0) scrollTarget = 0;

          container.scrollTo({
            left: scrollTarget,
            behavior: isReducedMotion ? 'auto' : 'smooth'
          });
        } catch {
          const containerRect = container.getBoundingClientRect();
          const elementRect = activeElement.getBoundingClientRect();
          let scrollTarget = container.scrollLeft + (elementRect.left - containerRect.left) - (containerRect.width / 2) + (elementRect.width / 2);
          if (scrollTarget < 0) scrollTarget = 0;
          container.scrollLeft = scrollTarget;
        }
      }
    }
  }, [activeCategoryId, categories, localActiveIndex]);

  const handleUserClick = (e, categoryId, index) => {
    if (onCategoryClick) {
      onCategoryClick(e, categoryId);
    }
    if (index === localActiveIndex) {
      triggerAnimation(index);
    }
  };

  useEffect(() => {
    if (!navRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      const currentActiveLi = navRef.current?.querySelectorAll('li')[localActiveIndex];
      if (currentActiveLi) {
        updateEffectPosition(currentActiveLi);
      }
    });
    resizeObserver.observe(navRef.current);
    return () => resizeObserver.disconnect();
  }, [localActiveIndex]);

  if (!categories || categories.length === 0) return null;

  return (
    <nav 
      aria-label="Menu categories" 
      className="sticky top-[64px] sm:top-[80px] z-30 w-full bg-white/85 backdrop-blur-md border-b border-white/50 shadow-[0_4px_30px_rgba(0,0,0,0.05)] supports-[not_(backdrop-filter:blur(1px))]:bg-white/95 py-2 sm:py-3 transition-colors duration-300"
    >
      <style>
        {`
          :root {
            --color-1: #F97316;
            --color-2: #ea580c;
            --color-3: #fb923c;
            --color-4: #fed7aa;
          }
          .gooey-nav-wrapper {
            position: absolute;
            inset: 0;
            filter: url('#gooey-svg-filter'); 
            pointer-events: none;
            z-index: 1;
          }
          .effect.filter {
            position: absolute;
            opacity: 1;
            mix-blend-mode: normal;
          }
          .effect.filter::before {
            content: "";
            position: absolute;
            inset: -75px;
            z-index: -2;
            background: transparent;
          }
          .effect.filter::after {
            content: "";
            position: absolute;
            inset: 0;
            background: var(--color-1);
            transform: scale(0);
            opacity: 0;
            z-index: -1;
            border-radius: 9999px;
            box-shadow: 0 1px 3px rgba(249, 115, 22, 0.4);
          }
          .effect.active::after {
            animation: pill 0.3s ease both;
          }
          @keyframes pill {
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
          .particle,
          .point {
            display: block;
            opacity: 0;
            width: 14px;
            height: 14px;
            border-radius: 9999px;
            transform-origin: center;
          }
          .particle {
            --time: 5s;
            position: absolute;
            top: calc(50% - 7px);
            left: calc(50% - 7px);
            animation: particle calc(var(--time)) ease 1 -350ms;
          }
          .point {
            background: var(--color);
            opacity: 1;
            animation: point calc(var(--time)) ease 1 -350ms;
          }
          @keyframes particle {
            0% { transform: rotate(0deg) translate(calc(var(--start-x)), calc(var(--start-y))); opacity: 1; animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45); }
            70% { transform: rotate(calc(var(--rotate) * 0.5)) translate(calc(var(--end-x) * 1.2), calc(var(--end-y) * 1.2)); opacity: 1; animation-timing-function: ease; }
            85% { transform: rotate(calc(var(--rotate) * 0.66)) translate(calc(var(--end-x)), calc(var(--end-y))); opacity: 1; }
            100% { transform: rotate(calc(var(--rotate) * 1.2)) translate(calc(var(--end-x) * 0.5), calc(var(--end-y) * 0.5)); opacity: 1; }
          }
          @keyframes point {
            0% { transform: scale(0); opacity: 0; animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45); }
            25% { transform: scale(calc(var(--scale) * 0.25)); }
            38% { opacity: 1; }
            65% { transform: scale(var(--scale)); opacity: 1; animation-timing-function: ease; }
            85% { transform: scale(var(--scale)); opacity: 1; }
            100% { transform: scale(0); opacity: 0; }
          }
          li::after {
            content: "";
            position: absolute;
            inset: 0;
            border-radius: 9999px;
            background: transparent;
            opacity: 0;
            transform: scale(0);
            transition: all 0.3s ease;
            z-index: -1;
          }
        `}
      </style>

      <svg width="0" height="0" className="absolute">
        <defs>
          <filter id="gooey-svg-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="gooey" />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div 
        ref={scrollWrapperRef}
        className="flex overflow-x-auto whitespace-nowrap scrollbar-hide max-w-4xl mx-auto px-4 relative items-center"
      >
        <div className="relative flex min-w-full">
          <div className="gooey-nav-wrapper" aria-hidden="true">
            <span className="effect filter" ref={filterRef} />
          </div>
          <ul
            ref={navRef}
            className="flex space-x-2 sm:space-x-4 list-none p-0 m-0 relative z-[3] items-center min-w-full"
          >
            {categories.map((cat, index) => {
              const isActive = index === localActiveIndex;
              return (
                <li
                  key={cat.id}
                  data-category-id={cat.id}
                  className={`min-h-[44px] rounded-full relative cursor-pointer transition-colors duration-300 ease inline-flex items-center justify-center font-medium
                    ${isActive ? 'active text-white drop-shadow-md' : 'bg-white/80 text-gray-700 hover:bg-white border border-gray-100'}`}
                >
                  <a
                    onClick={e => handleUserClick(e, cat.id, index)}
                    href={`#category-${cat.id}`}
                    className="outline-none py-2 px-4 inline-block font-medium z-10"
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {cat.name}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default CategoryNavigation;
