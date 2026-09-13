import React from 'react';

const MenuSearchFilter = ({ 
  searchQuery, 
  setSearchQuery, 
  activeFilter, 
  setActiveFilter, 
  totalItems, 
  visibleItems 
}) => {
  const filters = [
    { id: 'all', label: 'All Items' },
    { id: 'houseFavorite', label: 'House Favorites', icon: (
      <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    )},
    { id: 'vegan', label: 'Vegan', icon: (
      <svg className="w-4 h-4 text-[#1e5128]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66l.95-2.3c3.47.5 7.1-.73 9.49-3.23c2.72-2.85 3.32-7.11 3.22-11.22c-1.12.39-2.22.8-3.37 1.15V8zM14.28 14.79c-1.7 1.78-4.22 2.5-6.53 2.1l1.55-3.75c1.47-1.15 3.3-1.63 5.15-1.3c.09 1.05-.08 2.13-.67 2.95z"/>
      </svg>
    )},
    { id: 'glutenFree', label: 'Gluten-Free', icon: (
      <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    )},
    { id: 'spicy', label: 'Spicy', icon: (
      <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
      </svg>
    )}
  ];

  const handleReset = () => {
    setSearchQuery('');
    setActiveFilter('all');
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-4 pt-8 pb-4 sm:px-6">
      
      {/* Search Input */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-saffron focus:border-brand-saffron focus:bg-white transition-colors sm:text-sm text-gray-900"
          placeholder="Search appetizers, chaat, dosas, drinks…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label="Clear search"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {filters.map((filter) => {
          const isActive = activeFilter === filter.id;
          return (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-saffron ${
                isActive 
                  ? 'bg-gray-900 text-white shadow-sm' 
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
              aria-pressed={isActive}
            >
              {filter.icon}
              {filter.label}
            </button>
          );
        })}
        
        {(searchQuery || activeFilter !== 'all') && (
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-saffron"
          >
            Reset
          </button>
        )}
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-500">
        Showing {visibleItems} of {totalItems} items
      </div>

    </section>
  );
};

export default MenuSearchFilter;
