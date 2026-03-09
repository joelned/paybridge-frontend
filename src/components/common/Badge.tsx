import React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', size = 'md', className = '' }) => {
  const variants = {
    default: 'ui-badge-default',
    success: 'ui-badge-success',
    warning: 'ui-badge-warning',
    danger: 'ui-badge-danger',
    info: 'ui-badge-info',
    purple: 'ui-badge-info'
  };

  const sizes = {
    sm: 'ui-badge-sm',
    md: 'ui-badge-md',
    lg: 'ui-badge-lg'
  };
  
  return (
    <span className={cn('ui-badge', variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
};
