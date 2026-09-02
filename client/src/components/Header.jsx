import React, { useState } from 'react';

const Header = () => {
  const [imageError, setImageError] = useState(false);

  return (
    <header className="bg-brand-saffron py-4 px-6 shadow-sm sticky top-0 z-40">
      <div className="max-w-4xl mx-auto flex items-center justify-center">
        {!imageError ? (
          <img 
            src="/images/brand/samosa-house-logo.png" 
            alt="Samosa House" 
            onError={() => setImageError(true)}
            className="h-8 sm:h-12 w-auto object-contain max-w-full"
          />
        ) : (
          <h1 className="text-2xl font-extrabold text-brand-dark-red tracking-tight">
            Samosa House
          </h1>
        )}
      </div>
    </header>
  );
};

export default Header;