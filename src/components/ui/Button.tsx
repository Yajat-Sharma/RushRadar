import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  className = '',
  ...props
}: ButtonProps) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900';

  const variants = {
    primary: 'bg-gradient-to-r from-primary-blue to-primary-blue-light text-white shadow-md hover:shadow-lg focus:ring-primary-blue',
    secondary: 'bg-white dark:bg-gray-800 text-neutral-dark dark:text-white border border-neutral-light dark:border-gray-600 shadow-sm hover:bg-neutral-50 dark:hover:bg-gray-700 focus:ring-neutral-medium',
    outline: 'bg-transparent text-primary-blue border-2 border-primary-blue hover:bg-blue-50 dark:hover:bg-primary-blue/10 focus:ring-primary-blue',
    ghost: 'bg-transparent text-neutral-dark dark:text-gray-200 hover:bg-neutral-100 dark:hover:bg-gray-800 focus:ring-neutral-medium',
    danger: 'bg-danger-red text-white shadow-md hover:bg-red-600 focus:ring-danger-red',
  };

  const sizes = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2.5',
    lg: 'text-lg px-6 py-3.5',
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const loadingClass = isLoading ? 'opacity-70 cursor-not-allowed' : '';

  return (
    <motion.button
      whileHover={{ scale: isLoading ? 1 : 1.01 }}
      whileTap={{ scale: isLoading ? 1 : 0.97 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${loadingClass} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </motion.button>
  );
};
