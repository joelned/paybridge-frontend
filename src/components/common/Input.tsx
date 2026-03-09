// src/components/common/Input.tsx
import React from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  endAdornment?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  icon: Icon,
  endAdornment,
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
          className={cn(
            'ui-control px-4 py-3.5',
            Icon && 'pl-12',
            endAdornment && 'pr-12',
            error && 'ui-control-error',
            disabled && 'ui-control-disabled opacity-60',
            className
          )}
        />
        {endAdornment && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center">
            {endAdornment}
          </div>
        )}
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
