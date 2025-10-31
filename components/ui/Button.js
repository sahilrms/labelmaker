// components/ui/Button.js
'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';

const buttonVariants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-300',
  link: 'bg-transparent text-blue-600 hover:text-blue-800 hover:underline focus:ring-blue-300'
};

const buttonSizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base'
};

const Button = forwardRef(({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  isLoading = false,
  ...props
}, ref) => {
  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center rounded-md border border-transparent 
        font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 
        disabled:opacity-50 disabled:cursor-not-allowed
        ${buttonVariants[variant] || buttonVariants.primary}
        ${buttonSizes[size] || buttonSizes.md}
        ${className}
      `}
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      style={{ position: 'relative', zIndex: 9999 }} // Ensures max z-index
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
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
      {children}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;