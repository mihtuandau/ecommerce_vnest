import React from "react";

const Button = ({
  type = "button",
  disabled = false,
  loading = false,
  fullWidth = false,
  variant = "primary",
  size = "md", 
  icon: Icon,
  className = "",
  children,
  ...props
}) => {

  const baseClasses =
    "inline-flex items-center justify-center font-normal rounded-lg focus:outline-none transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]";

  const variants = {
    primary:
      "btn-primary bg-black text-white hover:bg-neutral-800 uppercase tracking-widest font-bold border border-black",
    dark: "btn-dark bg-black text-white hover:bg-neutral-800 uppercase tracking-widest font-bold border border-black",
    outline:
      "btn-outline border border-black text-black hover:bg-black hover:text-white bg-white uppercase tracking-widest font-bold",
    "outline-light":
      "btn-outline-light border border-gray-300 text-black hover:bg-black hover:text-white bg-white uppercase tracking-widest font-bold",
    "outline-gray":
      "btn-outline-gray border border-gray-300 text-gray-700 hover:border-black hover:text-black bg-white",
    secondary:
      "bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-200",
    ghost: "btn-ghost bg-transparent text-black hover:bg-gray-100",
    danger: "bg-white border border-gray-200 text-red-600 hover:bg-red-50",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const widthClasses = fullWidth ? "w-full" : "";

  const classes = `${baseClasses} ${variants[variant] || variants.primary} ${sizes[size]} ${widthClasses} ${className}`;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={classes}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {!loading && Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
    </button>
  );
};

export default Button;
