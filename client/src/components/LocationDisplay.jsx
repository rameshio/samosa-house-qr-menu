import React from 'react';

const LocationDisplay = ({ location = "Culver City" }) => {
  return (
    <section className="bg-brand-heritage-green text-white py-2 px-6 text-center text-sm font-medium">
      <p>Currently viewing menu for: <span className="font-bold">{location}</span></p>
    </section>
  );
};

export default LocationDisplay;