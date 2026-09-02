import React from 'react';
import DietaryBadge from './DietaryBadge';
import { formatPriceCents } from '../utils/formatters';

const MenuItemCard = ({ item }) => {
  const { name, description, basePriceCents, spicy, dietary, available, image } = item;

  const [imgError, setImgError] = React.useState(false);

  return (
    <article className={`flex flex-col sm:flex-row bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden ${!available ? 'opacity-60 grayscale' : ''}`}>
      {/* Image or Fallback */}
      <div className="w-full sm:w-32 h-40 sm:h-auto shrink-0 bg-brand-saffron flex items-center justify-center text-brand-dark-red">
        {image && !imgError ? (
          <img 
            src={image} 
            alt={name} 
            loading="lazy"
            decoding="async"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover" 
          />
        ) : (
          <svg className="w-12 h-12 opacity-50" fill="currentColor" viewBox="0 0 24 24" data-testid="fallback-svg">
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
          </svg>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1 gap-2">
          <h3 className="font-bold text-gray-900 text-lg leading-tight">{name}</h3>
          <span className={`font-bold whitespace-nowrap ${basePriceCents === null ? 'text-gray-500 font-medium text-sm mt-1' : 'text-brand-heritage-green'}`}>
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
