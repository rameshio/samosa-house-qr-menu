import React from 'react';

const HeroSection = () => {
  return (
    <div className="relative w-full overflow-hidden">
      <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-12 pb-4 sm:pb-8 flex flex-col md:flex-row items-center gap-8 z-10">
      <div className="flex-1 text-center md:text-left">
        <h1 className="text-4xl sm:text-6xl font-serif font-bold text-gray-900 mb-4 leading-tight">
          Authentic Flavors, <br/><span className="text-brand-saffron italic">Crafted Daily.</span>
        </h1>
        <p className="text-gray-700 sm:text-lg max-w-lg mx-auto md:mx-0">
          Welcome to Samosa House. Experience our vibrant selection of traditional Indian dishes, freshly prepared with time-honored spices.
        </p>
      </div>
      <div className="hidden md:flex flex-1 justify-center relative">
        {/* Subtle decorative glow behind image */}
        <div className="absolute inset-0 bg-brand-saffron/10 rounded-full blur-3xl filter transform scale-75"></div>
        <img 
          src="/images/menu-west-v2/samosa-chaat.webp" 
          alt="Authentic Samosa Chaat"
          className="w-full max-w-md rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] object-cover aspect-[4/3] relative z-10"
        />
      </div>
      </div>
    </div>
  );
};

export default HeroSection;
