import React from 'react';
import DietaryBadge from './DietaryBadge';
import { formatPriceCents } from '../utils/formatters';

const MenuItemCard = ({ item }) => {
  const { name, description, basePriceCents, spicy, dietary, available, image } = item;

  const [imgError, setImgError] = React.useState(false);

  return (
    <article className={`flex flex-col sm:flex-row bg-white/95 border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-xl overflow-hidden supports-[backdrop-filter:blur(1px)]:bg-white/90 ${!available ? 'opacity-60 grayscale' : ''}`}>
      {/* Image or Fallback */}
      <div className="w-full aspect-[4/3] sm:w-32 sm:aspect-auto sm:h-auto shrink-0 bg-gray-100 flex items-center justify-center text-gray-400">
        {image && !imgError ? (
          <img 
            src={image} 
            alt={name} 
            loading="lazy"
            decoding="async"
            onError={() => setImgError(true)}
            className="w-full h-full object-contain sm:object-cover" 
          />
        ) : (
          <svg className="w-12 h-12 opacity-50" fill="currentColor" viewBox="0 0 24 24" data-testid="fallback-svg">
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
          </svg>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1 gap-2">
          <h3 className="font-serif font-bold text-gray-900 text-xl leading-tight">{name}</h3>
          <span className={`font-bold whitespace-nowrap ${basePriceCents === null ? 'text-gray-500 font-medium text-sm mt-1' : 'text-brand-saffron'}`}>
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
