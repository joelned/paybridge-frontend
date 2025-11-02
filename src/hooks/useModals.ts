// src/hooks/useModals.ts
import { useState, useCallback } from 'react';

export interface ModalState {
  // Payment modals
  retryPayment: { isOpen: boolean; payment: any | null };
  transactionDetails: { isOpen: boolean; transaction: any | null };
  exportData: { isOpen: boolean; type: string | null };
  
  // Provider modals
  addProvider: { isOpen: boolean };
  updateProvider: { isOpen: boolean; provider: any | null };
  viewProviderDashboard: { isOpen: boolean; provider: any | null };
  
  // Reconciliation modals
  runReconciliation: { isOpen: boolean };
  investigateDiscrepancy: { isOpen: boolean; discrepancy: any | null };
  
  // Settings modals
  updateBusinessInfo: { isOpen: boolean };
  
  // Payment Links modals
  createLink: { isOpen: boolean };
  
  // General modals
  confirm: { isOpen: boolean; title: string; message: string; onConfirm: (() => void) | null };
  success: { isOpen: boolean; title: string; message: string };
  info: { isOpen: boolean; title: string; message: string };
  loading: { isOpen: boolean; message: string };
}

const initialState: ModalState = {
  retryPayment: { isOpen: false, payment: null },
  transactionDetails: { isOpen: false, transaction: null },
  exportData: { isOpen: false, type: null },
  addProvider: { isOpen: false },
  updateProvider: { isOpen: false, provider: null },
  viewProviderDashboard: { isOpen: false, provider: null },
  runReconciliation: { isOpen: false },
  investigateDiscrepancy: { isOpen: false, discrepancy: null },
  updateBusinessInfo: { isOpen: false },
  createLink: { isOpen: false },
  confirm: { isOpen: false, title: '', message: '', onConfirm: null },
  success: { isOpen: false, title: '', message: '' },
  info: { isOpen: false, title: '', message: '' },
  loading: { isOpen: false, message: '' }
};

export const useModals = () => {
  const [modals, setModals] = useState<ModalState>(initialState);

  const openModal = useCallback((modalName: keyof ModalState, data?: any) => {
    setModals(prev => ({
      ...prev,
      [modalName]: { ...prev[modalName], isOpen: true, ...data }
    }));
  }, []);

  const closeModal = useCallback((modalName: keyof ModalState) => {
    setModals(prev => ({
      ...prev,
      [modalName]: { ...initialState[modalName] }
    }));
  }, []);

  const closeAllModals = useCallback(() => {
    setModals(initialState);
  }, []);

  return {
    modals,
    openModal,
    closeModal,
    closeAllModals
  };
};