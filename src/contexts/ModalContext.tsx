// src/contexts/ModalContext.tsx
import React, { createContext, useContext } from 'react';
import { useModals } from '../hooks/useModals';
import { ModalProvider } from '../components/modals/ModalProvider';

type ModalContextType = ReturnType<typeof useModals>;

const ModalContext = createContext<ModalContextType | undefined>(undefined);

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

export const ModalContextProvider: React.FC<ModalContextProviderProps> = ({ children }) => {
  const modalState = useModals();

  return (
    <ModalContext.Provider value={modalState}>
      <ModalProvider modals={modalState.modals} closeModal={modalState.closeModal}>
        {children}
      </ModalProvider>
    </ModalContext.Provider>
  );
};