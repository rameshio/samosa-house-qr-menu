import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 px-6 text-center mt-auto">
      <div className="max-w-4xl mx-auto">
        <div className="font-serif text-xl sm:text-2xl font-semibold tracking-wide text-brand-saffron mx-auto mb-2 text-center">
          Samosa House
        </div>
        <p className="text-gray-400 text-sm mb-4">Authentic Indian Cuisine • 100% Vegetarian Options</p>
        <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} Samosa House. All rights reserved.</p>
        <p className="text-xs text-gray-600 mt-2 italic">Temporary Contact Information</p>
      </div>
    </footer>
  );
};

export default Footer;