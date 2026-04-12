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
    secondary: 'bg-white text-neutral-dark border-2 border-neutral-light hover:bg-neutral-50 shadow-sm',
    ghost: 'bg-transparent text-neutral-medium hover:bg-neutral-light hover:text-neutral-dark',
    glass: 'bg-white/70 backdrop-blur-md text-neutral-dark border border-white/50 shadow-sm hover:bg-white',
  };

  const sizes = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`inline-flex items-center justify-center ${isRounded ? 'rounded-full' : 'rounded-xl'} outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-1 transition-colors ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};
