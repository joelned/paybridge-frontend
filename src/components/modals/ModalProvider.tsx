import React from 'react';
import { useModalContext } from '../../contexts/ModalContext';
import { ExportDataModal } from './ExportDataModal';

interface Props {
  children: React.ReactNode;
}

export const ModalProvider: React.FC<Props> = ({ children }) => {
  const { activeModal, closeModal } = useModalContext();

  return (
    <>
      {children}

      {/* Render active modal based on context state */}
      {activeModal?.isOpen && (
        <>
          {activeModal.id === 'exportData' && (
            <ExportDataModal
              isOpen={true}
              onClose={closeModal}
              onExport={(config) => { /* TODO: Implement Export */ }}
              {...(activeModal.data as any)}
            />
          )}
        </>
      )}
    </>
  );
};
