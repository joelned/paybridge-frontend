// src/components/feedback/InlineAlert.tsx
import React from 'react';

type Variant = 'success' | 'error' | 'warning' | 'info';

interface InlineAlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  children: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  success: 'bg-success-50 border border-success-200 text-success-800',
  error: 'bg-error-50 border border-error-200 text-error-800',
  warning: 'bg-warning-50 border border-warning-200 text-warning-800',
  info: 'bg-primary-50 border border-primary-200 text-primary-800',
};

const iconClasses: Record<Variant, string> = {
  success: 'text-success-600',
  error: 'text-error-600',
  warning: 'text-warning-600',
  info: 'text-primary-600',
};

export const InlineAlert: React.FC<InlineAlertProps> = ({ variant = 'info', icon: Icon, children, className = '', ...props }) => {
  const role = variant === 'success' || variant === 'info' ? 'status' : 'alert';
  const ariaLive = variant === 'success' || variant === 'info' ? 'polite' : 'assertive';
  return (
    <div {...props} role={role} aria-live={ariaLive} className={`mb-4 p-4 rounded-xl flex items-start gap-3 text-sm font-medium animate-fadeIn ${variantClasses[variant]} ${className}`}>
      {Icon && (
        <Icon size={20} className={`flex-shrink-0 mt-0.5 ${iconClasses[variant]}`} />
      )}
      <div className="flex-1 leading-relaxed">{children}</div>
    </div>
  );
};


