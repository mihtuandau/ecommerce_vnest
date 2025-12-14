import React from 'react';

const Input = ({ 
  type = 'text', 
  name, 
  label, 
  value, 
  onChange, 
  error, 
  required = false, 
  disabled = false,
  icon: Icon,
  className = '', 
  ...props 
}) => {
  const baseClasses = 'appearance-none rounded-lg block w-full px-4 py-2.5 border placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 sm:text-sm';

  const errorClasses = error 
    ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
    : 'border-gray-300 focus:border-gray-900 focus:ring-gray-900 hover:border-gray-400';

  const disabledClasses = disabled 
    ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
    : 'text-gray-900 bg-white';

  const classes = `${baseClasses} ${errorClasses} ${disabledClasses} ${Icon ? 'pl-10' : ''} ${className}`;

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={classes}
          required={required}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-600" id={`${name}-error`}>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;