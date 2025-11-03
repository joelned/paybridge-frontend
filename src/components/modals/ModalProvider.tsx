import React from 'react';
import { useModalContext } from '../../contexts/ModalContext';
import { AddProviderModal } from './AddProviderModal';
import { UpdateProviderModal } from './UpdateProviderModal';
import { ConfirmModal } from './ConfirmModal';
import { ExportDataModal } from './ExportDataModal';
import { RetryPaymentModal } from './RetryPaymentModal';
import { TransactionDetailsModal } from './TransactionDetailsModal';
import { RunReconciliationModal } from './RunReconciliationModal';
import { InvestigateDiscrepancyModal } from './InvestigateDiscrepancyModal';
import { UpdateBusinessInfoModal } from './UpdateBusinessInfoModal';
import { ViewProviderDashboardModal } from './ViewProviderDashboardModal';
import { CreateLinkModal } from './CreateLinkModal';
import { SuccessModal } from './SuccessModal';
import { InfoModal } from './InfoModal';
import { LoadingModal } from './LoadingModal';

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
          {activeModal.id === 'addProvider' && (
            <AddProviderModal 
              isOpen={true}
              onClose={closeModal}
              data={activeModal.data}
              callbacks={activeModal.callbacks}
            />
          )}
          {activeModal.id === 'updateProvider' && (
            <UpdateProviderModal 
              isOpen={true}
              onClose={closeModal}
              data={activeModal.data}
              callbacks={activeModal.callbacks}
            />
          )}
          {activeModal.id === 'confirmDialog' && (
            <ConfirmModal 
              isOpen={true}
              onClose={closeModal}
              data={activeModal.data}
              callbacks={activeModal.callbacks}
            />
          )}
          {activeModal.id === 'exportData' && (
            <ExportDataModal 
              isOpen={true}
              onClose={closeModal}
              data={activeModal.data}
              callbacks={activeModal.callbacks}
            />
          )}
          {activeModal.id === 'retryPayment' && (
            <RetryPaymentModal 
              isOpen={true}
              onClose={closeModal}
              data={activeModal.data}
              callbacks={activeModal.callbacks}
            />
          )}
          {activeModal.id === 'transactionDetails' && (
            <TransactionDetailsModal 
              isOpen={true}
              onClose={closeModal}
              data={activeModal.data}
              callbacks={activeModal.callbacks}
            />
          )}
          {activeModal.id === 'runReconciliation' && (
            <RunReconciliationModal 
              isOpen={true}
              onClose={closeModal}
              data={activeModal.data}
              callbacks={activeModal.callbacks}
            />
          )}
          {activeModal.id === 'investigateDiscrepancy' && (
            <InvestigateDiscrepancyModal 
              isOpen={true}
              onClose={closeModal}
              data={activeModal.data}
              callbacks={activeModal.callbacks}
            />
          )}
          {activeModal.id === 'updateBusinessInfo' && (
            <UpdateBusinessInfoModal 
              isOpen={true}
              onClose={closeModal}
              data={activeModal.data}
              callbacks={activeModal.callbacks}
            />
          )}
          {activeModal.id === 'viewProviderDashboard' && (
            <ViewProviderDashboardModal 
              isOpen={true}
              onClose={closeModal}
              data={activeModal.data}
              callbacks={activeModal.callbacks}
            />
          )}
          {activeModal.id === 'createPaymentLink' && (
            <CreateLinkModal 
              isOpen={true}
              onClose={closeModal}
              data={activeModal.data}
              callbacks={activeModal.callbacks}
            />
          )}
          {activeModal.id === 'success' && (
            <SuccessModal 
              isOpen={true}
              onClose={closeModal}
              data={activeModal.data}
              callbacks={activeModal.callbacks}
            />
          )}
          {activeModal.id === 'info' && (
            <InfoModal 
              isOpen={true}
              onClose={closeModal}
              data={activeModal.data}
              callbacks={activeModal.callbacks}
            />
          )}
          {activeModal.id === 'loading' && (
            <LoadingModal 
              isOpen={true}
              onClose={closeModal}
              data={activeModal.data}
              callbacks={activeModal.callbacks}
            />
          )}
        </>
      )}
    </>
  );
};