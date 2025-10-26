// src/components/modals/SuccessModal.tsx
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { BaseModal } from './BaseModal';
import { Button } from '../common/Button';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  actionText,
  onAction
}) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
          <CheckCircle size={32} className="text-emerald-600" />
        </div>
        
        <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
        <p className="text-sm text-slate-600 mb-6">{message}</p>
        
        <div className="flex gap-3 justify-center">
          {actionText && onAction && (
            <Button variant="primary" onClick={onAction}>
              {actionText}
            </Button>
          )}
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};