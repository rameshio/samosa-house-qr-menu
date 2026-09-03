import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Footer from '../src/components/Footer';

describe('Footer', () => {
  it('renders semantic text wordmark instead of the logo image', () => {
    render(<Footer />);
    
    // Check that the semantic wordmark text is rendered
    const wordmark = screen.getByText('Samosa House', { selector: 'div.font-serif' });
    expect(wordmark).toBeInTheDocument();
    
    // Check that the logo image is no longer rendered
    const logoImg = screen.queryByRole('img', { name: /samosa house/i });
    expect(logoImg).not.toBeInTheDocument();
    
    // Ensure the other static text is still present
    expect(screen.getByText(/Authentic Indian Cuisine/i)).toBeInTheDocument();
    expect(screen.getByText(/100% Vegetarian Options/i)).toBeInTheDocument();
    expect(screen.getByText(/Temporary Contact Information/i)).toBeInTheDocument();
  });
});
