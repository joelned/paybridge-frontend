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
        <label className="block text-sm font-semibold text-slate-900 mb-2.5" htmlFor={inputId}>
          {label} {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none">
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
            w-full px-4 py-3.5 
            ${Icon ? 'pl-12' : ''} 
            border rounded-xl 
            focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 
            transition-all duration-200
            placeholder:text-slate-400
            text-slate-900 font-medium
            shadow-sm
            ${error 
              ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-red-500/20 shadow-red-100/50' 
              : 'border-slate-300 bg-white hover:border-slate-400 hover:shadow-md focus:shadow-lg focus:shadow-blue-500/10'
            }
            ${disabled ? 'bg-slate-50 cursor-not-allowed opacity-60 text-slate-500' : ''}
            ${className}
          `}
        />
      </div>
      {hint && !error && (
        <p id={hintId} className="mt-2.5 text-sm text-slate-600">{hint}</p>
      )}
      {error && (
        <p id={errorId} role="alert" className="mt-2.5 text-sm text-red-600 font-semibold">{error}</p>
      )}
    </div>
  );
};