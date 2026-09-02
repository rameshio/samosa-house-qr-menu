import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const files = {
  'client/src/utils/formatters.js': `
const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
});

export const formatPriceCents = (cents) => {
  if (typeof cents !== 'number' || cents < 0) return '$0.00';
  return usdFormatter.format(cents / 100);
};
`,
  'client/src/services/menuService.js': `
import { fetchWrapper } from './apiClient';

export const fetchMenu = async () => {
  try {
    const data = await fetchWrapper('/api/menu');
    
    if (data && data.success && data.data) {
      return data.data; // This is the menu structure
    }
    
    throw new Error('Unexpected response shape');
  } catch (error) {
    if (error.message === 'Unexpected response shape') {
      throw error;
    }
    throw new Error('Network failure');
  }
};
`,
  'client/src/components/MenuItemCard.jsx': `
import React from 'react';
import DietaryBadge from './DietaryBadge';
import { formatPriceCents } from '../utils/formatters';

const MenuItemCard = ({ item }) => {
  const { name, description, basePriceCents, spicy, dietary, available, image } = item;

  return (
    <article className={\`flex flex-col sm:flex-row bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden \${!available ? 'opacity-60 grayscale' : ''}\`}>
      {/* Image or Fallback */}
      <div className="w-full sm:w-32 h-40 sm:h-auto shrink-0 bg-brand-saffron flex items-center justify-center text-brand-dark-red">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <svg className="w-12 h-12 opacity-50" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
          </svg>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1 gap-2">
          <h3 className="font-bold text-gray-900 text-lg leading-tight">{name}</h3>
          <span className="font-bold text-brand-heritage-green whitespace-nowrap">
            {formatPriceCents(basePriceCents)}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 flex-grow">{description}</p>
        
        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {spicy && <DietaryBadge type="spicy" />}
          {dietary && dietary.map(d => (
            <DietaryBadge key={d} type={d} />
          ))}
          {!available && (
            <span className="inline-block px-2 py-0.5 text-xs font-bold rounded bg-gray-200 text-gray-600">
              Unavailable
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

export default MenuItemCard;
`,
  'client/src/pages/MenuPage.jsx': `
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import LocationDisplay from '../components/LocationDisplay';
import MenuSection from '../components/MenuSection';
import Footer from '../components/Footer';
import DevelopmentStatus from '../components/DevelopmentStatus';
import { fetchMenu } from '../services/menuService';

const MenuPage = () => {
  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadMenu = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMenu();
      setMenuData(data);
    } catch (err) {
      setError(err.message || 'Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenu();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <LocationDisplay location="Culver City" />
      
      <main className="flex-grow w-full max-w-4xl mx-auto px-4 py-8 sm:px-6">
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Our Menu</h1>
          <p className="text-gray-600 text-sm max-w-2xl">
            Welcome to Samosa House. Enjoy our selection of authentic Indian dishes prepared fresh daily.
          </p>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-12" role="status" aria-label="Loading menu">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-brand-saffron rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading menu...</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center text-brand-dark-red my-8">
            <h2 className="text-xl font-bold mb-2">Unable to load menu</h2>
            <p className="mb-4 text-sm text-red-700">Please check your connection and try again.</p>
            <button 
              onClick={loadMenu}
              className="px-6 py-2 bg-brand-dark-red text-white font-semibold rounded hover:bg-red-800 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && menuData?.categories?.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>Our menu is currently empty. Please check back later.</p>
          </div>
        )}

        {!loading && !error && menuData?.categories?.map(section => (
          <MenuSection key={section.id} category={section.name} items={section.items} />
        ))}
      </main>

      <Footer />
      <DevelopmentStatus />
    </div>
  );
};

export default MenuPage;
`,
  'client/tests/MenuPage.test.jsx': `
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

  it('renders successful menu and categories', async () => {
    menuService.fetchMenu.mockResolvedValue({
      categories: [
        { id: "c1", name: "Appetizers", items: [
          { id: "i1", name: "Samosa", basePriceCents: 499, description: "Desc", available: true }
        ]}
      ]
    });
    
    render(<MenuPage />);
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Appetizers' })).toBeInTheDocument();
    });
    expect(screen.getByText('Samosa')).toBeInTheDocument();
    expect(screen.getByText('$4.99')).toBeInTheDocument();
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
`,
  'client/tests/MenuItemCard.test.jsx': `
import React from 'react';
import { render, screen } from '@testing-library/react';
import MenuItemCard from '../src/components/MenuItemCard';

describe('MenuItemCard', () => {
  const mockItem = {
    id: "v-samosa",
    name: "Vegetable Samosa",
    description: "Crispy pastry filled with spiced potatoes.",
    basePriceCents: 499,
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

  it('renders missing image fallback', () => {
    const { container } = render(<MenuItemCard item={mockItem} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders unavailable items with visible text indicating unavailability', () => {
    const unavailableItem = { ...mockItem, available: false };
    render(<MenuItemCard item={unavailableItem} />);
    expect(screen.getByText('Unavailable')).toBeInTheDocument();
  });
});
`
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(rootDir, filePath);
  const dirPath = path.dirname(fullPath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  fs.writeFileSync(fullPath, content.trim());
}
console.log('Frontend API integration generated.');
