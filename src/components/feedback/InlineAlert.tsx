// src/components/feedback/InlineAlert.tsx
import React from 'react';

type Variant = 'success' | 'error' | 'warning' | 'info';

interface InlineAlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  children: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  success: 'bg-green-50 border border-green-200 text-green-700',
  error: 'bg-red-50 border border-red-200 text-red-700',
  warning: 'bg-yellow-50 border border-yellow-200 text-yellow-700',
  info: 'bg-blue-50 border border-blue-200 text-blue-700',
};

const defaultIcons: Record<Variant, string> = {
  success: 'check-circle',
  error: 'alert-circle',
  warning: 'alert-triangle',
  info: 'info',
};

export const InlineAlert: React.FC<InlineAlertProps> = ({ variant = 'info', icon: Icon, children, className = '', ...props }) => {
  const role = variant === 'success' || variant === 'info' ? 'status' : 'alert';
  const ariaLive = variant === 'success' || variant === 'info' ? 'polite' : 'assertive';
  return (
    <div {...props} role={role} aria-live={ariaLive} className={`mb-4 p-3 rounded-lg flex items-start gap-2 text-sm ${variantClasses[variant]} ${className}`}>
      {Icon && (
        <Icon size={20} className="flex-shrink-0 mt-0.5" />
      )}
      <span>{children}</span>
    </div>
  );
};


