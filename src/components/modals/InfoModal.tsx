// src/components/modals/InfoModal.tsx
import React from 'react';
import { Info } from 'lucide-react';
import { BaseModal } from './BaseModal';
import { Button } from '../common/Button';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message?: string;
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const InfoModal: React.FC<InfoModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  children,
  size = 'md'
}) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={title} size={size}>
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Info size={20} className="text-blue-600" />
          </div>
          <div className="flex-1">
            {message && <p className="text-slate-700">{message}</p>}
            {children}
          </div>
        </div>
      </div>
      <div className="flex justify-end px-6 py-4 border-t border-slate-200 bg-slate-50/50">
        <Button variant="primary" onClick={onClose}>
          Got it
        </Button>
      </div>
    </BaseModal>
  );
};