/**
 * Modal System Types
 * 
 * Generic modal system that supports:
 * - Any modal with data and callbacks
 * - Success/error handling
 * - Loading states
 * - Data refresh after operations
 */

export interface ModalCallbacks {
  onSuccess?: (result?: any) => void | Promise<void>;
  onError?: (error: any) => void;
  onClose?: () => void;
}

export interface ModalData {
  isOpen: boolean;
  data?: any;
  callbacks?: ModalCallbacks;
}

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => Promise<void> | void;
}

export type ModalId = 
  // Payment modals
  | 'retryPayment'
  | 'transactionDetails'
  | 'exportData'
  // Provider modals
  | 'addProvider'
  | 'updateProvider'
  | 'viewProviderDashboard'
  // Reconciliation modals
  | 'runReconciliation'
  | 'investigateDiscrepancy'
  // Settings modals
  | 'updateBusinessInfo'
  // Payment Links modals
  | 'createPaymentLink'
  | 'createLink'
  // General modals
  | 'confirmDialog'
  | 'success'
  | 'info'
  | 'loading';

export type ModalState = Record<ModalId, ModalData>;