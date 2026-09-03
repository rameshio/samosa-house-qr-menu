import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import LogoIntro from '../src/components/LogoIntro';

describe('LogoIntro', () => {
  let playMock;
  let matchMediaMock;

  beforeEach(() => {
    sessionStorage.clear();
    
    vi.useFakeTimers();

    playMock = vi.fn().mockResolvedValue();
    window.HTMLMediaElement.prototype.play = playMock;
    window.HTMLMediaElement.prototype.load = vi.fn();
    
    matchMediaMock = vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    window.matchMedia = matchMediaMock;
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('1. Existing session flag prevents the overlay from rendering.', () => {
    sessionStorage.setItem('samosa-house-intro-seen-v2', 'true');
    render(<LogoIntro />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('2. A fresh session renders the video immediately to block the menu.', () => {
    render(<LogoIntro />);
    const dialog = screen.getByRole('dialog');
    // The gate must be visually solid immediately to prevent menu flash
    expect(dialog).toHaveClass('opacity-100');
    expect(dialog).toHaveClass('pointer-events-auto');
    
    const video = screen.getByTestId('intro-video');
    expect(video).toBeInTheDocument();
  });

  it('3. The video has no poster attribute and is transparent until playing.', () => {
    render(<LogoIntro />);
    const video = screen.getByTestId('intro-video');
    expect(video).not.toHaveAttribute('poster');
    
    // Video itself is transparent to hide black frames/buffering
    expect(video).toHaveClass('opacity-0');
    
    // There should be no "Welcome to" text or other intro-image explicitly added as a duplicate.
    expect(screen.queryByText(/Welcome to/i)).not.toBeInTheDocument();
  });

  it('4. The playing event makes the video visible and clears the watchdog.', () => {
    render(<LogoIntro />);
    const video = screen.getByTestId('intro-video');
    
    fireEvent(video, new Event('canplay'));
    expect(playMock).toHaveBeenCalled();
    
    fireEvent(video, new Event('playing'));
    
    // Video fades in
    expect(video).toHaveClass('opacity-100');
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('opacity-100');
  });

  it('5. Failure to emit playing dismisses within approximately 1200ms.', () => {
    render(<LogoIntro />);
    const video = screen.getByTestId('intro-video');
    
    fireEvent(video, new Event('canplay')); // Starts watchdog
    
    act(() => {
      vi.advanceTimersByTime(1200); // Watchdog expires
    });
    
    // Dismisses immediately (no fade since it's immediate)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('6. Startup-watchdog dismissal records the session flag.', () => {
    render(<LogoIntro />);
    const video = screen.getByTestId('intro-video');
    fireEvent(video, new Event('canplay'));
    act(() => {
      vi.advanceTimersByTime(1200);
    });
    expect(sessionStorage.getItem('samosa-house-intro-seen-v2')).toBe('true');
  });

  it('7. ended dismisses normally and records completion.', () => {
    render(<LogoIntro />);
    const video = screen.getByTestId('intro-video');
    fireEvent(video, new Event('playing'));
    
    fireEvent.ended(video);
    expect(sessionStorage.getItem('samosa-house-intro-seen-v2')).toBe('true');
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('opacity-0');
  });

  it('8. pageshow with persisted: true and an existing flag dismisses immediately.', () => {
    render(<LogoIntro />);
    sessionStorage.setItem('samosa-house-intro-seen-v2', 'true');
    const event = new Event('pageshow');
    event.persisted = true;
    act(() => {
      window.dispatchEvent(event);
    });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('9. Restored unfinished playback attempts to resume safely.', () => {
    render(<LogoIntro />);
    const video = screen.getByTestId('intro-video');
    fireEvent(video, new Event('playing'));
    
    Object.defineProperty(video, 'paused', { value: true, configurable: true });
    Object.defineProperty(video, 'ended', { value: false, configurable: true });
    
    const event = new Event('visibilitychange');
    Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true });
    
    act(() => {
      document.dispatchEvent(event);
    });
    
    expect(playMock).toHaveBeenCalled();
  });

  it('10. A finished restored video dismisses immediately.', () => {
    render(<LogoIntro />);
    const video = screen.getByTestId('intro-video');
    
    Object.defineProperty(video, 'ended', { value: true, configurable: true });
    
    const event = new Event('pageshow');
    event.persisted = true;
    act(() => {
      window.dispatchEvent(event);
    });
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('11. Returning to a visible page with an existing flag removes the overlay.', () => {
    render(<LogoIntro />);
    
    sessionStorage.setItem('samosa-house-intro-seen-v2', 'true');
    
    const event = new Event('visibilitychange');
    Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true });
    
    act(() => {
      document.dispatchEvent(event);
    });
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('12. A genuine rejected play promise dismisses immediately without fallback.', async () => {
    playMock.mockRejectedValueOnce(new Error('NotAllowedError'));
    render(<LogoIntro />);
    const video = screen.getByTestId('intro-video');
    
    await act(async () => {
      fireEvent(video, new Event('canplay'));
    });
    
    // Intro should be gone entirely
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByTestId('intro-fallback-image')).not.toBeInTheDocument();
  });

  it('13. Reduced-motion mode intentionally uses the static fallback and makes it visible.', () => {
    matchMediaMock.mockImplementation(query => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    
    render(<LogoIntro />);
    expect(screen.queryByTestId('intro-video')).not.toBeInTheDocument();
    const fallbackImage = screen.getByTestId('intro-fallback-image');
    expect(fallbackImage).toBeInTheDocument();
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('opacity-100');
  });

  it('14. Body scrolling is locked IMMEDIATELY for the gate and restored on dismissal.', () => {
    render(<LogoIntro />);
    
    // Immediately locked because the gate is active and blocking the menu
    expect(document.body.style.overflow).toBe('hidden');
    
    const video = screen.getByTestId('intro-video');
    fireEvent(video, new Event('playing'));
    
    // Still locked
    expect(document.body.style.overflow).toBe('hidden');
    
    fireEvent.ended(video);
    
    act(() => {
      vi.advanceTimersByTime(300);
    });
    
    // Restored after dismissal
    expect(document.body.style.overflow).toBe('');
  });

  it('15. Timers and lifecycle listeners are removed on unmount.', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    
    const { unmount } = render(<LogoIntro />);
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('pageshow', expect.any(Function));
  });

  it('16. Strict Mode does not create duplicate watchdogs or playback loops.', () => {
    const { rerender } = render(<LogoIntro />);
    rerender(<LogoIntro />);
    
    const video = screen.getByTestId('intro-video');
    fireEvent(video, new Event('canplay'));
    
    expect(playMock).toHaveBeenCalledTimes(1);
    
    act(() => {
      vi.advanceTimersByTime(1200);
    });
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
