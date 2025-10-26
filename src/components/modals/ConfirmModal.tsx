// src/components/modals/ConfirmModal.tsx
import React from 'react';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { BaseModal } from './BaseModal';
import { Button } from '../common/Button';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'success';
  loading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'warning',
  loading = false
}) => {
  const icons = {
    danger: XCircle,
    warning: AlertTriangle,
    success: CheckCircle
  };

  const colors = {
    danger: 'text-red-600',
    warning: 'text-amber-600',
    success: 'text-emerald-600'
  };

  const Icon = icons[variant];

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className={`p-3 rounded-full bg-${variant === 'danger' ? 'red' : variant === 'success' ? 'emerald' : 'amber'}-100`}>
            <Icon size={24} className={colors[variant]} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="text-sm text-slate-600 mt-1">{message}</p>
          </div>
        </div>
        
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button 
            variant={variant === 'danger' ? 'danger' : 'primary'} 
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};