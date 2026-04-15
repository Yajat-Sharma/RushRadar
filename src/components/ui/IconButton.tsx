import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface IconButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  isRounded?: boolean;
}

export const IconButton = ({
  children,
  variant = 'ghost',
  size = 'md',
  isRounded = true,
  className = '',
  ...props
}: IconButtonProps) => {
  const variants = {
    primary: 'bg-primary-blue text-white shadow-md hover:bg-primary-blue-dark hover:shadow-lg',
    secondary: 'bg-white dark:bg-gray-800 text-neutral-dark dark:text-white border border-neutral-200 dark:border-gray-700 hover:bg-neutral-50 dark:hover:bg-gray-700 shadow-sm',
    ghost: 'bg-transparent text-neutral-medium dark:text-gray-400 hover:bg-neutral-100 dark:hover:bg-gray-800 hover:text-neutral-dark dark:hover:text-white',
    glass: 'bg-white/70 dark:bg-gray-800/70 backdrop-blur-md text-neutral-dark dark:text-white border border-white/50 dark:border-gray-600 shadow-sm hover:bg-white dark:hover:bg-gray-700',
  };

  const sizes = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.93 }}
      className={`inline-flex items-center justify-center ${isRounded ? 'rounded-full' : 'rounded-xl'} outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-1 dark:focus:ring-offset-gray-900 transition-colors ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};
