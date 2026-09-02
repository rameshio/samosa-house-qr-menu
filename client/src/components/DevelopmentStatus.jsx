import React from 'react';
import ApiStatusCard from './ApiStatusCard';

const DevelopmentStatus = () => {
  if (!import.meta.env.DEV) return null;

  return (
    <div className="mt-12 p-4 bg-gray-50 border-t-2 border-dashed border-gray-300" data-testid="dev-status">
      <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest text-center mb-4">
        Development Diagnostics
      </h3>
      <ApiStatusCard />
    </div>
  );
};

export default DevelopmentStatus;