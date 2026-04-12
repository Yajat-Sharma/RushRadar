import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', size = 'md' }) => {
  const baseStyles = 'inline-flex items-center font-bold rounded-full';
  
  const variants = {
    success: 'bg-green-100 text-success-green',
    warning: 'bg-orange-100 text-warning-orange',
    danger: 'bg-red-100 text-danger-red',
    info: 'bg-blue-100 text-primary-blue',
    neutral: 'bg-neutral-light text-neutral-medium',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
};
