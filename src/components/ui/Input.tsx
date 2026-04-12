import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  label?: string;
  error?: string;
  indicatorColor?: string; // Hex or tailwind class for the little left indicator dot
}

export const Input: React.FC<InputProps> = ({
  icon,
  label,
  error,
  indicatorColor,
  className = '',
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && <label className="block text-xs font-medium text-neutral-medium mb-1 pl-1">{label}</label>}
      <div className={`flex items-center space-x-3 p-3 bg-neutral-light rounded-xl border border-transparent focus-within:border-primary-blue-light focus-within:bg-white transition-colors overflow-hidden ${error ? 'border-danger-red focus-within:border-danger-red' : ''}`}>
        {indicatorColor && (
          <div className="flex-shrink-0 relative flex items-center justify-center">
            <div className={`w-2.5 h-2.5 rounded-full ${indicatorColor.startsWith('bg-') ? indicatorColor : ''}`} style={!indicatorColor.startsWith('bg-') ? { backgroundColor: indicatorColor } : {}}></div>
          </div>
        )}
        {icon && <div className="text-neutral-medium">{icon}</div>}
        <input
          className="w-full bg-transparent text-neutral-dark font-medium outline-none placeholder-neutral-medium/70"
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-danger-red pl-1">{error}</p>}
    </div>
  );
};
