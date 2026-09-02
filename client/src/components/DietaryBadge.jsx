import React from 'react';

const DietaryBadge = ({ type }) => {
  const badgeStyles = {
    vegan: "bg-green-100 text-green-800 border-green-200",
    vegetarian: "bg-emerald-100 text-emerald-800 border-emerald-200",
    glutenFree: "bg-amber-100 text-amber-800 border-amber-200",
    spicy: "bg-red-100 text-red-800 border-red-200"
  };

  const style = badgeStyles[type] || "bg-gray-100 text-gray-800 border-gray-200";

  return (
    <span 
      className={`inline-block px-2 py-0.5 text-xs font-semibold rounded border ${style}`}
      title={type}
    >
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
};

export default DietaryBadge;