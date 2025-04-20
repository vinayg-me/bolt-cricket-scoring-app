import React from 'react';
import { twMerge } from 'tailwind-merge';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options: SelectOption[];
  label?: string;
  error?: string;
  fullWidth?: boolean;
  onChange?: (value: string) => void;
}

const Select: React.FC<SelectProps> = ({
  className,
  options,
  label,
  error,
  fullWidth = false,
  onChange,
  ...props
}) => {
  const id = props.id || Math.random().toString(36).substring(2, 9);
  
  const baseStyles = 'appearance-none bg-background-light rounded-lg px-4 py-2 border border-surface-light focus:outline-none focus:ring-2 focus:ring-primary pr-10';
  const widthStyle = fullWidth ? 'w-full' : '';
  const errorStyle = error ? 'border-error focus:ring-error' : '';
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(e.target.value);
  };
  
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
        <select
          id={id}
          className={twMerge(
            baseStyles,
            widthStyle,
            errorStyle,
            className
          )}
          onChange={handleChange}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-white/50">
          <ChevronDown size={18} />
        </div>
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
};

export default Select;