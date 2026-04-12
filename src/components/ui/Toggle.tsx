import React from 'react';
import { motion } from 'framer-motion';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, disabled = false }) => {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      className={`relative w-12 h-6 rounded-full transition-colors duration-200 outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-blue ${
        checked ? 'bg-primary-blue' : 'bg-neutral-300'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      aria-checked={checked}
      role="switch"
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md"
        style={{ left: checked ? '26px' : '2px' }}
      />
    </button>
  );
};
