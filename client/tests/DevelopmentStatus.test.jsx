import React from 'react';
import { render, screen } from '@testing-library/react';
import DevelopmentStatus from '../src/components/DevelopmentStatus';
import { vi } from 'vitest';

vi.mock('../src/components/ApiStatusCard', () => ({
  default: () => <div data-testid="mock-api-status" />
}));

describe('DevelopmentStatus', () => {
  it('appears when DEV is true', () => {
    // Mock import.meta.env.DEV getter safely
    vi.stubEnv('DEV', true);
    
    // Actually Vitest sets DEV=true by default in tests, but let's test normally
    render(<DevelopmentStatus />);
    expect(screen.getByTestId('dev-status')).toBeInTheDocument();
  });
  
  // Note: changing DEV mode safely dynamically during vitest runtime can be tricky 
  // because it's statically replaced by Vite. But let's verify it renders.
});