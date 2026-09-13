import React from 'react';

const RestaurantInfo = () => {
  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-12 sm:px-6">
      
      {/* Container with a subtle dividing line from the menu */}
      <div className="border-t border-gray-200 pt-12 space-y-12">
        
        {/* Grid layout for desktop, stacked on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          
          {/* About Section */}
          <div id="about" style={{ scrollMarginTop: 'calc(var(--mobile-header-height, 64px) + var(--category-nav-height, 48px) + 16px)' }}>
            <h3 className="text-xl font-serif font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-brand-saffron rounded-full"></span>
              About the Restaurant
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              Established in 1979, Samosa House is a landmark destination for Indian vegetarian and vegan cuisine in Culver City. We are dedicated to serving traditional favorites including samosas, chaat, dosas, and daily fresh curries.
            </p>
          </div>

          {/* Visit Us Section */}
          <div id="visit-us" style={{ scrollMarginTop: 'calc(var(--mobile-header-height, 64px) + var(--category-nav-height, 48px) + 16px)' }}>
            <h3 className="text-xl font-serif font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-brand-saffron rounded-full"></span>
              Visit Us
            </h3>
            <address className="text-gray-600 not-italic text-sm space-y-3">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 shrink-0 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <div>
                  <span className="block font-medium text-gray-900">Samosa House</span>
                  11510 W Washington Blvd<br/>
                  Culver City, CA 90232<br/>
                  <a 
                    href="https://maps.google.com/?q=11510+W+Washington+Blvd,+Culver+City,+CA+90232" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block mt-1 text-brand-saffron hover:text-orange-600 font-medium transition-colors"
                  >
                    Get Directions →
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-2 pt-2">
                <svg className="w-5 h-5 shrink-0 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Daily, 11:00 AM – 9:30 PM</span>
              </div>
            </address>
          </div>

          {/* Catering Section */}
          <div id="catering" style={{ scrollMarginTop: 'calc(var(--mobile-header-height, 64px) + var(--category-nav-height, 48px) + 16px)' }}>
            <h3 className="text-xl font-serif font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-brand-saffron rounded-full"></span>
              Catering
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm mb-4">
              We do catering! Bring the flavors of Samosa House to your next event. For inquiries, please reach out to us directly.
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 shrink-0 text-brand-saffron" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                <a href="tel:310-398-6766" className="hover:text-brand-saffron transition-colors font-medium text-gray-900">(310) 398-6766</a>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 shrink-0 text-brand-saffron" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <a href="mailto:contactus@samosahouse.com" className="hover:text-brand-saffron transition-colors font-medium text-gray-900">contactus@samosahouse.com</a>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default RestaurantInfo;
