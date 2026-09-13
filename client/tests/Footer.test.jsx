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
    
    // Ensure the new static text is present
    expect(screen.getByText(/EST\. 1979/i)).toBeInTheDocument();
    expect(screen.getByText(/11510 W Washington Blvd/i)).toBeInTheDocument();
    expect(screen.getByText(/\(310\) 398-6766/i)).toBeInTheDocument();
  });
});
