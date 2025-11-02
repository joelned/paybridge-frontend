import { useCallback } from 'react';
import { useModalContext } from '../contexts/ModalContext';
import { ModalId, ModalCallbacks } from '../types/modal';

export const useModal = (modalId: ModalId) => {
  const { modals, openModal, closeModal } = useModalContext();
  
  const modal = modals[modalId];
  
  const open = useCallback((data?: any, callbacks?: ModalCallbacks) => {
    openModal(modalId, data, callbacks);
  }, [modalId, openModal]);
  
  const close = useCallback(() => {
    closeModal(modalId);
  }, [modalId, closeModal]);
  
  const handleSuccess = useCallback((result?: any) => {
    if (modal.callbacks?.onSuccess) {
      modal.callbacks.onSuccess(result);
    }
    close();
  }, [modal.callbacks, close]);
  
  const handleError = useCallback((error: any) => {
    if (modal.callbacks?.onError) {
      modal.callbacks.onError(error);
    }
  }, [modal.callbacks]);
  
  return {
    isOpen: modal.isOpen,
    data: modal.data,
    callbacks: modal.callbacks,
    open,
    close,
    handleSuccess,
    handleError
  };
};