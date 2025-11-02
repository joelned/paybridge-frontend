import React from 'react';
import { ModalState, ModalId } from '../../types/modal';
import { AddProviderModal } from './AddProviderModal';
import { UpdateProviderModal } from './UpdateProviderModal';
import { ConfirmDialog } from './ConfirmDialog';

interface Props {
  modals: ModalState;
  closeModal: (modalId: ModalId) => void;
  children: React.ReactNode;
}

export const ModalProvider: React.FC<Props> = ({ children }) => {
  return (
    <>
      {children}
      <AddProviderModal />
      <UpdateProviderModal />
      <ConfirmDialog />
    </>
  );
};