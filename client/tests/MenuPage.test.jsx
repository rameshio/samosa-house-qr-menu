import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import MenuPage from '../src/pages/MenuPage';
import { vi } from 'vitest';
import * as menuService from '../src/services/menuService';

vi.mock('../src/components/DevelopmentStatus', () => ({
  default: () => <div data-testid="mock-dev-status" />
}));

vi.mock('../src/services/menuService');

describe('MenuPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    menuService.fetchMenu.mockImplementation(() => new Promise(() => {}));
    render(<MenuPage />);
    expect(screen.getByRole('status', { name: /loading menu/i })).toBeInTheDocument();
  });

  it('renders successful menu and categories and catering title with provisional notice', async () => {
    menuService.fetchMenu.mockResolvedValue({
      menuType: 'restaurant',
      isProvisional: true,
      categories: [
        { id: "c1", name: "Appetizers", items: [
          { id: "i1", name: "Samosa", basePriceCents: 225, description: "Desc", available: true }
        ]}
      ]
    });
    
    render(<MenuPage />);
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Appetizers' })).toBeInTheDocument();
    });
    
    expect(screen.getByRole('heading', { name: /Authentic Flavors/i })).toBeInTheDocument();
    expect(screen.getByText('Menu items and prices are being confirmed and may vary by location.')).toBeInTheDocument();
    expect(screen.getByText('Samosa')).toBeInTheDocument();
    expect(screen.getByText('$2.25')).toBeInTheDocument();
  });

  it('renders network error state and retry functionality', async () => {
    menuService.fetchMenu.mockRejectedValueOnce(new Error('Network failure'));
    
    render(<MenuPage />);
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /unable to load menu/i })).toBeInTheDocument();
    });
    
    menuService.fetchMenu.mockResolvedValueOnce({
      categories: [{ id: "c1", name: "Main", items: [] }]
    });
    
    fireEvent.click(screen.getByRole('button', { name: /retry/i }));
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Main' })).toBeInTheDocument();
    });
  });

  it('renders invalid API response state', async () => {
    menuService.fetchMenu.mockRejectedValue(new Error('Unexpected response shape'));
    
    render(<MenuPage />);
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /unable to load menu/i })).toBeInTheDocument();
    });
  });

  it('renders empty menu state', async () => {
    menuService.fetchMenu.mockResolvedValue({ categories: [] });
    
    render(<MenuPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/menu is currently empty/i)).toBeInTheDocument();
    });
  });
});