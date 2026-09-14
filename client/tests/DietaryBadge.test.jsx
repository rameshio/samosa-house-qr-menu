import React from 'react';
import { render, screen } from '@testing-library/react';
import DietaryBadge from '../src/components/DietaryBadge';

describe('DietaryBadge', () => {
  it('renders vegan badge correctly', () => {
    render(<DietaryBadge type="vegan" />);
    expect(screen.getByText('Vegan')).toBeInTheDocument();
  });
});