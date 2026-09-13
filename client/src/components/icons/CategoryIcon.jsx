import React from 'react';

export const CategoryIcon = ({ category, className = "w-5 h-5" }) => {
  const iconProps = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  };

  const name = category.toLowerCase();

  if (name.includes('appetizer') || name.includes('samosa')) {
    // Folded samosa (triangle with a fold)
    return (
      <svg {...iconProps} viewBox="0 0 24 24">
        <path d="M12 3L2 20h20L12 3z" />
        <path d="M12 3l5 8-10 1" />
      </svg>
    );
  }
  
  if (name.includes('chaat')) {
    // Bowl with spoon
    return (
      <svg {...iconProps} viewBox="0 0 24 24">
        <path d="M4 12a8 8 0 0016 0H4z" />
        <path d="M15 8l-3 4M18 5c-1.5-1.5-3.5 0-3.5 0s1.5 2 3 3.5c1.5 1.5 3.5 0 3.5 0s-1.5-2-3-3.5z" />
      </svg>
    );
  }

  if (name.includes('combination') || name.includes('thali')) {
    // Divided thali plate
    return (
      <svg {...iconProps} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <circle cx="8" cy="8" r="2.5" />
        <circle cx="16" cy="8" r="2.5" />
        <path d="M4.5 16s3 2 7.5 2 7.5-2 7.5-2" />
      </svg>
    );
  }

  if (name.includes('small plate')) {
    // Small serving dish
    return (
      <svg {...iconProps} viewBox="0 0 24 24">
        <path d="M3 14c0 3.314 4.03 6 9 6s9-2.686 9-6" />
        <path d="M3 14c0-2.5 4-3 9-3s9 .5 9 3" />
      </svg>
    );
  }

  if (name.includes('south indian') || name.includes('dosa')) {
    // Rolled dosa
    return (
      <svg {...iconProps} viewBox="0 0 24 24">
        <path d="M2 14c2-4 6-6 10-6s8 2 10 6c0 2-4 4-10 4S2 16 2 14z" />
        <path d="M4 13c3-3 8-4 12-2" />
      </svg>
    );
  }

  if (name.includes('special')) {
    // Serving dome with small star
    return (
      <svg {...iconProps} viewBox="0 0 24 24">
        <path d="M4 18h16" />
        <path d="M5 16a7 7 0 0114 0H5z" />
        <path d="M10 9h4" />
        <path d="M12 2l1.5 2.5L16 4l-2 2 .5 3-2.5-1-2.5 1 .5-3-2-2 2.5-.5z" strokeWidth="1" />
      </svg>
    );
  }

  if (name.includes('dessert') || name.includes('sweet')) {
    // Indian sweet (diamond Kaju Katli and round Ladoo)
    return (
      <svg {...iconProps} viewBox="0 0 24 24">
        <path d="M12 4l3 5-3 5-3-5 3-5z" />
        <circle cx="16" cy="16" r="3" />
        <circle cx="8" cy="16" r="3" />
      </svg>
    );
  }

  if (name.includes('drink') || name.includes('lassi') || name.includes('chai')) {
    // Steaming cup
    return (
      <svg {...iconProps} viewBox="0 0 24 24">
        <path d="M6 10v6a4 4 0 008 0v-6H6z" />
        <path d="M14 12h2a2 2 0 000-4h-2" />
        <path d="M8 3v3" />
        <path d="M12 3v3" />
      </svg>
    );
  }

  // Fallback (generic fork & knife or plate)
  return (
    <svg {...iconProps} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="6" />
    </svg>
  );
};
