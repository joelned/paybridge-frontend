import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { ModalDataMap } from '../types/modals';

// Typed modal IDs
export type ModalId = keyof ModalDataMap;

export interface ModalCallbacks {
  onSuccess?: (result?: any) => void;
  onError?: (error: any) => void;
  onClose?: () => void;
}

interface ModalState<T extends ModalId = ModalId> {
  id: T;
  data?: ModalDataMap[T];
  callbacks?: ModalCallbacks;
  isOpen: boolean;
}

interface ModalContextValue {
  activeModal: ModalState | null;
  openModal: <T extends ModalId>(
    id: T, 
    data?: ModalDataMap[T], 
    callbacks?: ModalCallbacks
  ) => void;
  closeModal: () => void;
  updateModalData: <T extends ModalId>(data: ModalDataMap[T]) => void;
  isModalOpen: (id: ModalId) => boolean;
}

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModalContext must be used within a ModalContextProvider');
  }
  return context;
};

interface ModalContextProviderProps {
  children: React.ReactNode;
}

export const ModalContextProvider = React.memo(({ children }: ModalContextProviderProps) => {
  const [activeModal, setActiveModal] = useState<ModalState | null>(null);

  const openModal = useCallback((id: ModalId, data?: any, callbacks?: ModalCallbacks) => {
    setActiveModal({ id, data, callbacks, isOpen: true });
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  const updateModalData = useCallback((data: any) => {
    setActiveModal(prev => prev ? { ...prev, data } : null);
  }, []);

  const isModalOpen = useCallback((id: ModalId) => {
    return activeModal?.id === id && activeModal.isOpen;
  }, [activeModal]);

  const contextValue = useMemo(() => ({
    activeModal,
    openModal,
    closeModal,
    updateModalData,
    isModalOpen
  }), [activeModal, openModal, closeModal, updateModalData, isModalOpen]);

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
    </ModalContext.Provider>
  );
});

ModalContextProvider.displayName = 'ModalContextProvider';