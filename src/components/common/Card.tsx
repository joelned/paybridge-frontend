// src/components/common/Card.tsx
import React from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  variant?: 'default' | 'elevated' | 'outlined' | 'soft';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  hover = false,
  variant = 'default',
  padding = 'md',
  interactive = false,
  className = '',
  onClick,
  onKeyDown,
  role,
  tabIndex,
  ...props
}) => {
  const variants = {
    default: 'ui-card-default',
    elevated: 'ui-card-elevated',
    outlined: 'ui-card-outlined',
    soft: 'ui-card-soft',
  };

  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  const isInteractive = interactive || typeof onClick === 'function';

  const interactionStyles = cn(
    hover && 'ui-card-hover',
    isInteractive && 'ui-card-interactive focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:ring-offset-2',
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);

    if (!isInteractive || !onClick || event.defaultPrevented) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick(event as unknown as React.MouseEvent<HTMLDivElement>);
    }
  };

  return (
    <div
      {...props}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={role ?? (isInteractive ? 'button' : undefined)}
      tabIndex={tabIndex ?? (isInteractive ? 0 : undefined)}
      className={cn(
        'ui-card',
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
