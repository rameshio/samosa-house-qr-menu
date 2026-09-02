import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 px-6 text-center mt-auto">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-brand-saffron mb-2">Samosa House</h2>
        <p className="text-gray-400 text-sm mb-4">Authentic Indian Cuisine • 100% Vegetarian Options</p>
        <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} Samosa House. All rights reserved.</p>
        <p className="text-xs text-gray-600 mt-2 italic">Temporary Contact Information</p>
      </div>
    </footer>
  );
};

export default Footer;