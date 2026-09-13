import React from 'react';

const DietaryBadge = ({ type }) => {
  const normalizedType = type.toLowerCase();
  
  if (normalizedType === 'vegan') {
    return (
      <span 
        className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-md bg-[#eef7ed] text-[#1e5128] border border-[#c1e1c1]"
        title="Vegan"
      >
        <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66l.95-2.3c3.47.5 7.1-.73 9.49-3.23c2.72-2.85 3.32-7.11 3.22-11.22c-1.12.39-2.22.8-3.37 1.15V8zM14.28 14.79c-1.7 1.78-4.22 2.5-6.53 2.1l1.55-3.75c1.47-1.15 3.3-1.63 5.15-1.3c.09 1.05-.08 2.13-.67 2.95z"/>
        </svg>
        Vegan
      </span>
    );
  }

  if (normalizedType === 'glutenfree' || normalizedType === 'gluten-free') {
    return (
      <span 
        className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-md bg-blue-50 text-blue-800 border border-blue-200"
        title="Gluten-Free"
      >
        <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
        Gluten-Free
      </span>
    );
  }

  if (normalizedType === 'spicy') {
    return (
      <span 
        className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-md bg-red-50 text-red-800 border border-red-200"
        title="Spicy"
      >
        <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
        </svg>
        Spicy
      </span>
    );
  }

  if (normalizedType === 'housefavorite' || normalizedType === 'house-favorite') {
    return (
      <span 
        className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-md bg-amber-50 text-amber-800 border border-amber-200"
        title="House Favorite"
      >
        <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        House Favorite
      </span>
    );
  }

  if (normalizedType === 'vegetarian') {
    return (
      <span 
        className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200"
        title="Vegetarian"
      >
        <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
        Vegetarian
      </span>
    );
  }

  if (normalizedType === 'ask') {
    return (
      <span 
        className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-md bg-gray-50 text-gray-500 border border-gray-200"
        title="Ask about ingredients"
      >
        <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Ask about ingredients
      </span>
    );
  }

  const badgeStyles = {
    dairyfree: "bg-blue-100 text-blue-800 border-blue-200"
  };

  const style = badgeStyles[normalizedType] || "bg-gray-100 text-gray-800 border-gray-200";

  return (
    <span 
      className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-md border ${style}`}
      title={type}
    >
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
};

export default DietaryBadge;