import React from 'react';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  className,
  label,
  error,
  fullWidth = false,
  leftIcon,
  rightIcon,
  ...props
}) => {
  const id = props.id || Math.random().toString(36).substring(2, 9);
  
  const baseStyles = 'bg-background-light rounded-lg px-4 py-2 border border-surface-light focus:outline-none focus:ring-2 focus:ring-primary';
  const widthStyle = fullWidth ? 'w-full' : '';
  const errorStyle = error ? 'border-error focus:ring-error' : '';
  const iconPaddingLeft = leftIcon ? 'pl-10' : '';
  const iconPaddingRight = rightIcon ? 'pr-10' : '';
  
  return (
    <div className={`${fullWidth ? 'w-full' : ''} mb-4`}>
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-white/70 mb-1"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-white/50">
            {leftIcon}
          </div>
        )}
        
        <input
          id={id}
          className={twMerge(
            baseStyles,
            widthStyle,
            errorStyle,
            iconPaddingLeft,
            iconPaddingRight,
            className
          )}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-white/50">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
};

export default Input;