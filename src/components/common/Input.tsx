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
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={inputId}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Icon size={20} />
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
            w-full px-4 py-2.5 
            ${Icon ? 'pl-10' : ''} 
            border rounded-lg 
            focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
            transition-all
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${disabled ? 'bg-gray-50 cursor-not-allowed opacity-60' : 'bg-white'}
            ${className}
          `}
        />
      </div>
      {hint && !error && (
        <p id={hintId} className="mt-1 text-xs text-gray-500">{hint}</p>
      )}
      {error && (
        <p id={errorId} role="alert" className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};