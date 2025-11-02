import React, { useEffect, useRef } from 'react';
import { FocusScope } from '@react-aria/focus';
import { X } from 'lucide-react';
import { useKeyboardNavigation, useAnnouncement } from '../../hooks/useAccessibility';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl'
};

export const AccessibleModal: React.FC<Props> = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
  size = 'md'
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { announce } = useAnnouncement();
  
  useKeyboardNavigation(onClose);

  useEffect(() => {
    if (isOpen) {
      announce(`${title} dialog opened`);
      // Focus the modal when it opens
      modalRef.current?.focus();
    }
  }, [isOpen, title, announce]);

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <FocusScope contain restoreFocus autoFocus>
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          tabIndex={-1}
          className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 id="modal-title" className="text-xl font-semibold text-gray-900">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-md p-1"
              aria-label={`Close ${title} dialog`}
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="p-6">
            {children}
          </div>
        </div>
      </FocusScope>
    </div>
  );
};