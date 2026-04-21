import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

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
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const baseClasses = 'appearance-none block w-full px-4 py-3 border border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all duration-200 text-sm font-normal';

  const errorClasses = error 
    ? 'border-red-500 focus:border-red-600 text-red-900 ring-red-500' 
    : 'hover:border-gray-400';

  const disabledClasses = disabled 
    ? 'bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200' 
    : 'text-gray-900 bg-white';

  const classes = `${baseClasses} ${errorClasses} ${disabledClasses} ${Icon ? 'pl-11' : ''} ${isPassword ? 'pr-11' : ''} ${className}`;

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={name} className="block text-sm font-normal text-gray-900">
          {label} {required && <span className="text-gray-400">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        )}
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={classes}
          required={required}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
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





