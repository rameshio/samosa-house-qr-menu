import React from 'react';
import MenuItemCard from './MenuItemCard';

const MenuSection = ({ id, category, items }) => {
  return (
    <section 
      id={id} 
      className="mb-14" 
      style={{ scrollMarginTop: 'calc(var(--mobile-header-height, 64px) + var(--category-nav-height, 48px) + 16px)' }}
    >
      <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6 pb-2 border-b-2 border-brand-saffron/30">
        {category}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {items.map(item => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};

export default MenuSection;
