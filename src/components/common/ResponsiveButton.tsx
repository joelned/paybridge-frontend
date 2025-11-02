import React, { forwardRef, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { useIsMobile } from '../../hooks/useMediaQuery';

interface ResponsiveButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  mobileFullWidth?: boolean;
}

export const ResponsiveButton = React.memo(forwardRef<HTMLButtonElement, ResponsiveButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  fullWidth = false,
  mobileFullWidth = true,
  disabled,
  className = '',
  ...props
}, ref) => {
  const isMobile = useIsMobile();

  const buttonClasses = useMemo(() => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variantClasses = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
      outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
      ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    };

    const sizeClasses = isMobile ? {
      sm: 'px-4 py-3 min-h-[44px] min-w-[44px]',
      md: 'px-6 py-3 min-h-[48px] min-w-[48px]',
      lg: 'px-8 py-4 min-h-[52px] min-w-[52px]',
    } : {
      sm: 'px-3 py-1.5 min-h-[36px]',
      md: 'px-4 py-2 min-h-[40px]',
      lg: 'px-6 py-3 min-h-[44px]',
    };

    const textSizeClasses = isMobile ? {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    } : {
      sm: 'text-sm',
      md: 'text-sm',
      lg: 'text-base',
    };

    const widthClass = (fullWidth || (isMobile && mobileFullWidth)) ? 'w-full' : '';
    const loadingClass = loading ? 'cursor-wait' : '';

    return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${textSizeClasses[size]} ${widthClass} ${loadingClass} ${isMobile ? 'mobile-tap-highlight' : ''}`.trim();
  }, [variant, size, fullWidth, mobileFullWidth, isMobile, loading]);

  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      disabled={isDisabled}
      className={`${buttonClasses} ${className}`}
      {...props}
    >
      {loading && (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      )}
      {!loading && icon && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
    </button>
  );
}));

ResponsiveButton.displayName = 'ResponsiveButton';