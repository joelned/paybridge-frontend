// src/components/common/Input.tsx
import React from 'react';
import type { InputHTMLAttributes } from 'react';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  icon: Icon,
  className = '',
  disabled = false,
  required = false,
  ...props
}) => {
  const inputId = (props.id as string) || (props.name as string) || undefined;
  const hintId = hint && inputId ? `${inputId}-hint` : undefined;
  const errorId = error && inputId ? `${inputId}-error` : undefined;
  return (
    <div className="mb-5">
      {label && (
        <label className="block text-sm font-medium text-gray-900 mb-2" htmlFor={inputId}>
          {label} {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
            <Icon size={18} />
          </div>
        )}
        <input
          {...props}
          required={required}
          disabled={disabled}
          id={inputId}
          aria-invalid={!!error || undefined}
          aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
          className={`
            w-full px-4 py-3 
            ${Icon ? 'pl-11' : ''} 
            border rounded-lg 
            focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 
            transition-all duration-200
            placeholder:text-gray-400
            text-gray-900
            ${error 
              ? 'border-error-300 bg-error-50/50 focus:border-error-500 focus:ring-error-500/20' 
              : 'border-gray-300 bg-white hover:border-gray-400'
            }
            ${disabled ? 'bg-gray-50 cursor-not-allowed opacity-60 text-gray-500' : ''}
            ${className}
          `}
        />
      </div>
      {hint && !error && (
        <p id={hintId} className="mt-2 text-sm text-gray-600">{hint}</p>
      )}
      {error && (
        <p id={errorId} role="alert" className="mt-2 text-sm text-error-600 font-medium">{error}</p>
      )}
    </div>
  );
};