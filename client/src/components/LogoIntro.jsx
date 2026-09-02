import React, { useState, useEffect, useRef, useCallback } from 'react';

const SESSION_KEY = 'samosa-house-intro-seen-v2';
const INTRO_FALLBACK_DURATION = 3500; // ~3.5 seconds
const INTRO_FADE_DURATION = 300;
const VIDEO_SRC = '/videos/samosa-house-welcome-unique-3s-v2.mp4';

const LogoIntro = () => {
  const videoRef = useRef(null);

  const [isVisible, setIsVisible] = useState(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === 'true';
    } catch {
      // Ignore
    }
    if (import.meta.env.DEV) {
      console.log(`Logo intro already seen: ${seen}`);
      console.log(`Logo intro visible: ${!seen}`);
    }
    return !seen;
  });

  const [isFading, setIsFading] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (import.meta.env.DEV && isVisible) {
      console.log(`Reduced motion enabled: ${isReducedMotion}`);
    }
  }, [isVisible, isReducedMotion]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const listener = (e) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  const dismissIntro = useCallback(() => {
    if (isFading) return;
    setIsFading(true);
    
    try {
      sessionStorage.setItem(SESSION_KEY, 'true');
    } catch {
      // Ignore storage errors safely
    }

    setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = '';
    }, INTRO_FADE_DURATION);
  }, [isFading]);

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
      
      const timer = setTimeout(() => {
        dismissIntro();
      }, INTRO_FALLBACK_DURATION);

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
      };
    }
  }, [isVisible, dismissIntro]);

  useEffect(() => {
    if (isVisible && videoRef.current && !isReducedMotion && !showFallback) {
      const video = videoRef.current;
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.currentTime = 0;
      video.load();
      if (import.meta.env.DEV) {
        console.log('Video loaded');
      }
    }
  }, [isVisible, isReducedMotion, showFallback]);

  const handleCanPlay = () => {
    if (import.meta.env.DEV) {
      console.log('Video can play');
    }
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          if (import.meta.env.DEV) {
            console.log('Video playback started');
          }
        })
        .catch((err) => {
          if (err.name === 'AbortError') {
            if (import.meta.env.DEV) {
              console.log(`Video playback rejected: ${err.name} - ${err.message}`);
            }
          } else {
            if (import.meta.env.DEV) {
              console.log(`Video playback rejected: ${err.name} - ${err.message}`);
            }
            setShowFallback(true);
          }
        });
    }
  };

  const handleVideoEnded = () => {
    if (import.meta.env.DEV) {
      console.log('Video ended');
    }
    dismissIntro();
  };

  const handleVideoError = (e) => {
    if (import.meta.env.DEV) {
      console.log(`Video error: ${e.nativeEvent?.target?.error?.message || 'MediaError'}`);
    }
    setShowFallback(true);
  };

  if (!isVisible) return null;

  const showVideo = !isReducedMotion && !showFallback;

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-brand-saffron transition-opacity duration-300 motion-reduce:transition-none ${isFading ? 'opacity-0' : 'opacity-100'}`}
      role="dialog"
      aria-modal="true"
      aria-label="Samosa House Welcome"
    >
      <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center overflow-hidden">
        {showVideo ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            preload="auto"
            onCanPlay={handleCanPlay}
            onEnded={handleVideoEnded}
            onError={handleVideoError}
            className="w-full h-full object-contain"
            data-testid="intro-video"
          >
            <source src={VIDEO_SRC} type="video/mp4" />
          </video>
        ) : (
          <div className="flex flex-col items-center justify-center px-4 w-full h-full">
            <img 
              src="/images/brand/samosa-house-logo.png" 
              alt="Samosa House" 
              className="w-full max-w-[80%] md:max-w-md h-auto object-contain"
              data-testid="intro-fallback-image"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LogoIntro;
