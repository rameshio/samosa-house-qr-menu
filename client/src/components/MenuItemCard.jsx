import React from 'react';
import DietaryBadge from './DietaryBadge';
import { formatPriceCents } from '../utils/formatters';
import MenuCardBorder from './MenuCardBorder';

const MenuItemCard = ({ item }) => {
  const { name, description, basePriceCents, spicy, dietary, available, image } = item;

  const [imgError, setImgError] = React.useState(false);

  return (
    <MenuCardBorder className={`supports-[backdrop-filter:blur(1px)]:bg-white/90 ${!available ? 'opacity-60 grayscale' : ''}`}>
      {/* Image or Fallback */}
      <div className="w-full aspect-[4/3] shrink-0 bg-gray-50 flex items-center justify-center text-gray-400 relative">
        {image && !imgError ? (
          <img 
            src={image} 
            alt={name} 
            loading="lazy"
            decoding="async"
            onError={() => setImgError(true)}
            className="w-full h-full object-contain" 
          />
        ) : (
          <svg className="w-10 h-10 opacity-50" fill="currentColor" viewBox="0 0 24 24" data-testid="fallback-svg">
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
          </svg>
        )}
      </div>

      <div className="p-2.5 sm:p-3 flex flex-col flex-grow">
        <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto] items-start mb-1.5 gap-1 sm:gap-2">
          <h3 className="font-serif font-bold text-gray-900 text-sm sm:text-base leading-tight line-clamp-2" title={name}>{name}</h3>
          <span className={`font-bold whitespace-nowrap text-sm sm:text-base ${basePriceCents === null ? 'text-gray-500 font-medium text-xs mt-0.5' : 'text-brand-saffron'}`}>
            {formatPriceCents(basePriceCents)}
          </span>
        </div>
        
        {description && (
          <p className="text-gray-600 text-xs sm:text-sm mb-3 flex-grow line-clamp-2" title={description}>{description}</p>
        )}
        {!description && <div className="flex-grow"></div>}
        
        {/* Badges */}
        <div className="flex flex-wrap gap-1 mt-auto">
          {spicy && <DietaryBadge type="spicy" />}
          {dietary && dietary.map(d => (
            <DietaryBadge key={d} type={d} />
          ))}
          {!available && (
            <span className="inline-block px-1.5 py-0.5 text-[10px] sm:text-xs font-bold rounded bg-gray-200 text-gray-600 uppercase tracking-wide">
              Unavailable
            </span>
          )}
        </div>
      </div>
    </MenuCardBorder>
  );
};

export default MenuItemCard;
