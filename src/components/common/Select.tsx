// src/components/common/Select.tsx
import React from 'react';
import type { SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

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
    <div className="ui-field">
      {label && (
        <label className="ui-field-label" htmlFor={inputId}>
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
          className={cn(
            'ui-control w-full px-4 py-3 pr-10 appearance-none',
            error && 'ui-control-error',
            disabled && 'ui-control-disabled opacity-60',
            className
          )}
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
        <p id={hintId} className="ui-field-hint">{hint}</p>
      )}
      {error && (
        <p id={errorId} role="alert" className="ui-field-error">{error}</p>
      )}
    </div>
  );
};
