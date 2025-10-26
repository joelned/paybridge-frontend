// src/components/modals/FormModal.tsx
import React from 'react';
import { BaseModal } from './BaseModal';
import { Button } from '../common/Button';

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  children: React.ReactNode;
  submitText?: string;
  cancelText?: string;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  submitVariant?: 'primary' | 'danger' | 'success';
}

export const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  children,
  submitText = 'Save',
  cancelText = 'Cancel',
  loading = false,
  size = 'md',
  submitVariant = 'primary'
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={title} size={size}>
      <form onSubmit={handleSubmit}>
        <div className="p-6">
          {children}
        </div>
        <div className="flex gap-3 justify-end px-6 py-4 border-t border-slate-200 bg-slate-50/50">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button 
            type="submit"
            variant={submitVariant} 
            loading={loading}
          >
            {submitText}
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};