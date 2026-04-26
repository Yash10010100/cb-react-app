import React from 'react';

const colorMap = {
  tech: 'bg-indigo-100 text-indigo-700',
  social: 'bg-pink-100 text-pink-700',
  academic: 'bg-amber-100 text-amber-700',
  sports: 'bg-green-100 text-green-700',
  arts: 'bg-purple-100 text-purple-700',
  default: 'bg-gray-100 text-gray-600',
};

const Badge = ({ children, type = 'default', className = '' }) => {
  const color = colorMap[type?.toLowerCase()] || colorMap.default;
  return (
    <span
      className={`
        inline-block px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide uppercase
        ${color} ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;
