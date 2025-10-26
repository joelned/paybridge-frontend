// src/components/modals/LoadingModal.tsx
import React from 'react';
import { BaseModal } from './BaseModal';

interface LoadingModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  progress?: number;
}

export const LoadingModal: React.FC<LoadingModalProps> = ({
  isOpen,
  title = 'Processing...',
  message = 'Please wait while we process your request.',
  progress
}) => {
  return (
    <BaseModal isOpen={isOpen} onClose={() => {}} showCloseButton={false} size="sm">
      <div className="p-8 text-center">
        <div className="relative mb-6">
          <div className="w-16 h-16 mx-auto">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-blue-600 absolute top-0 left-0"></div>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
        <p className="text-sm text-slate-600 mb-4">{message}</p>
        
        {progress !== undefined && (
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>
    </BaseModal>
  );
};