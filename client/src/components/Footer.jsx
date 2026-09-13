import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 px-6 mt-auto">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        
        {/* Brand & Copyright */}
        <div className="flex flex-col items-center md:items-start">
          <div className="font-serif text-xl sm:text-2xl font-bold tracking-wide text-brand-saffron mb-2">
            Samosa House
          </div>
          <p className="text-gray-400 text-sm mb-4">EST. 1979 • CULVER CITY</p>
          <p className="text-xs text-gray-500 mt-auto">
            &copy; {new Date().getFullYear()} Samosa House.<br/>All rights reserved.
          </p>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col items-center md:items-start text-sm text-gray-300 space-y-2">
          <h4 className="text-white font-bold mb-1">Contact</h4>
          <p>11510 W Washington Blvd<br/>Culver City, CA 90232</p>
          <a href="tel:310-398-6766" className="hover:text-brand-saffron transition-colors">(310) 398-6766</a>
          <a href="mailto:contactus@samosahouse.com" className="hover:text-brand-saffron transition-colors">contactus@samosahouse.com</a>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col items-center md:items-start text-sm text-gray-300 space-y-2">
          <h4 className="text-white font-bold mb-1">Navigation</h4>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="hover:text-brand-saffron transition-colors text-left"
          >
            Home
          </button>
          <button 
            onClick={() => {
              const navOffset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--mobile-header-height') || 64) + parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--category-nav-height') || 48) + 16;
              const menuEl = document.querySelector('main');
              if (menuEl) {
                const scrollPos = menuEl.getBoundingClientRect().top + window.scrollY - navOffset;
                window.scrollTo({ top: scrollPos, behavior: 'smooth' });
              }
            }}
            className="hover:text-brand-saffron transition-colors text-left"
          >
            Menu
          </button>
          <button 
            onClick={() => {
              const navOffset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--mobile-header-height') || 64) + parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--category-nav-height') || 48) + 16;
              const el = document.getElementById('visit-us');
              if (el) {
                const scrollPos = el.getBoundingClientRect().top + window.scrollY - navOffset;
                window.scrollTo({ top: scrollPos, behavior: 'smooth' });
              }
            }}
            className="hover:text-brand-saffron transition-colors text-left"
          >
            Visit Us
          </button>
        </div>

      </div>
    </footer>
  );
};

export default Footer;