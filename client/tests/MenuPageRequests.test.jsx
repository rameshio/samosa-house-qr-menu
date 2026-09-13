import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { test, expect, vi, beforeEach } from 'vitest';
import MenuPage from '../src/pages/MenuPage';
import * as menuService from '../src/services/menuService';

vi.mock('../src/components/LogoIntro', () => ({ default: () => null }));
vi.mock('../src/components/Header', () => ({ default: () => null }));
vi.mock('../src/components/HeroSection', () => ({ default: () => null }));
vi.mock('../src/components/Footer', () => ({ default: () => null }));
vi.mock('../src/components/LocationDisplay', () => ({ default: () => null }));
vi.mock('../src/components/CategoryNavigation', () => ({ default: () => null }));
vi.mock('../src/components/MenuSection', () => ({ default: () => null }));
vi.mock('../src/components/DevelopmentStatus', () => ({ default: () => null }));

const mockFetchMenu = vi.spyOn(menuService, 'fetchMenu');

beforeEach(() => {
  mockFetchMenu.mockClear();
});

test('Public menu initialization makes one logical menu request', async () => {
  mockFetchMenu.mockResolvedValueOnce({ categories: [], isProvisional: false });
  const { unmount } = render(<MenuPage />);
  await waitFor(() => expect(mockFetchMenu).toHaveBeenCalledTimes(1));
  unmount();
});

test('Retry initiates exactly one additional request', async () => {
  mockFetchMenu.mockRejectedValueOnce(new Error('Failed to load menu'));
  const { unmount } = render(<MenuPage />);
  
  await waitFor(() => screen.getByText('Retry'));
  expect(mockFetchMenu).toHaveBeenCalledTimes(1);
  
  mockFetchMenu.mockResolvedValueOnce({ categories: [], isProvisional: false });
  fireEvent.click(screen.getByText('Retry'));
  
  await waitFor(() => expect(mockFetchMenu).toHaveBeenCalledTimes(2));
  unmount();
});

test('A 429 response is not automatically retried and handles error message', async () => {
  mockFetchMenu.mockRejectedValueOnce(new Error('Too many requests. Please try again in 5 seconds.'));
  const { unmount } = render(<MenuPage />);
  
  await waitFor(() => screen.getByText(/Too many requests/i));
  expect(mockFetchMenu).toHaveBeenCalledTimes(1);
  unmount();
});
