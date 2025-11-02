import React, { useEffect } from 'react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { useIsMobile } from '../../hooks/useMediaQuery';

type ModalVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';
type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface GenericModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  variant?: ModalVariant;
  size?: ModalSize;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  footer?: React.ReactNode;
  className?: string;
}

const VARIANT_STYLES = {
  default: {
    icon: Info,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-100',
    borderColor: 'border-blue-200'
  },
  success: {
    icon: CheckCircle,
    iconColor: 'text-green-600',
    iconBg: 'bg-green-100',
    borderColor: 'border-green-200'
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-yellow-600',
    iconBg: 'bg-yellow-100',
    borderColor: 'border-yellow-200'
  },
  danger: {
    icon: AlertCircle,
    iconColor: 'text-red-600',
    iconBg: 'bg-red-100',
    borderColor: 'border-red-200'
  },
  info: {
    icon: Info,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-100',
    borderColor: 'border-blue-200'
  }
};

const SIZE_STYLES = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-full mx-4'
};

export const GenericModal = React.memo(({
  isOpen,
  onClose,
  title,
  children,
  variant = 'default',
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  footer,
  className = ''
}: GenericModalProps) => {
  const isMobile = useIsMobile();
  const variantStyle = VARIANT_STYLES[variant];
  const Icon = variantStyle.icon;

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
        {/* Mobile Header */}
        <div className={`sticky top-0 bg-white border-b ${variantStyle.borderColor} px-4 py-3 flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${variantStyle.iconBg}`}>
              <Icon className={`w-5 h-5 ${variantStyle.iconColor}`} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          </div>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Mobile Content */}
        <div className="p-4">
          {children}
        </div>

        {/* Mobile Footer */}
        {footer && (
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
            {footer}
          </div>
        )}
      </div>
    );
  }

  // Desktop Modal
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleOverlayClick}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className={`relative bg-white rounded-lg shadow-xl w-full ${SIZE_STYLES[size]} max-h-[90vh] overflow-hidden ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Desktop Header */}
          <div className={`flex items-center justify-between p-6 border-b ${variantStyle.borderColor}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${variantStyle.iconBg}`}>
                <Icon className={`w-5 h-5 ${variantStyle.iconColor}`} />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Desktop Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {children}
          </div>

          {/* Desktop Footer */}
          {footer && (
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

GenericModal.displayName = 'GenericModal';