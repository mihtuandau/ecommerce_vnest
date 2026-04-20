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

  const baseClasses = 'appearance-none block w-full px-4 py-3 border placeholder-gray-400 focus:outline-none transition-colors duration-200 text-sm font-normal';

  const errorClasses = error 
    ? 'border-red-500 focus:border-red-600 text-red-900' 
    : 'border-gray-300 focus:border-[#00a85a] hover:border-gray-400';

  const disabledClasses = disabled 
    ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200' 
    : 'text-gray-900 bg-white';

  const classes = `${baseClasses} ${errorClasses} ${disabledClasses} ${Icon ? 'pl-10' : ''} ${className}`;

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={name} className="block text-sm font-normal text-gray-900">
          {label} {required && <span className="text-gray-400">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
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
        <p className="text-xs text-red-600" id={`${name}-error`}>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;





