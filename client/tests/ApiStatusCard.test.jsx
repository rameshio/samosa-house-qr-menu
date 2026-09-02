import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import ApiStatusCard from '../src/components/ApiStatusCard';
import * as statusService from '../src/services/statusService';

vi.mock('../src/services/statusService');

describe('ApiStatusCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays loading state initially', () => {
    statusService.fetchStatus.mockImplementation(() => new Promise(() => {})); // Never resolves
    render(<ApiStatusCard />);
    expect(screen.getByText(/Checking backend connection.../i)).toBeInTheDocument();
  });

  it('displays successful connection', async () => {
    statusService.fetchStatus.mockResolvedValue({ success: true, message: 'Samosa House API is running' });
    render(<ApiStatusCard />);
    
    await waitFor(() => {
      expect(screen.getByText('Backend connected')).toBeInTheDocument();
    });
    expect(screen.getByText('Samosa House API is running')).toBeInTheDocument();
  });

  it('displays error state on network failure', async () => {
    statusService.fetchStatus.mockRejectedValue(new Error('Backend unavailable'));
    render(<ApiStatusCard />);
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /backend unavailable/i })).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('handles invalid or malformed API responses as errors', async () => {
    // A malformed response missing success or data
    statusService.fetchStatus.mockRejectedValue(new Error('Unexpected response shape'));
    render(<ApiStatusCard />);
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /backend unavailable/i })).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('triggers another API request on retry', async () => {
    statusService.fetchStatus
      .mockRejectedValueOnce(new Error('Backend unavailable'))
      .mockResolvedValueOnce({ success: true, message: 'Samosa House API is running' });
      
    render(<ApiStatusCard />);
    
    // Wait for error state
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /backend unavailable/i })).toBeInTheDocument();
    });
    
    // Click retry
    fireEvent.click(screen.getByRole('button', { name: /retry/i }));
    
    // Verify loading state appears
    expect(screen.getByText(/Checking backend connection.../i)).toBeInTheDocument();
    
    // Verify success state follows
    await waitFor(() => {
      expect(screen.getByText('Backend connected')).toBeInTheDocument();
    });
    expect(statusService.fetchStatus).toHaveBeenCalledTimes(2);
  });
});
