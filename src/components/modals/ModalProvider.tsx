// src/components/modals/ModalProvider.tsx
import React from 'react';
import { useModals } from '../../hooks/useModals';
import { useToast } from '../../contexts/ToastContext';
import {
  ConfirmModal,
  InfoModal,
  SuccessModal,
  LoadingModal,
  RetryPaymentModal,
  TransactionDetailsModal,
  ExportDataModal,
  AddProviderModal,
  UpdateProviderModal,
  ViewProviderDashboardModal,
  RunReconciliationModal,
  InvestigateDiscrepancyModal,
  UpdateBusinessInfoModal
} from './index';
import { CreateLinkModal } from './CreateLinkModal';

interface ModalProviderProps {
  children: React.ReactNode;
  modals: ReturnType<typeof useModals>['modals'];
  closeModal: ReturnType<typeof useModals>['closeModal'];
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children, modals, closeModal }) => {
  const { success, error } = useToast();
  return (
    <>
      {children}
      
      {/* General Modals */}
      <ConfirmModal
        isOpen={modals.confirm.isOpen}
        onClose={() => closeModal('confirm')}
        onConfirm={modals.confirm.onConfirm || (() => {})}
        title={modals.confirm.title}
        message={modals.confirm.message}
      />
      
      <InfoModal
        isOpen={modals.info.isOpen}
        onClose={() => closeModal('info')}
        title={modals.info.title}
        message={modals.info.message}
      />
      
      <SuccessModal
        isOpen={modals.success.isOpen}
        onClose={() => closeModal('success')}
        title={modals.success.title}
        message={modals.success.message}
      />
      
      <LoadingModal
        isOpen={modals.loading.isOpen}
        message={modals.loading.message}
      />
      
      {/* Payment Modals */}
      <RetryPaymentModal
        isOpen={modals.retryPayment.isOpen}
        onClose={() => closeModal('retryPayment')}
        onSubmit={(data) => {
          console.log('Retry payment:', data);
          success('Payment Retry Initiated', 'The payment will be retried with the selected provider.');
          closeModal('retryPayment');
        }}
        payment={modals.retryPayment.payment}
      />
      
      <TransactionDetailsModal
        isOpen={modals.transactionDetails.isOpen}
        onClose={() => closeModal('transactionDetails')}
        transaction={modals.transactionDetails.transaction}
      />
      
      <ExportDataModal
        isOpen={modals.exportData.isOpen}
        onClose={() => closeModal('exportData')}
        onSubmit={(data) => {
          console.log('Export data:', data);
          success('Export Started', 'Your data export is being processed. You\'ll receive a download link shortly.');
          closeModal('exportData');
        }}
        dataType={(modals.exportData.type as 'payments' | 'reconciliation' | 'providers' | 'analytics') || 'payments'}
      />
      
      {/* Provider Modals */}
      <AddProviderModal
        isOpen={modals.addProvider.isOpen}
        onClose={() => closeModal('addProvider')}
        onSubmit={(data) => {
          console.log('Add provider:', data);
          success('Provider Added', 'Payment provider has been successfully configured.');
          closeModal('addProvider');
        }}
      />
      
      <UpdateProviderModal
        isOpen={modals.updateProvider.isOpen}
        onClose={() => closeModal('updateProvider')}
        onSubmit={(data) => {
          console.log('Update provider:', data);
          success('Provider Updated', 'Provider configuration has been saved successfully.');
          closeModal('updateProvider');
        }}
        provider={modals.updateProvider.provider}
      />
      
      <ViewProviderDashboardModal
        isOpen={modals.viewProviderDashboard.isOpen}
        onClose={() => closeModal('viewProviderDashboard')}
        provider={modals.viewProviderDashboard.provider}
      />
      
      {/* Reconciliation Modals */}
      <RunReconciliationModal
        isOpen={modals.runReconciliation.isOpen}
        onClose={() => closeModal('runReconciliation')}
        onSubmit={(data) => {
          console.log('Run reconciliation:', data);
          success('Reconciliation Started', 'Transaction reconciliation is now running in the background.');
          closeModal('runReconciliation');
        }}
      />
      
      <InvestigateDiscrepancyModal
        isOpen={modals.investigateDiscrepancy.isOpen}
        onClose={() => closeModal('investigateDiscrepancy')}
        discrepancy={modals.investigateDiscrepancy.discrepancy}
      />
      
      {/* Settings Modals */}
      <UpdateBusinessInfoModal
        isOpen={modals.updateBusinessInfo.isOpen}
        onClose={() => closeModal('updateBusinessInfo')}
        onSubmit={(data) => {
          console.log('Update business info:', data);
          success('Business Information Updated', 'Your business details have been saved successfully.');
          closeModal('updateBusinessInfo');
        }}
        currentInfo={{}}
      />
      
      {/* Payment Links Modals */}
      <CreateLinkModal
        isOpen={modals.createLink.isOpen}
        onClose={() => closeModal('createLink')}
        onSubmit={(data) => {
          console.log('Create link:', data);
          success('Payment Link Created', 'Your payment link has been created successfully.');
          closeModal('createLink');
        }}
      />
    </>
  );
};