import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../src/components/Header';

describe('Header', () => {
  it('renders the header with the image logo', () => {
    render(<Header />);
    const img = screen.getByAltText('Samosa House');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/images/brand/samosa-house-logo.png');
  });

  it('renders the fallback text if the image fails to load', () => {
    render(<Header />);
    const img = screen.getByAltText('Samosa House');
    fireEvent.error(img);
    expect(screen.getByRole('heading', { name: 'Samosa House' })).toBeInTheDocument();
  });
});
