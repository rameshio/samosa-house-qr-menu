import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { vi } from 'vitest';
import CategoryNavigation from '../src/components/CategoryNavigation';
import MenuPage from '../src/pages/MenuPage';
import * as menuService from '../src/services/menuService';

vi.mock('../src/services/menuService');
vi.mock('../src/components/DevelopmentStatus', () => ({
  default: () => <div data-testid="mock-dev-status" />
}));

const mockCategories = [
  { id: 'appetizers', name: 'Appetizers', items: [{ id: '1', name: 'A1', basePriceCents: 100, available: true }] },
  { id: 'chaat', name: 'Chaat', items: [{ id: '2', name: 'C1', basePriceCents: 200, available: true }] }
];


global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

const observers = new Set();
global.IntersectionObserver = class IntersectionObserver {
  constructor(cb) {
    this.cb = cb;
    this.elements = new Set();
    observers.add(this);
  }
  observe(el) { this.elements.add(el); }
  unobserve(el) { this.elements.delete(el); }
  disconnect() { observers.delete(this); }
};

function triggerScroll(isIntersecting) {
  act(() => {
    observers.forEach(obs => {
      const sentinel = Array.from(obs.elements).find(el => el && el.getAttribute('data-testid') === 'sentinel');
      if (sentinel) {
        obs.cb([{
          isIntersecting,
          boundingClientRect: { top: isIntersecting ? 100 : 0 }
        }]);
      }
    });
  });
}

