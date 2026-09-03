import React, { useState, useEffect, useRef, useCallback } from 'react';

const SESSION_KEY = 'samosa-house-intro-seen-v2';
const INTRO_FALLBACK_DURATION = 3500;
const WATCHDOG_DURATION = 1200;
const INTRO_FADE_DURATION = 300;
const VIDEO_SRC = '/videos/samosa-house-welcome-unique-3s-v2.mp4';
const POSTER_SRC = '/images/brand/samosa-house-logo.png';

const LogoIntro = () => {
  const videoRef = useRef(null);
  const isDismissingRef = useRef(false);
  const watchdogRef = useRef(null);

  const [isVisible, setIsVisible] = useState(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === 'true';
    } catch {
      // Ignore
    }
    return !seen;
  });

  const [isFading, setIsFading] = useState(false);
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);
  
  const [isReducedMotion, setIsReducedMotion] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const listener = (e) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  const dismissIntro = useCallback((immediate = false) => {
    if (isDismissingRef.current) return;
    isDismissingRef.current = true;
    
    try {
      sessionStorage.setItem(SESSION_KEY, 'true');
    } catch {
      // Ignore
    }

    if (watchdogRef.current) {
      clearTimeout(watchdogRef.current);
      watchdogRef.current = null;
    }

    if (immediate) {
      setIsVisible(false);
      document.body.style.overflow = '';
      return;
    }

    setIsFading(true);
    setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = '';
    }, INTRO_FADE_DURATION);
  }, []);

  // 3.5s emergency fallback timer (always runs as safety net)
  useEffect(() => {
    if (isVisible) {
      const emergencyTimer = setTimeout(() => {
        dismissIntro();
      }, INTRO_FALLBACK_DURATION);

      return () => {
        clearTimeout(emergencyTimer);
      };
    }
  }, [isVisible, dismissIntro]);

  // Lock body scrolling from the moment the intro is visible to prevent underlying menu interaction
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isVisible]);

  // Video properties setup
  useEffect(() => {
    if (isVisible && videoRef.current && !isReducedMotion) {
      const video = videoRef.current;
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.load();
    }
  }, [isVisible, isReducedMotion]);

  const attemptPlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      // Start 1.2s watchdog
      if (!watchdogRef.current && !hasStartedPlaying) {
        watchdogRef.current = setTimeout(() => {
          if (import.meta.env.DEV) console.log('Playback watchdog expired');
          dismissIntro(true); // immediate dismiss if it hangs
        }, WATCHDOG_DURATION);
      }

      playPromise.catch((err) => {
        if (err.name === 'AbortError') {
          if (import.meta.env.DEV) console.log('Video playback rejected (AbortError)');
        } else {
          if (import.meta.env.DEV) console.log('Video playback error:', err);
          if (watchdogRef.current) clearTimeout(watchdogRef.current);
          dismissIntro(true);
        }
      });
    }
  }, [dismissIntro, hasStartedPlaying]);

  const handleCanPlay = () => {
    if (!hasStartedPlaying) attemptPlay();
  };

  const handlePlaying = () => {
    if (watchdogRef.current) {
      clearTimeout(watchdogRef.current);
      watchdogRef.current = null;
    }
    setHasStartedPlaying(true);
  };

  const handleVideoEnded = () => {
    dismissIntro();
  };

  const handleVideoError = () => {
    dismissIntro(true);
  };

  // Lifecycle listeners for restoring tabs (bfcache / visibility)
  useEffect(() => {
    if (!isVisible) return;

    const checkSessionAndVideoState = (isPageShow = false) => {
      let seen = false;
      try {
        seen = sessionStorage.getItem(SESSION_KEY) === 'true';
      } catch {}

      if (seen) {
        dismissIntro(true);
        return;
      }

      const video = videoRef.current;
      if (video && !isReducedMotion) {
        if (video.ended || video.currentTime >= video.duration) {
          dismissIntro(true);
        } else if (video.paused && !isPageShow && hasStartedPlaying) { 
          // only attempt resume if we had already started
          attemptPlay();
        } else if (video.paused && !isPageShow && !hasStartedPlaying) {
          attemptPlay();
        }
      }
    };

    const handlePageShow = (e) => {
      if (e.persisted) {
        checkSessionAndVideoState(true);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkSessionAndVideoState(false);
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('pageshow', handlePageShow);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isVisible, dismissIntro, attemptPlay, hasStartedPlaying, isReducedMotion]);

  if (!isVisible) return null;

  const showVideo = !isReducedMotion;

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-brand-saffron transition-opacity duration-300 motion-reduce:transition-none ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`}
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
            onPlaying={handlePlaying}
            onEnded={handleVideoEnded}
            onError={handleVideoError}
            className={`w-full h-full object-contain transition-opacity duration-300 motion-reduce:transition-none ${
              hasStartedPlaying ? 'opacity-100' : 'opacity-0'
            }`}
            data-testid="intro-video"
          >
            <source src={VIDEO_SRC} type="video/mp4" />
          </video>
        ) : (
          <div className="flex flex-col items-center justify-center px-4 w-full h-full">
            <img 
              src={POSTER_SRC} 
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
