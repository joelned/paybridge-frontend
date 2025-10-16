// src/components/common/Button.tsx
import React from 'react';
import type { ButtonHTMLAttributes } from 'react';

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
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-sm hover:shadow-md',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 active:scale-95',
    outline: 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 active:scale-95',
    ghost: 'text-gray-600 hover:bg-gray-100 active:scale-95',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:scale-95 shadow-sm',
    success: 'bg-green-600 text-white hover:bg-green-700 active:scale-95 shadow-sm'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const isDisabled = disabled || loading;
  
  return (
    <button
      {...props}
      type={type}
      disabled={isDisabled}
      className={`
        ${baseClasses} 
        ${variants[variant]} 
        ${sizes[size]}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Loading...
        </>
      ) : (
        <>
          {Icon && <Icon size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />}
          {children}
        </>
      )}
    </button>
  );
};