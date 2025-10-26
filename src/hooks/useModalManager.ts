// src/hooks/useModalManager.ts
import { useState, useCallback } from 'react';

export interface ModalState<T = any> {
  isOpen: boolean;
  data?: T;
}

export interface UseModalManagerReturn<T = any> {
  modals: Record<string, ModalState<T>>;
  openModal: (modalId: string, data?: T) => void;
  closeModal: (modalId: string) => void;
  isModalOpen: (modalId: string) => boolean;
  getModalData: <D = T>(modalId: string) => D | undefined;
  closeAllModals: () => void;
}

export const useModalManager = <T = any>(): UseModalManagerReturn<T> => {
  const [modals, setModals] = useState<Record<string, ModalState<T>>>({});

  const openModal = useCallback((modalId: string, data?: T) => {
    setModals(prev => ({
      ...prev,
      [modalId]: { isOpen: true, data }
    }));
  }, []);

  const closeModal = useCallback((modalId: string) => {
    setModals(prev => ({
      ...prev,
      [modalId]: { isOpen: false, data: undefined }
    }));
  }, []);

  const isModalOpen = useCallback((modalId: string) => {
    return modals[modalId]?.isOpen ?? false;
  }, [modals]);

  const getModalData = useCallback(<D = T>(modalId: string): D | undefined => {
    return modals[modalId]?.data as D;
  }, [modals]);

  const closeAllModals = useCallback(() => {
    setModals({});
  }, []);

  return {
    modals,
    openModal,
    closeModal,
    isModalOpen,
    getModalData,
    closeAllModals
  };
};