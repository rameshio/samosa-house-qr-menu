import React, { useEffect, useRef } from 'react';
import DietaryBadge from './DietaryBadge';
import { formatPriceCents } from '../utils/formatters';

const MenuItemPopup = ({ item, category, onClose }) => {
  const popupRef = useRef(null);
  const closeBtnRef = useRef(null);
  const [imgError, setImgError] = React.useState(false);

  // Trap focus and close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      
      // Simple focus trap
      if (e.key === 'Tab' && popupRef.current) {
        const focusableElements = popupRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    // Focus the close button when mounted
    if (closeBtnRef.current) {
      closeBtnRef.current.focus();
    }

    // Lock background scroll
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!item) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4 sm:p-6"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={item.name}
    >
      <div 
        ref={popupRef}
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[100dvh] md:max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative transform transition-all"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Close Button */}
        <button
          ref={closeBtnRef}
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-10 h-10 flex items-center justify-center bg-black/50 text-white rounded-full hover:bg-black/70 focus:outline-none focus:ring-4 focus:ring-brand-saffron backdrop-blur-md transition-colors"
          aria-label="Close details"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {/* Image Area */}
        <div className="flex-shrink-0 relative w-full h-56 sm:h-72 bg-gray-50 flex items-center justify-center overflow-hidden border-b border-gray-100">
          {item.image && !imgError ? (
            <img 
              src={item.image} 
              alt={item.name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <svg className="w-16 h-16 opacity-30 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
            </svg>
          )}
        </div>

        {/* Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8">
          <div className="mb-2">
            <span className="text-xs sm:text-sm font-bold tracking-wider text-gray-500 uppercase">{category}</span>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 leading-tight">
              {item.name}
            </h2>
            <span className={`text-xl sm:text-2xl font-bold whitespace-nowrap shrink-0 ${item.basePriceCents === null ? 'text-gray-500 text-lg' : 'text-brand-saffron'}`}>
              {formatPriceCents(item.basePriceCents)}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {item.spicy && <DietaryBadge type="spicy" />}
            {item.dietary && item.dietary.map(d => <DietaryBadge key={d} type={d} />)}
            {(!item.dietary || item.dietary.filter(d => ['vegan', 'glutenfree', 'dairyfree'].includes(d.toLowerCase())).length === 0) && (
              <DietaryBadge type="ask" />
            )}
            {!item.available && (
              <span className="inline-block px-2 py-1 text-xs font-bold rounded-md bg-gray-200 text-gray-700 uppercase tracking-wide">
                Unavailable
              </span>
            )}
          </div>

          <div className="border-t border-gray-100 pt-6">
            <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
              {item.description ? item.description : "Description coming soon."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemPopup;
