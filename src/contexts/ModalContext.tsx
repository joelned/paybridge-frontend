import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { ModalDataMap } from '../types/modals';

// Typed modal IDs
export type ModalId = keyof ModalDataMap;

export interface ModalCallbacks {
  onSuccess?: (result?: unknown) => void;
  onError?: (error: unknown) => void;
  onClose?: () => void;
}

interface ModalState {
  id: ModalId;
  data?: ModalDataMap[ModalId];
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

  const openModal = useCallback(<T extends ModalId>(id: T, data?: ModalDataMap[T], callbacks?: ModalCallbacks) => {
    setActiveModal({
      id,
      data: data as ModalDataMap[ModalId] | undefined,
      callbacks,
      isOpen: true
    });
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  const updateModalData = useCallback(<T extends ModalId>(data: ModalDataMap[T]) => {
    setActiveModal((prev) =>
      prev
        ? { ...prev, data: data as ModalDataMap[ModalId] }
        : null
    );
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
