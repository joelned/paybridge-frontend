import React from 'react';
import { ModalCallbacks } from '../../contexts/ModalContext';
import { BaseModal } from './BaseModal';

interface AddProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: any;
  callbacks?: ModalCallbacks;
}

export const AddProviderModal: React.FC<AddProviderModalProps> = ({ 
  isOpen, 
  onClose, 
  data, 
  callbacks 
}) => {
  const handleSuccess = (result?: any) => {
    if (callbacks?.onSuccess) {
      callbacks.onSuccess(result);
    }
    onClose();
  };

  const handleError = (error: any) => {
    if (callbacks?.onError) {
      callbacks.onError(error);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Payment Provider"
      size="md"
    >
      <div className="p-6">
        <p className="text-gray-600 mb-4">Configure a new payment provider for your account.</p>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleSuccess({ name: 'New Provider' })}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Add Provider
          </button>
        </div>
      </div>
    </BaseModal>
  );
};