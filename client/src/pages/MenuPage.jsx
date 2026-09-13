import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import LocationDisplay from '../components/LocationDisplay';
import MenuSearchFilter from '../components/MenuSearchFilter';
import CategoryNavigation from '../components/CategoryNavigation';
import MenuSection from '../components/MenuSection';
import MenuItemPopup from '../components/MenuItemPopup';
import RestaurantInfo from '../components/RestaurantInfo';
import Footer from '../components/Footer';
import DevelopmentStatus from '../components/DevelopmentStatus';
import LogoIntro from '../components/LogoIntro';
import SamosaIllustration from '../components/SamosaIllustration';
import { fetchMenu } from '../services/menuService';
import { useCategoryScroll } from '../hooks/useCategoryScroll';

const MenuPage = () => {
  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItemData, setSelectedItemData] = useState(null);
  const lastFocusedRef = useRef(null);

  const loadMenu = async (signal) => {
    try {
      setLoading(true);
      const data = await fetchMenu({ signal });
      setMenuData(data);
      setError(null);
    } catch (err) {
      if (err.name === 'AbortError') return;
      if (err.message && err.message.includes('Too many requests')) {
        setError(err.message);
      } else {
        setError(err.message || 'Failed to load menu');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    loadMenu(controller.signal);
    return () => controller.abort();
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const { filteredCategories, totalItems, visibleItems } = React.useMemo(() => {
    if (!menuData || !menuData.categories) return { filteredCategories: [], totalItems: 0, visibleItems: 0 };
    
    let tItems = 0;
    let vItems = 0;
    const query = searchQuery.toLowerCase().trim();

    const result = menuData.categories.map(category => {
      tItems += category.items.length;
      
      const filteredItems = category.items.filter(item => {
        let matchesSearch = true;
        if (query) {
          const nameMatch = item.name.toLowerCase().includes(query);
          const descMatch = (item.description || '').toLowerCase().includes(query);
          const catMatch = category.name.toLowerCase().includes(query);
          matchesSearch = nameMatch || descMatch || catMatch;
        }

        let matchesFilter = true;
        if (activeFilter !== 'all') {
          if (activeFilter === 'spicy') {
            matchesFilter = item.spicy === true;
          } else if (activeFilter === 'houseFavorite') {
            matchesFilter = item.dietary && item.dietary.some(d => d.toLowerCase() === 'housefavorite' || d.toLowerCase() === 'house-favorite');
          } else {
            matchesFilter = item.dietary && item.dietary.some(d => d.toLowerCase() === activeFilter.toLowerCase());
          }
        }

        const isMatch = matchesSearch && matchesFilter;
        if (isMatch) vItems++;
        return isMatch;
      });

      return { ...category, items: filteredItems };
    }).filter(category => category.items.length > 0);

    return { filteredCategories: result, totalItems: tItems, visibleItems: vItems };
  }, [menuData, searchQuery, activeFilter]);

  const { activeCategoryId, handleCategoryClick } = useCategoryScroll(
    filteredCategories,
    loading,
    error
  );

  const handleItemSelect = (item, categoryName, event) => {
    lastFocusedRef.current = event?.currentTarget || document.activeElement;
    setSelectedItemData({ item, category: categoryName });
  };

  const closePopup = () => {
    setSelectedItemData(null);
    if (lastFocusedRef.current) {
      setTimeout(() => {
        lastFocusedRef.current?.focus();
      }, 0);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white relative">
      <LogoIntro />
      <Header 
        categories={!loading && !error ? menuData?.categories : []}
        activeCategoryId={activeCategoryId}
        onCategoryClick={handleCategoryClick}
      />
      <LocationDisplay location="Culver City" />
      
      <HeroSection />

      {!loading && !error && menuData?.categories?.length > 0 && (
        <>
          <MenuSearchFilter 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            totalItems={totalItems}
            visibleItems={visibleItems}
          />
          <CategoryNavigation 
            categories={filteredCategories}
            activeCategoryId={activeCategoryId}
            onCategoryClick={handleCategoryClick}
          />
        </>
      )}

      <main className="flex-grow w-full max-w-4xl mx-auto px-4 py-8 sm:px-6 z-10 relative">
        {menuData?.isProvisional && (<div className="mb-8 bg-amber-50 border-l-4 border-amber-500 p-4 rounded text-amber-800 text-sm font-medium shadow-sm">Menu items and prices are being confirmed and may vary by location.</div>)}

        {loading && (
          <div className="flex flex-col items-center justify-center py-12" role="status" aria-label="Loading menu">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-brand-saffron rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading menu...</p>
          </div>
        )}

        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-lg mx-auto bg-[#fffbf0] rounded-3xl border border-gray-100 my-8 shadow-sm">
            <div className="mb-6 w-32 h-32 sm:w-48 sm:h-48 mx-auto">
              <SamosaIllustration />
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mb-3">Our menu is taking a little longer.</h2>
            <p className="text-gray-600 mb-8 text-base sm:text-lg">We couldn’t load the menu. Please try again.</p>
            <button 
              onClick={() => { setError(null); setLoading(true); loadMenu(); }}
              disabled={loading}
              className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-white transition-all bg-brand-dark-red border border-transparent rounded-xl hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-dark-red shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
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

        {!loading && !error && menuData?.categories?.length > 0 && filteredCategories.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100 my-8">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No matching items found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filters to find what you're looking for.</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveFilter('all'); }}
              className="inline-flex items-center gap-2 px-6 py-2 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-saffron focus:ring-offset-2"
            >
              Clear Filters
            </button>
          </div>
        )}

        {!loading && !error && filteredCategories.map(section => (
          <MenuSection 
            key={section.id} 
            id={`category-${section.id}`} 
            category={section.name} 
            items={section.items} 
            onItemSelect={handleItemSelect}
          />
        ))}
      </main>

      <RestaurantInfo />

      <Footer />
      <DevelopmentStatus />

      {selectedItemData && (
        <MenuItemPopup 
          item={selectedItemData.item} 
          category={selectedItemData.category} 
          onClose={closePopup} 
        />
      )}
    </div>
  );
};

export default MenuPage;
