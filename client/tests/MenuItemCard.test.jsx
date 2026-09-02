import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MenuItemCard from '../src/components/MenuItemCard';

describe('MenuItemCard', () => {
  const mockItem = {
    id: "v-samosa",
    name: "Vegetable Samosa",
    description: "Crispy pastry filled with spiced potatoes.",
    basePriceCents: 499,
    priceStatus: "confirmed",
    spicy: true,
    dietary: ["vegan"],
    available: true,
    image: null,
  };

  it('renders item name, description, and formatted price from props', () => {
    render(<MenuItemCard item={mockItem} />);
    expect(screen.getByText('Vegetable Samosa')).toBeInTheDocument();
    expect(screen.getByText('Crispy pastry filled with spiced potatoes.')).toBeInTheDocument();
    expect(screen.getByText('$4.99')).toBeInTheDocument();
  });

  it('renders "Price unavailable" and not "$0.00" when price is null', () => {
    const unpricedItem = { ...mockItem, basePriceCents: null, priceStatus: "not-provided" };
    render(<MenuItemCard item={unpricedItem} />);
    expect(screen.getByText('Price unavailable')).toBeInTheDocument();
    expect(screen.queryByText('$0.00')).not.toBeInTheDocument();
  });

  it('renders missing image fallback', () => {
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
    expect(screen.queryByTestId('fallback-svg')).not.toBeInTheDocument();
  });

  it('renders missing image fallback if image errors', () => {
    const imgItem = { ...mockItem, image: '/images/menu/samosa.webp' };
    render(<MenuItemCard item={imgItem} />);
    const img = screen.getByAltText('Vegetable Samosa');
    
    // Simulate error
    fireEvent.error(img);
    
    // Check fallback
    expect(screen.queryByAltText('Vegetable Samosa')).not.toBeInTheDocument();
    expect(screen.getByTestId('fallback-svg')).toBeInTheDocument();
  });

  it('renders unavailable items with visible text indicating unavailability', () => {
    const unavailableItem = { ...mockItem, available: false };
    render(<MenuItemCard item={unavailableItem} />);
    expect(screen.getByText('Unavailable')).toBeInTheDocument();
  });
});