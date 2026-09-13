import React from 'react';
import MenuItemCard from './MenuItemCard';
import { CategoryIcon } from './icons/CategoryIcon';

const MenuSection = ({ id, category, items, onItemSelect }) => {
  return (
    <section 
      id={id} 
      className="mb-14" 
      style={{ scrollMarginTop: 'calc(var(--mobile-header-height, 64px) + var(--category-nav-height, 48px) + 16px)' }}
    >
      <div className="flex items-center gap-3 mb-6 pb-2 border-b-[1px] border-brand-saffron/40">
        <CategoryIcon category={category} className="w-8 h-8 text-brand-saffron" />
        <h2 className="text-3xl font-serif font-bold text-gray-900">
          {category}
        </h2>
        <span className="text-sm font-bold text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full ml-auto">
          {items.length}
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {items.map(item => (
          <MenuItemCard 
            key={item.id} 
            item={item} 
            onSelect={(item, e) => onItemSelect && onItemSelect(item, category, e)} 
          />
        ))}
      </div>
    </section>
  );
};

export default MenuSection;
