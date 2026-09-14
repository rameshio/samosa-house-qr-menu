import React, { useState } from 'react';
import { CategoryIcon } from './icons/CategoryIcon';

const PressableCategoryButton = ({ 
  category, 
  isActive, 
  onClick, 
  isDrawer = false 
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    setIsPressed(true);
  };
  
  const handlePointerUp = () => setIsPressed(false);
  const handlePointerCancel = () => setIsPressed(false);
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setIsPressed(true);
    }
  };
  
  const handleKeyUp = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setIsPressed(false);
    }
  };

  // Base layout styles for the outer button (defines focus and touch target)
  const outerClasses = isDrawer 
    ? 'w-full block text-left rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-saffron group'
    : 'block shrink-0 mx-1 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-saffron group';

  // Styles for the inner animated layer
  const innerBase = 'transition-all duration-150 ease-out flex items-center ' + 
    (isDrawer ? 'gap-3 px-4 py-3 rounded-xl' : 'gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full');

  const activeStyles = isActive 
    ? (isDrawer ? 'bg-brand-saffron text-white shadow-sm' : `bg-brand-saffron text-white shadow-md ${isPressed ? '' : 'scale-105'}`) 
    : (isDrawer ? 'text-gray-700 group-hover:bg-gray-50 group-hover:text-gray-900' : 'bg-gray-50 text-gray-700 group-hover:bg-gray-100');

  // Apply visual feedback when pressed
  const pressedStyles = isPressed 
    ? `scale-[0.96] shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)] motion-reduce:scale-100 ${!isActive ? 'bg-orange-50 text-brand-dark-red' : ''}`
    : '';

  return (
    <button
      data-id={isDrawer ? undefined : `cat-tab-${category.id}`}
      onClick={onClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onPointerLeave={handlePointerCancel}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      className={outerClasses}
      aria-current={isActive ? 'page' : undefined}
      style={{ touchAction: 'pan-x pan-y', WebkitTapHighlightColor: 'transparent' }}
    >
      <div className={`${innerBase} ${activeStyles} ${pressedStyles}`}>
        <CategoryIcon 
          category={category.name} 
          className={isDrawer ? 'w-5 h-5 shrink-0 opacity-80' : 'w-4 h-4'} 
        />
        <span className={isDrawer ? 'font-medium' : 'text-sm font-bold'}>
          {category.name}
        </span>
      </div>
    </button>
  );
};

export default PressableCategoryButton;