describe('CategoryNavigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.location.hash = '';
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    window.HTMLElement.prototype.scrollTo = vi.fn();
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
  });

  const TestWrapper = ({ activeId, onCatClick = vi.fn() }) => (
    <CategoryNavigation categories={mockCategories} activeCategoryId={activeId || 'appetizers'} onCategoryClick={onCatClick} />
  );

  it('1. Navigation renders all categories in API order', () => {
    render(<TestWrapper />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveTextContent('Appetizers');
    expect(links[1]).toHaveTextContent('Chaat');
  });

  it('2,3,4. Navigation is absent during loading, error, and empty', () => {
    const { container, rerender } = render(<CategoryNavigation categories={null} activeCategoryId={null} />);
    expect(container.firstChild).toBeNull();
    
    rerender(<CategoryNavigation categories={[]} activeCategoryId={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('5. Each control targets the correct section ID', () => {
    render(<TestWrapper />);
    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '#category-appetizers');
    expect(links[1]).toHaveAttribute('href', '#category-chaat');
  });

  it('7,8. Active control receives aria-current', () => {
    render(<TestWrapper activeId="chaat" />);
    const links = screen.getAllByRole('link');
    expect(links[0]).not.toHaveAttribute('aria-current');
    expect(links[1]).toHaveAttribute('aria-current', 'page');
  });
});

// We test integration and hook logic using a wrapper or MenuPage
describe('useCategoryScroll & MenuPage Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.location.hash = '';
    window.history.pushState = vi.fn();
    window.history.replaceState = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    window.HTMLElement.prototype.scrollTo = vi.fn();
  });

  it('6,7. Clicking a category calls the expected scrolling behavior and updates active state', async () => {
    menuService.fetchMenu.mockResolvedValue({
      menuType: 'restaurant',
      categories: mockCategories
    });
    
    render(<MenuPage />);
    await screen.findByRole('heading', { name: 'Appetizers' });
    
    const link = await screen.findByRole('link', { name: 'Chaat' });
    
    fireEvent.click(link);
    
    expect(window.history.pushState).toHaveBeenCalledWith(null, '', '#category-chaat');
    expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalledWith(expect.objectContaining({
      behavior: 'smooth',
      block: 'start'
    }));
    
    expect(link).toHaveAttribute('aria-current', 'page');
  });

  it('9,10,11. IntersectionObserver changes the active category, cleans up, and tolerates missing observer', async () => {
    const originalObserver = global.IntersectionObserver;
    let observeMock = vi.fn();
    let disconnectMock = vi.fn();
    let callbackRef;
    
    global.IntersectionObserver = class {
      constructor(cb) {
        callbackRef = cb;
      }
      observe = observeMock;
      disconnect = disconnectMock;
    };
    
    menuService.fetchMenu.mockResolvedValue({ menuType: 'restaurant', categories: mockCategories });
    const { unmount } = render(<MenuPage />);
    
    await screen.findByRole('heading', { name: 'Appetizers' });
    
    // We expect observer to be set via setTimeout(..., 0) inside hook
    await act(async () => {
      await new Promise(r => setTimeout(r, 0));
    });
    expect(observeMock).toHaveBeenCalled();
    
    act(() => {
      callbackRef([{ isIntersecting: true, target: { id: 'category-chaat' } }]);
    });
    
    const chaatLink = await screen.findByRole('link', { name: 'Chaat' });
    expect(chaatLink).toHaveAttribute('aria-current', 'page');
    expect(window.history.replaceState).toHaveBeenCalledWith(null, '', '#category-chaat');
    
    unmount();
    expect(disconnectMock).toHaveBeenCalled();
    
    delete global.IntersectionObserver;
    const { unmount: unmount2 } = render(<MenuPage />);
    await screen.findByRole('heading', { name: 'Appetizers' });
    unmount2();
    
    global.IntersectionObserver = originalObserver;
  });

  it('12. Reduced motion prevents smooth scrolling', async () => {
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: true, // reduced motion true
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    
    menuService.fetchMenu.mockResolvedValue({ menuType: 'restaurant', categories: mockCategories });
    render(<MenuPage />);
    await screen.findByRole('heading', { name: 'Appetizers' });
    
    const link = await screen.findByRole('link', { name: 'Chaat' });
    fireEvent.click(link);
    
    expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalledWith(expect.objectContaining({
      behavior: 'auto'
    }));
  });

  it('13, 14. Initial hash behavior', async () => {
    // Valid hash
    window.location.hash = '#category-chaat';
    menuService.fetchMenu.mockResolvedValue({ menuType: 'restaurant', categories: mockCategories });
    const { unmount } = render(<MenuPage />);
    
    await screen.findByRole('heading', { name: 'Appetizers' });
    
    // allow initial scroll setTimeout to fire
    await act(async () => {
      await new Promise(r => setTimeout(r, 150));
    });
    
    const link = await screen.findByRole('link', { name: 'Chaat' });
    expect(link).toHaveAttribute('aria-current', 'page');
    expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalled(); // via setTimeout
    
    unmount();
    
    // Invalid hash
    window.location.hash = '#category-invalid';
    vi.clearAllMocks();
    render(<MenuPage />);
    await screen.findByRole('heading', { name: 'Appetizers' });
    
    const appLink = await screen.findByRole('link', { name: 'Appetizers' });
    expect(appLink).toHaveAttribute('aria-current', 'page'); // fallback to first
  });

  it('Passing the hero sentinel activates the sticky horizontal bar', async () => {
    menuService.fetchMenu.mockResolvedValue({ menuType: 'restaurant', categories: mockCategories });
    render(<MenuPage />);
    
    await screen.findByRole('heading', { name: 'Appetizers' });
    triggerScroll(false);
    
    const stickyBar = screen.getByTestId('sticky-bar');
    expect(stickyBar).not.toHaveClass('opacity-0');
    expect(stickyBar).toHaveClass('opacity-100');
  });

  it('The sticky bar uses the header offset instead of top: 0', async () => {
    menuService.fetchMenu.mockResolvedValue({ menuType: 'restaurant', categories: mockCategories });
    render(<MenuPage />);
    
    await screen.findByRole('heading', { name: 'Appetizers' });
    const stickyBar = screen.getByTestId('sticky-bar');
    expect(stickyBar.style.top).toBe('var(--mobile-header-height, 64px)');
  });

  it('15. Existing menu sections and items still render', async () => {
    menuService.fetchMenu.mockResolvedValue({ menuType: 'restaurant', categories: mockCategories });
    render(<MenuPage />);
    
    expect(await screen.findByRole('heading', { name: 'Appetizers' })).toBeInTheDocument();
    expect(await screen.findByText('A1')).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'Chaat' })).toBeInTheDocument();
    expect(await screen.findByText('C1')).toBeInTheDocument();
  });

  it('16. Horizontal active-tab scrolling is requested when required', async () => {
    menuService.fetchMenu.mockResolvedValue({ menuType: 'restaurant', categories: mockCategories });
    render(<MenuPage />);
    
    await screen.findByRole('heading', { name: 'Appetizers' });
    triggerScroll(false); // Enable sticky bar so horizontal scrolling happens
    
    const links = screen.getByTestId('progress-categories').querySelectorAll('a');
    fireEvent.click(links[1]); // Chaat
    
    expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();
    // Horizontal nav tab scroll
    expect(window.HTMLElement.prototype.scrollTo).toHaveBeenCalled();
  });
});