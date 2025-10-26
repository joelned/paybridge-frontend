// src/components/modals/BaseModal.tsx
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

export const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.body.classList.add('modal-open');
      modalRef.current?.focus();
    } else {
      document.body.classList.remove('modal-open');
      previousFocusRef.current?.focus();
    }

    return () => document.body.classList.remove('modal-open');
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm animate-fadeIn"
          onClick={onClose}
        />
        <div
          ref={modalRef}
          tabIndex={-1}
          className={`relative w-full ${sizeClasses[size]} bg-white rounded-2xl shadow-2xl animate-scaleUp`}
        >
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              {title && <h2 className="text-xl font-semibold text-slate-900">{title}</h2>}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};