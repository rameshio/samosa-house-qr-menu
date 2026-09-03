import { renderHook, act } from '@testing-library/react';
import { useCategoryScroll } from '../../src/hooks/useCategoryScroll';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockCategories = [
  { id: 'appetizers', name: 'Appetizers' },
  { id: 'chaat', name: 'Chaat' },
  { id: 'mains', name: 'Mains' }
];

describe('useCategoryScroll', () => {
  beforeEach(() => {
    window.location.hash = '';
    vi.useFakeTimers();
    document.getElementById = vi.fn().mockReturnValue({
      scrollIntoView: vi.fn()
    });
    global.IntersectionObserver = class {
      constructor() {}
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes first category as active with no hash', () => {
    const { result } = renderHook(() => useCategoryScroll(mockCategories, false, null));
    expect(result.current.activeCategoryId).toBe('appetizers');
  });

  it('initializes valid hash synchronously before observer', () => {
    window.location.hash = '#category-chaat';
    const { result } = renderHook(() => useCategoryScroll(mockCategories, false, null));
    expect(result.current.activeCategoryId).toBe('chaat');
  });

  it('falls back to first category on invalid hash', () => {
    window.location.hash = '#category-invalid';
    const { result } = renderHook(() => useCategoryScroll(mockCategories, false, null));
    expect(result.current.activeCategoryId).toBe('appetizers');
  });
  
  it('updates active category on click', () => {
    const { result } = renderHook(() => useCategoryScroll(mockCategories, false, null));
    
    act(() => {
      result.current.handleCategoryClick({ preventDefault: vi.fn() }, 'mains');
    });
    
    expect(result.current.activeCategoryId).toBe('mains');
  });
});
