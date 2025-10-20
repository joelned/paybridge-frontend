// src/components/common/Select.tsx
import React from 'react';
import type { SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  error?: string;
  hint?: string;
  options: Array<{ value: string; label: string }>;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  hint,
  options,
  className = '',
  disabled = false,
  required = false,
  ...props
}) => {
  const inputId = (props.id as string) || (props.name as string) || undefined;
  const hintId = hint && inputId ? `${inputId}-hint` : undefined;
  const errorId = error && inputId ? `${inputId}-error` : undefined;
  
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-semibold text-gray-800 mb-2.5" htmlFor={inputId}>
          {label} {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          {...props}
          required={required}
          disabled={disabled}
          id={inputId}
          aria-invalid={!!error || undefined}
          aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
          className={`
            w-full px-4 py-3 pr-10
            border rounded-xl appearance-none
            focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 
            transition-all duration-200
            ${error 
              ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-red-500/20' 
              : 'border-gray-300 bg-white hover:border-gray-400'
            }
            ${disabled ? 'bg-gray-50 cursor-not-allowed opacity-60 text-gray-500' : ''}
            ${className}
          `}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown 
          size={20} 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" 
        />
      </div>
      {hint && !error && (
        <p id={hintId} className="mt-2 text-sm text-gray-600">{hint}</p>
      )}
      {error && (
        <p id={errorId} role="alert" className="mt-2 text-sm text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
};