import React from 'react';
import MenuItemCard from './MenuItemCard';

const MenuSection = ({ category, items }) => {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-brand-saffron">
        {category}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map(item => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};

export default MenuSection;