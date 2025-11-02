/**
 * Generic Modal System Hook
 * 
 * Usage patterns:
 * 
 * 1. Simple modal:
 *    openModal('addProvider')
 * 
 * 2. Modal with data:
 *    openModal('updateProvider', { provider })
 * 
 * 3. Modal with callbacks:
 *    openModal('addProvider', null, {
 *      onSuccess: () => refetchProviders(),
 *      onError: (error) => showError(error)
 *    })
 * 
 * 4. Confirm dialog:
 *    openConfirmDialog({
 *      title: 'Delete Provider',
 *      message: 'Are you sure?',
 *      onConfirm: async () => await deleteProvider(id)
 *    })
 */

import { useState, useCallback } from 'react';
import { ModalState, ModalId, ModalCallbacks, ConfirmDialogData } from '../types/modal';

const createInitialState = (): ModalState => ({
  retryPayment: { isOpen: false },
  transactionDetails: { isOpen: false },
  exportData: { isOpen: false },
  addProvider: { isOpen: false },
  updateProvider: { isOpen: false },
  viewProviderDashboard: { isOpen: false },
  runReconciliation: { isOpen: false },
  investigateDiscrepancy: { isOpen: false },
  updateBusinessInfo: { isOpen: false },
  createPaymentLink: { isOpen: false },
  createLink: { isOpen: false },
  confirmDialog: { isOpen: false },
  success: { isOpen: false },
  info: { isOpen: false },
  loading: { isOpen: false }
});

export const useModals = () => {
  const [modals, setModals] = useState<ModalState>(createInitialState());

  const openModal = useCallback((modalId: ModalId, data?: any, callbacks?: ModalCallbacks) => {
    setModals(prev => ({
      ...prev,
      [modalId]: {
        isOpen: true,
        data,
        callbacks
      }
    }));
  }, []);

  const closeModal = useCallback((modalId: ModalId) => {
    setModals(prev => {
      const modal = prev[modalId];
      if (modal.callbacks?.onClose) {
        modal.callbacks.onClose();
      }
      return {
        ...prev,
        [modalId]: { isOpen: false }
      };
    });
  }, []);

  const openConfirmDialog = useCallback((config: ConfirmDialogData) => {
    openModal('confirmDialog', config);
  }, [openModal]);

  const showSuccess = useCallback((title: string, message: string) => {
    openModal('success', { title, message });
  }, [openModal]);

  const showInfo = useCallback((title: string, message: string) => {
    openModal('info', { title, message });
  }, [openModal]);

  const showLoading = useCallback((message: string) => {
    openModal('loading', { message });
  }, [openModal]);

  const hideLoading = useCallback(() => {
    closeModal('loading');
  }, [closeModal]);

  return {
    modals,
    openModal,
    closeModal,
    openConfirmDialog,
    showSuccess,
    showInfo,
    showLoading,
    hideLoading
  };
};