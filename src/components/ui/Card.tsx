import React, { HTMLAttributes } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface CardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children?: React.ReactNode;
  interactive?: boolean;
}

export const Card = ({ children, className = '', interactive = false, ...props }: CardProps) => {
  const baseStyles = "bg-white rounded-2xl p-5 shadow-sm border border-neutral-light";
  
  if (interactive) {
    return (
      <motion.div
        whileHover={{ y: -2, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
        className={`${baseStyles} cursor-pointer transition-shadow ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`${baseStyles} ${className}`} {...(props as HTMLAttributes<HTMLDivElement>)}>
      {children}
    </div>
  );
};
