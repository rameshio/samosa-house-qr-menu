import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { vi } from 'vitest';
import LogoIntro from '../src/components/LogoIntro';

describe('LogoIntro', () => {
  let matchMediaMock;
  let playMock;
  let loadMock;

  beforeAll(() => {
    playMock = vi.fn().mockResolvedValue();
    loadMock = vi.fn();
    Object.defineProperty(HTMLMediaElement.prototype, 'play', {
      configurable: true,
      value: playMock
    });
    Object.defineProperty(HTMLMediaElement.prototype, 'load', {
      configurable: true,
      value: loadMock
    });
  });

  beforeEach(() => {
    try {
      sessionStorage.clear();
    } catch {}
    document.body.style.overflow = '';
    vi.useFakeTimers();
    playMock.mockClear();
    loadMock.mockClear();

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

  it('1. Intro appears during a fresh session with correct video attributes', () => {
    render(<LogoIntro />);
    expect(screen.getByRole('dialog', { name: /samosa house welcome/i })).toBeInTheDocument();
    
    const video = screen.getByTestId('intro-video');
    expect(video).toBeInTheDocument();
    
    const source = video.querySelector('source');
    expect(source).toHaveAttribute('src', '/videos/samosa-house-welcome-unique-3s-v2.mp4');
    expect(source).toHaveAttribute('type', 'video/mp4');

    expect(video).toHaveProperty('autoplay', true);
    expect(video).toHaveProperty('muted', true);
    expect(video.hasAttribute('playsinline') || video.hasAttribute('playsInline')).toBe(true);
    expect(video).not.toHaveAttribute('controls');
  });

  it('2. canplay attempts playback', () => {
    render(<LogoIntro />);
    const video = screen.getByTestId('intro-video');
    fireEvent(video, new Event('canplay'));
    expect(playMock).toHaveBeenCalled();
  });

  it('3. The ended event dismisses the intro', () => {
    render(<LogoIntro />);
    const video = screen.getByTestId('intro-video');
    const dialog = screen.getByRole('dialog');
    
    expect(sessionStorage.getItem('samosa-house-intro-seen-v2')).toBeNull();

    // Fire ended event
    fireEvent.ended(video);
    expect(dialog).toHaveClass('opacity-0');
    expect(sessionStorage.getItem('samosa-house-intro-seen-v2')).toBe('true');
    
    act(() => {
      vi.advanceTimersByTime(300);
    });
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('4. Fallback timer dismisses the overlay (3500ms + 300ms fade)', () => {
    render(<LogoIntro />);
    const dialog = screen.getByRole('dialog');
    
    act(() => {
      vi.advanceTimersByTime(3500);
    });
    expect(dialog).toHaveClass('opacity-0');
    expect(sessionStorage.getItem('samosa-house-intro-seen-v2')).toBe('true');
    
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('6. Session storage prevents replay', () => {
    sessionStorage.setItem('samosa-house-intro-seen-v2', 'true');
    render(<LogoIntro />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('6.5. Old session key does not suppress the updated intro', () => {
    sessionStorage.setItem('samosa-house-intro-seen', 'true');
    render(<LogoIntro />);
    expect(screen.getByRole('dialog', { name: /samosa house welcome/i })).toBeInTheDocument();
  });

  it('7. A genuine rejected play promise activates the fallback', async () => {
    playMock.mockRejectedValueOnce(new Error('NotAllowedError'));
    render(<LogoIntro />);
    const video = screen.getByTestId('intro-video');
    
    await act(async () => {
      fireEvent(video, new Event('canplay'));
    });
    
    expect(screen.queryByTestId('intro-video')).not.toBeInTheDocument();
    const fallbackImage = screen.getByTestId('intro-fallback-image');
    expect(fallbackImage).toBeInTheDocument();
  });

  it('8. AbortError does not immediately destroy the intro', async () => {
    const abortErr = new Error('The play() request was interrupted');
    abortErr.name = 'AbortError';
    playMock.mockRejectedValueOnce(abortErr);
    
    render(<LogoIntro />);
    const video = screen.getByTestId('intro-video');
    
    await act(async () => {
      fireEvent(video, new Event('canplay'));
    });
    
    // Video should still be mounted
    expect(screen.getByTestId('intro-video')).toBeInTheDocument();
    expect(screen.queryByTestId('intro-fallback-image')).not.toBeInTheDocument();
  });

  it('9. Video error displays the static-logo fallback', () => {
    render(<LogoIntro />);
    const video = screen.getByTestId('intro-video');
    
    fireEvent.error(video);
    
    expect(screen.queryByTestId('intro-video')).not.toBeInTheDocument();
    expect(screen.getByTestId('intro-fallback-image')).toBeInTheDocument();
  });

  it('10. Reduced-motion mode intentionally uses the static fallback', () => {
    matchMediaMock.mockImplementation(query => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    
    render(<LogoIntro />);
    expect(screen.queryByTestId('intro-video')).not.toBeInTheDocument();
    expect(screen.getByTestId('intro-fallback-image')).toBeInTheDocument();
  });

  it('11. Body scroll locking is restored after dismissal', () => {
    render(<LogoIntro />);
    expect(document.body.style.overflow).toBe('hidden');
    
    const video = screen.getByTestId('intro-video');
    fireEvent.ended(video);
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(document.body.style.overflow).toBe('');
  });
});
