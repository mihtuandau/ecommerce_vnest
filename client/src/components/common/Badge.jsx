import React from 'react';

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    admin: 'bg-black text-white',
    customer: 'bg-gray-700 text-white',
    success: 'bg-gray-800 text-white',
    warning: 'bg-gray-600 text-white',
    danger: 'bg-red-600 text-white',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;





