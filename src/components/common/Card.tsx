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
  const baseStyles = cn(
    'rounded-xl',
    variant === 'soft' ? 'bg-gray-50' : 'bg-white',
    'border',
    variant === 'outlined' ? 'border-gray-300' : 'border-gray-200',
    variant === 'elevated' ? 'shadow-md' : 'shadow-sm',
  );

  const paddingStyles =
    padding === 'none' ? '' : padding === 'sm' ? 'p-3' : padding === 'lg' ? 'p-6' : 'p-4';

  const variantExtras = cn(
    variant === 'elevated' && 'ring-1 ring-black/5',
    variant === 'outlined' && 'shadow-none',
  );

  const interactionStyles = cn(
    interactive &&
      'transition-shadow cursor-pointer hover:shadow-md active:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
    !interactive && hover && 'hover:shadow-md transition-shadow cursor-pointer',
  );

  return (
    <div {...props} className={cn(baseStyles, paddingStyles, variantExtras, interactionStyles, className)}>
      {children}
    </div>
  );
};