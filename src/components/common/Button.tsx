// src/components/common/Button.tsx
import React from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  className = '',
  type = 'button',
  ...props
}) => {
  const variantClass = {
    primary: 'ui-btn-primary',
    secondary: 'ui-btn-secondary',
    outline: 'ui-btn-outline',
    ghost: 'ui-btn-ghost',
    danger: 'ui-btn-danger',
    success: 'ui-btn-success',
  };

  const sizeClass = {
    sm: 'ui-btn-sm',
    md: 'ui-btn-md',
    lg: 'ui-btn-lg',
  };

  const isDisabled = disabled || loading;
  const hasOnlyIcon = Icon && !children;

  return (
    <button
      {...props}
      type={type}
      disabled={isDisabled}
      aria-label={hasOnlyIcon ? props['aria-label'] || 'Button' : undefined}
      className={cn(
        'ui-btn',
        variantClass[variant],
        sizeClass[size],
        className
      )}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
          <span className="opacity-75">{typeof children === 'string' ? children : 'Loading...'}</span>
        </>
      ) : (
        <>
          {Icon && <Icon size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} className="flex-shrink-0" />}
          {children}
        </>
      )}
    </button>
  );
};
