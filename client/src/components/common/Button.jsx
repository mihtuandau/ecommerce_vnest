import React from 'react';

const Button = ({ 
  type = 'button', 
  disabled = false, 
  loading = false,
  fullWidth = false, 
  variant = 'primary', 
  size = 'md', // sm, md, lg
  icon: Icon,
  className = '', 
  children, 
  ...props 
}) => {
  // Base classes - minimalist style
  const baseClasses = 'inline-flex items-center justify-center font-normal focus:outline-none transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50';
  
  // Variants - xanh lá cho user, admin override bằng CSS
  const variants = {
    primary: 'btn-primary bg-[#00a85a] text-white hover:bg-[#008f4d]',
    dark: 'btn-dark bg-[#00a85a] text-white hover:bg-[#008f4d]',
    outline: 'btn-outline border border-[#00a85a] text-[#00a85a] hover:bg-[#00a85a] hover:text-white bg-white',
    'outline-light': 'btn-outline-light border border-gray-300 text-[#00a85a] hover:border-[#00a85a] bg-white',
    'outline-gray': 'btn-outline-gray border border-gray-300 text-gray-700 hover:bg-gray-50 bg-white',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-200',
    ghost: 'btn-ghost bg-transparent text-[#00a85a] hover:bg-gray-100',
    danger: 'bg-white border border-gray-300 text-gray-900 hover:border-[#00a85a]',
  };

  // Sizes - consistent spacing
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const widthClasses = fullWidth ? 'w-full' : '';

  const classes = `${baseClasses} ${variants[variant] || variants.primary} ${sizes[size]} ${widthClasses} ${className}`;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={classes}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {!loading && Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
    </button>
  );
};

export default Button;