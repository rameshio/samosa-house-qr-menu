import React from 'react';
import { Link } from 'react-router-dom';
import SamosaIllustration from '../components/SamosaIllustration';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#fffbf0]">
      <header className="bg-white/85 backdrop-blur-md border-b border-gray-200 shadow-sm py-3 sm:py-4 px-6 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-center">
          <Link to="/" className="flex flex-col items-center focus:outline-none focus:ring-2 focus:ring-brand-saffron rounded-lg px-2 py-1 transition-opacity hover:opacity-80">
            <span className="text-2xl font-extrabold text-brand-dark-red tracking-tight">
              Samosa House
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.2em] text-gray-500 mt-1">EST. 1979 • CULVER CITY</span>
          </Link>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto w-full">
        <div className="mb-6 w-48 h-48 sm:w-64 sm:h-64 mx-auto">
          <SamosaIllustration />
        </div>
        
        <h1 className="text-brand-saffron font-bold tracking-widest text-sm sm:text-base uppercase mb-3">404</h1>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-4 leading-tight">
          This dish isn’t on the menu.
        </h2>
        <p className="text-gray-600 mb-8 text-lg">
          The page you’re looking for may have moved.
        </p>
        
        <Link 
          to="/" 
          className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-white transition-all bg-brand-dark-red border border-transparent rounded-xl hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-dark-red shadow-md"
        >
          Back to Menu
        </Link>
      </main>
    </div>
  );
};

export default NotFoundPage;
