// src/components/common/Card.tsx
import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  variant?: 'default' | 'elevated' | 'outlined' | 'soft';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
  children: React.ReactNode;
}

function cn(...classes: Array<string | undefined | false>): string {
  return classes.filter(Boolean).join(' ');
}

export const Card: React.FC<CardProps> = ({
  children,
  hover = false,
  variant = 'default',
  padding = 'md',
  interactive = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-xl transition-all duration-200';
  
  const variants = {
    default: 'bg-white border border-slate-200 shadow-sm',
    elevated: 'bg-white border border-slate-200 shadow-lg',
    outlined: 'bg-white border border-slate-300 shadow-none',
    soft: 'bg-slate-50 border border-slate-200 shadow-sm'
  };

  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  const interactionStyles = cn(
    interactive && 'cursor-pointer hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:ring-offset-2',
    !interactive && hover && 'hover:shadow-lg hover:-translate-y-0.5 cursor-pointer',
  );

  return (
    <div 
      {...props} 
      className={cn(
        baseStyles,
        variants[variant as keyof typeof variants],
        paddingStyles[padding as keyof typeof paddingStyles],
        interactionStyles,
        className
      )}
    >
      {children}
    </div>
  );
};