import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MenuItemCard from '../src/components/MenuItemCard';
import { formatPriceCents } from '../src/utils/formatters';

const mockItem = {
  id: 'samosa',
  name: 'Vegetable Samosa',
  description: 'Crispy pastry filled with spiced potatoes.',
  basePriceCents: 225,
  spicy: true,
  dietary: ['vegan'],
  available: true,
  image: null
};

describe('MenuItemCard', () => {
  it('renders all data correctly', () => {
    render(<MenuItemCard item={mockItem} />);
    
    expect(screen.getByText('Vegetable Samosa')).toBeInTheDocument();
    expect(screen.getByText('Crispy pastry filled with spiced potatoes.')).toBeInTheDocument();
    expect(screen.getByText('$2.25')).toBeInTheDocument();
    
    // Diet badges
    expect(screen.getByText(/spicy/i)).toBeInTheDocument();
    expect(screen.getByText(/vegan/i)).toBeInTheDocument();
  });

  it('renders unavailable state', () => {
    const unavailItem = { ...mockItem, available: false };
    render(<MenuItemCard item={unavailItem} />);
    
    const article = screen.getByRole('button', { name: /View details for Vegetable Samosa/i });
    expect(article).toHaveClass('opacity-60', 'grayscale');
    expect(screen.getByText(/Unavailable/i)).toBeInTheDocument();
  });

  it('renders fallback image when image is null', () => {
    render(<MenuItemCard item={mockItem} />);
    expect(screen.getByTestId('fallback-svg')).toBeInTheDocument();
  });

  it('renders valid image with correct attributes', () => {
    const imgItem = { ...mockItem, image: '/images/menu/samosa.webp' };
    render(<MenuItemCard item={imgItem} />);
    const img = screen.getByAltText('Vegetable Samosa');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/images/menu/samosa.webp');
    expect(img).toHaveAttribute('loading', 'lazy');
    expect(img).toHaveAttribute('decoding', 'async');
    
    // Check non-cropping presentation
    expect(img).toHaveClass('object-cover');
    // Check stable container aspect ratio by finding an ancestor
    const aspectContainer = img.closest('article').querySelector('.aspect-\\[4\\/3\\]');
    expect(aspectContainer).toBeInTheDocument();
    
    expect(screen.queryByTestId('fallback-svg')).not.toBeInTheDocument();
  });

  it('renders missing image fallback if image errors', () => {
    const imgItem = { ...mockItem, image: '/images/menu/samosa.webp' };
    render(<MenuItemCard item={imgItem} />);
    const img = screen.getByAltText('Vegetable Samosa');
    
    // Simulate error
    fireEvent.error(img);
    
    expect(screen.queryByAltText('Vegetable Samosa')).not.toBeInTheDocument();
    expect(screen.getByTestId('fallback-svg')).toBeInTheDocument();
  });

  it('handles null price safely', () => {
    const noPriceItem = { ...mockItem, basePriceCents: null };
    render(<MenuItemCard item={noPriceItem} />);
    expect(screen.getByText(formatPriceCents(null))).toBeInTheDocument();
  });
});
