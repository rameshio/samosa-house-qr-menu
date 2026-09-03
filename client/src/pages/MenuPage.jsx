import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import LocationDisplay from '../components/LocationDisplay';
import CategoryNavigation from '../components/CategoryNavigation';
import MenuSection from '../components/MenuSection';
import Footer from '../components/Footer';
import DevelopmentStatus from '../components/DevelopmentStatus';
import LogoIntro from '../components/LogoIntro';
import { fetchMenu } from '../services/menuService';
import { useCategoryScroll } from '../hooks/useCategoryScroll';

const MenuPage = () => {
  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadMenu = async () => {
    try {
      const data = await fetchMenu();
      setMenuData(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    loadMenu();
  }, []);

  const { activeCategoryId, handleCategoryClick } = useCategoryScroll(
    menuData?.categories,
    loading,
    error
  );

  return (
    <div className="min-h-screen flex flex-col bg-marble relative">
      <LogoIntro />
      <Header />
      <LocationDisplay location="Culver City" />
      
      <HeroSection />
      
      {!loading && !error && menuData?.categories?.length > 0 && (
        <CategoryNavigation 
          categories={menuData.categories}
          activeCategoryId={activeCategoryId}
          onCategoryClick={handleCategoryClick}
        />
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
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center text-brand-dark-red my-8">
            <h2 className="text-xl font-bold mb-2">Unable to load menu</h2>
            <p className="mb-4 text-sm text-red-700">Please check your connection and try again.</p>
            <button 
              onClick={() => { setError(null); setLoading(true); loadMenu(); }}
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
          <MenuSection 
            key={section.id} 
            id={`category-${section.id}`} 
            category={section.name} 
            items={section.items} 
          />
        ))}
      </main>

      <Footer />
      <DevelopmentStatus />
    </div>
  );
};

export default MenuPage;
