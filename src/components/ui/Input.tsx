import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  label?: string;
  error?: string;
  indicatorColor?: string;
  rightElement?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  icon,
  label,
  error,
  indicatorColor,
  rightElement,
  className = '',
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-neutral-medium dark:text-gray-400 uppercase tracking-wider mb-1.5 pl-1">
          {label}
        </label>
      )}
      <div className={`flex items-center gap-3 p-3.5 bg-neutral-100 dark:bg-gray-800 rounded-2xl border transition-all ${
        error
          ? 'border-danger-red focus-within:border-danger-red ring-2 ring-danger-red/10'
          : 'border-transparent dark:border-gray-700 focus-within:border-primary-blue focus-within:bg-white dark:focus-within:bg-gray-800 focus-within:ring-2 focus-within:ring-primary-blue/10'
      }`}>
        {indicatorColor && (
          <div className="flex-shrink-0 flex items-center justify-center">
            <div
              className={`w-2.5 h-2.5 rounded-full ${indicatorColor.startsWith('bg-') ? indicatorColor : ''}`}
              style={!indicatorColor.startsWith('bg-') ? { backgroundColor: indicatorColor } : {}}
            />
          </div>
        )}
        {icon && <div className="text-neutral-medium dark:text-gray-400 shrink-0">{icon}</div>}
        <input
          className="flex-1 bg-transparent text-neutral-dark dark:text-white font-medium outline-none placeholder-neutral-medium/60 dark:placeholder-gray-500 text-[15px]"
          {...props}
        />
        {rightElement && <div className="shrink-0">{rightElement}</div>}
      </div>
      {error && <p className="mt-1.5 text-xs font-bold text-danger-red pl-1">{error}</p>}
    </div>
  );
};
