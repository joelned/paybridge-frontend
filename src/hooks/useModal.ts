import { useCallback } from 'react';
import { useModalContext, type ModalId, type ModalCallbacks } from '../contexts/ModalContext';

export const useModal = (modalId: ModalId) => {
  const { activeModal, openModal, closeModal, isModalOpen } = useModalContext();
  
  const isOpen = isModalOpen(modalId);
  const data = activeModal?.id === modalId ? activeModal.data : undefined;
  const callbacks = activeModal?.id === modalId ? activeModal.callbacks : undefined;
  
  const open = useCallback((data?: any, callbacks?: ModalCallbacks) => {
    openModal(modalId, data, callbacks);
  }, [modalId, openModal]);
  
  const close = useCallback(() => {
    closeModal();
  }, [closeModal]);
  
  const handleSuccess = useCallback((result?: any) => {
    if (callbacks?.onSuccess) {
      callbacks.onSuccess(result);
    }
    close();
  }, [callbacks, close]);
  
  const handleError = useCallback((error: any) => {
    if (callbacks?.onError) {
      callbacks.onError(error);
    }
  }, [callbacks]);
  
  return {
    isOpen,
    data,
    callbacks,
    open,
    close,
    handleSuccess,
    handleError
  };
};